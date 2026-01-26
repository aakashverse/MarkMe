const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Faculty = require('../models/Faculty.models');
const Session = require('../models/Session.models');
const Student = require("../models/Student.models")
const Attendance = require("../models/Attendance.models")
const auth = require('../Middlewares/auth');

// faculty signup
router.post("/signup", async (req, res) => {
  console.log('faculty sign-in reached');
  const { facultyId, password } = req.body;
  console.log(req.body);
  
  try{
      const exists = await Faculty.findOne({ facultyId });
      console.log(exists);
    
      if (exists) {
        return res.status(400).json({ error: "Faculty already exists" });
      }
    
      const hashed = await bcrypt.hash(password, 10);
    
      const faculty = await Faculty.create({
        facultyId,
        password: hashed,
      });
    
      const token = await faculty.generateToken();
    
      res.status(201).json({
        message: "Signup successful",
        token: token
      });
  } catch(error){
    console.log('Signup error:', error);
    res.status(500).json({error: "Server error"});
  }
});

// fac login
router.post("/login", async (req, res) => {
  const { facultyId, password } = req.body;

  const faculty = await Faculty.findOne({ facultyId });
  if (!faculty) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, faculty.password);
  if (!match) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({
    message: "Login successful",
  });
});

// session routes
// session start
router.post("/openSession", auth, async (req, res) => {
  const { year, branch, subject, mode } = req.body;
  console.log(req.body);
  
  // existing session close
  await Session.findOneAndUpdate(
    { facultyId: req.faculty.facultyId, isActive: true },
    { isActive: false, endTime: new Date() }
  );
  
  const session = await Session.create({
    facultyId: req.faculty.facultyId,
    year, branch, subject, mode,
    isActive: true,
    startTime: new Date()
  });
  
  res.json({ 
    sessionId: session._id,
    message: "Session started",
    session: session 
  });
});

// Close session
router.post("/closeSession", auth, async (req, res) => {
  const session = await Session.findOneAndUpdate(
    { facultyId: req.faculty.facultyId, isActive: true },
    { isActive: false, endTime: new Date() },
    { new: true }
  );
  
  if (!session) {
    return res.status(400).json({ error: "No active session" });
  }
  
  res.json({ message: "Session closed" });
});

// Check active session (for dashboard)
router.get("/activeSession", auth, async (req, res) => {
  const session = await Session.findOne({ 
    facultyId: req.faculty.facultyId, 
    isActive: true 
  }).populate('facultyId');

  res.json({ hasActiveSession: !!session, session });
});

// student attendance dash
// router.post("/studentAttendance", auth, async (req, res) => {
//   const { rollno } = req.body;
  
//   const student = await Student.findOne({ rollno });
//   if (!student) {
//     return res.status(404).json({ error: "Student not found" });
//   }

//   const subjectWise = await Attendance.aggregate([
//     { $match: { studentId: student._id, status: "present" } },
//     {
//       $group: {
//         _id: "$subject",
//         present: { $sum: 1 }
//       }
//     }
//   ]);

//   res.json({
//     rollno: student.rollno,
//     year: student.year,
//     branch: student.branch,
//     attendance: subjectWise.map(s => ({
//       subject: s._id,
//       present: s.present
//     }))
//   });


// });

router.post('/studentAttendance', auth, async (req, res) => {
  try {
    const { rollno } = req.body;
    
    const student = await Student.findOne({ rollno })
      .select('rollno year branch attendance');
    
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // clean
    const cleanAttendance = Array.isArray(student.attendance) 
      ? student.attendance
          .filter(a => a && a.subject && typeof a.total === 'number')
          .map(a => ({
            subject: a.subject,
            total: Number(a.total) || 0,
            present: Number(a.present) || 0
          }))
      : [];

    console.log("Sending attendance:", cleanAttendance);

    res.json({
      rollno: student.rollno,
      year: student.year,
      branch: student.branch,
      attendance: cleanAttendance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
