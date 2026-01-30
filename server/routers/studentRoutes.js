const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student.models");
const Session = require("../models/Session.models");
const Attendance = require("../models/Attendance.models");
const studentAuth = require("../Middlewares/studentAuth")

const generateStudentToken = (studentId) => {
  return jwt.sign({ studentId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// register student
router.post("/register", async(req, res) => {
  try {
    console.log("register body: ", req.body);
    const { year, branch, rollno, faceDescriptor, password } = req.body;

    if (!year || !branch || !rollno || !faceDescriptor?.length || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const exists = await Student.findOne({ rollno });
    if (exists) {
      return res.status(409).json({ error: "Student already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await Student.create({
      year,
      branch,
      rollno,
      password: hashedPassword,
      faceDescriptor,
    });
    console.log("student regis: ", student);

    res.status(201).json({ message: "Student registered", student });
  } catch (err) {
    console.error("Register error:",err);
    res.status(500).json({ error: "Server error" });
  }
});

// login
router.post("/login", async (req, res) => {
  try{

    const { rollno, password } = req.body;
    if (!rollno || !password) {
      return res.status(400).json({ error: "Rollno and password required" });
    }
    
    const student = await Student.findOne({ rollno: Number(rollno) });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    const match = await bcrypt.compare(password, student.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const token = generateStudentToken(student._id);
    
    res.json({
      message: "Login successful",
      token,
      student: {
        id: student._id,
        rollno: student.rollno,
        year: student.year,
        branch: student.branch,
      },
    });
    }catch (err) {
      console.log("Student login error:", err.message);
      res.status(500).json({ error: "Server error" });
    }
});

// student check active session
router.get("/activeSession", studentAuth, async (req, res) => {
  try {
    // find active session
    const session = await Session.findOne({ isActive: true });

    if (!session) {
      return res.json({ hasActiveSession: false });
    }

    // optional: if session expired
    if (session.endTime && new Date() > session.endTime) {
      session.isActive = false;
      session.closedAt = new Date();
      await session.save();
      return res.json({ hasActiveSession: false });
    }

    return res.json({
      hasActiveSession: true,
      sessionId: session._id,
      subject: session.subject,
    });
  } catch (err) {
    console.log("activeSession error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// mark attendance
router.post('/markAttendance', studentAuth, async (req, res) => {
  try {
    const {  subject, sessionId, descriptor } = req.body;
    console.log('markAtt reached: ', req.body);
    
    if (!subject || !sessionId || !Array.isArray(descriptor) || descriptor.length !== 128) {
      return res.status(400).json({ error: "Invalid or missing fields" });
    }

    const student = req.student;
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    // delete invalid entries
    // student.attendance = student.attendance.filter(entry => 
    //   entry && typeof entry === 'object' && entry.subject
    // );
    // if (!Array.isArray(student.attendance)) student.attendance = [];

    const session = await Session.findById(sessionId);
    if(!session || !session.isActive) {
      return res.status(400).json({ error: "No active session" });
    }
    
    // session expiry check
    if (session.endTime && new Date() > session.endTime) {
      session.isActive = false;
      session.closedAt = new Date();
      await session.save();
      return res.status(400).json({ error: "Session expired" });
    }
 
    // subject match 
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
    
    // imp
    student.markModified("attendance");
    await student.save();

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
