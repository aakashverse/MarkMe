const express = require("express");
const router = express.Router();
const Student = require("../models/Student.models");
const Session = require("../models/Session.models");
const Attendance = require("../models/Attendance.models");
const auth = require("../Middlewares/auth");

// register student
router.post("/register", auth, async(req, res) => {
  try {
    console.log(req.body);
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
router.get("/activeSession", auth, async (req, res) => {
  const session = await Session.findOne({ isActive: true });

  res.json({
    hasActiveSession: !!session,
    sessionId: session?._id,
    subject: session?.subject,
    year: session?.year,
    branch: session?.branch,
    mode: session?.mode
  });
});


// mark attendance
// router.post('/markAttendance', auth, async(req, res) => {
//   try {
//     const { rollno, subject, sessionId, descriptor } = req.body;
    
//     // validate inputs
//     if (!rollno || !subject || !sessionId || !descriptor) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const student = await Student.findOne({ rollno });
//     if (!student) {
//       return res.status(404).json({ error: "Student not found" });
//     }
    
//     // ensure student.attendance is array
//     if (!Array.isArray(student.attendance)) {
//       student.attendance = [];
//     }

//     // Check active session
//     const session = await Session.findById(sessionId);
//     if (!session || !session.isActive) {
//       return res.status(400).json({ error: "No active session" });
//     }

//     // Prevent duplicate attendance
//     const alreadyMarked = await Attendance.findOne({
//       studentId: student._id,
//       sessionId
//     });
//     if (alreadyMarked) {
//       return res.status(400).json({ error: "Attendance already marked" });
//     }

//     // create attndnc record
//     const markedStudent = await Attendance.create({
//       studentId: student._id,
//       sessionId,
//       subject,
//       descriptor,  
//       status: 'present',
//       markedAt: new Date()
//     });

//     // update subject->attendance
//     let subjectRecord = student.attendance.find(a => a.subject === subject);
//     if (!subjectRecord) {
//       subjectRecord = { subject, total: 0, present: 0 };
//       student.attendance.push(subjectRecord);
//     }
//     subjectRecord.total += 1;
//     subjectRecord.present += 1;
//     await student.save();

//     res.status(201).json({ 
//       message: "Attendance marked successfully!", 
//       rollno: student.rollno,
//       attendanceId: markedStudent._id 
//     });
//   } catch (err) {
//     console.error("Attendance error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });
router.post('/markAttendance', auth, async (req, res) => {
  try {
    const { rollno, subject, sessionId, descriptor } = req.body;
    
    if (!rollno || !subject || !sessionId || !descriptor) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const student = await Student.findOne({ rollno });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    // delete invalid entries
    // student.attendance = student.attendance.filter(entry => 
    //   entry && typeof entry === 'object' && entry.subject
    // );
    // if (!Array.isArray(student.attendance)) student.attendance = [];

    const session = await Session.findById(sessionId);
    if (!session || !session.isActive) {
      return res.status(400).json({ error: "No active session" });
    }

    const alreadyMarked = await Attendance.findOne({
      studentId: student._id,
      sessionId
    });
    if (alreadyMarked) {
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
    let subjectRecord = student.attendance.find(a => a.subject === subject);
    if (!subjectRecord) {
      subjectRecord = { subject, total: 0, present: 0 };
      student.attendance.push(subjectRecord);
    }
    
    subjectRecord.total = Number(subjectRecord.total) || 0;
    subjectRecord.present = Number(subjectRecord.present) || 0;
    
    subjectRecord.total += 1;
    subjectRecord.present += 1;
    
    console.log(`Updated ${subject}: ${subjectRecord.present}/${subjectRecord.total}`);
    
    await student.save();

    res.status(201).json({ 
      message: "Attendance marked successfully!", 
      rollno: student.rollno 
    });
  } catch (err) {
    console.error("Attendance error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
