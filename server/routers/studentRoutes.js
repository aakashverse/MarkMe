const express = require("express");
const router = express.Router();
const Student = require("../models/Student.models");
const Session = require("../models/Session.models");
const Attendance = require("../models/Attendance.models");
const auth = require("../Middlewares/auth");

// register student
router.post("/register", async(req, res) => {
  try {
    // console.log(req.body);
    const { year, branch, rollno, faceDescriptor } = req.body;

    if (!year || !branch || !rollno || !faceDescriptor?.length) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const exists = await Student.findOne({ rollno });
    if (exists) {
      return res.status(409).json({ error: "Student already exists" });
    }

    const student = await Student.create({
      year,
      branch,
      rollno,
      faceDescriptor,
    });

    res.status(201).json({ message: "Student registered", student });
  } catch (err) {
    console.error("Register error:",err);
    res.status(500).json({ error: "Server error" });
  }
});


// student check active session
router.get("/activeSession", async (req, res) => {
  try {
    const { rollno } = req.query;  // OR req.body
    // if (!rollno) return res.status(400).json({ error: "rollno required" });

    const student = await Student.findOne({rollno : Number(rollno)});
    if (!student) return res.status(404).json({ error: "Student not found" });

    const session = await Session.findOne({
      isActive: true,
      year: student.year,
      branch: student.branch,
    }).sort({ createdAt: -1 });

    if (!session) {
      return res.json({ hasActiveSession: false });
    }
    
    // auto close session
    if (session.endTime && new Date() > session.endTime) {
      session.isActive = false;
      // session.closedAt = new Date();
      await session.save();
  
      return res.json({ hasActiveSession: false });
    }

    res.json({
      hasActiveSession: true,
      sessionId: session?._id,
      subject: session?.subject,
      year: session?.year,
      branch: session?.branch,
      mode: session?.mode,
    });
  } catch (err) {
    console.log("activesess error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// mark attendance
router.post('/markAttendance', async (req, res) => {
  try {
    const { rollno, subject, sessionId, descriptor } = req.body;
    console.log('markAtt reached: ', req.body);
    
    if (!rollno || !subject || !sessionId || !Array.isArray(descriptor) || descriptor.length !== 128) {
      return res.status(400).json({ error: "Invalid or missing fields" });
    }

    const student = await Student.findOne({ rollno: Number(rollno)});
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    // delete invalid entries
    // student.attendance = student.attendance.filter(entry => 
    //   entry && typeof entry === 'object' && entry.subject
    // );
    // if (!Array.isArray(student.attendance)) student.attendance = [];

    const session = await Session.findById(sessionId);
    if (session.endTime && new Date() > session.endTime) {
      session.isActive = false;
      session.closedAt = new Date();
      await session.save();
      return res.status(400).json({ error: "Session expired" });
    }
 
    // if(!session || !session.isActive) {
    //   return res.status(400).json({ error: "No active session" });
    // }
    
    // subject match with session subject
    if(session.subject !== subject) {
      return res.status(400).json({ error: "Subject mismatch with active session" });
    }

    const alreadyMarked = await Attendance.findOne({
      studentId: student._id,
      sessionId
    });

    if(alreadyMarked) {
      return res.status(400).json({ error: "Attendance already marked" });
    }

    // Create attendance record
    await Attendance.create({
      studentId: student._id,
      sessionId,
      subject,
      descriptor,
      status: 'present',
      markedAt: new Date()
    });

    // update subject attendance 
    let idx = student.attendance.findIndex(a => a.subject === subject);
    
    if (idx === -1) {
      student.attendance.push({ subject, total: 1, present: 1 });
    } else {
      student.attendance[idx].total = (Number(student.attendance[idx].total) || 0) + 1;
      student.attendance[idx].present = (Number(student.attendance[idx].present) || 0) + 1;
    }
    
    // IMPORTANT
    student.markModified("attendance");
    
    await student.save();

    
    console.log(`Updated ${subject}: ${subjectRecord.present}/${subjectRecord.total}`);

    res.status(201).json({ 
      message: "Attendance marked successfully!", 
      rollno: student.rollno 
    });
  } catch (err) {
    console.error("Attendance error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
