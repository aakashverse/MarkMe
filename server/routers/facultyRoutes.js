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
  await Session.updateMany(
    { facultyId: req.faculty.facultyId, isActive: true },
    { isActive: false, closedAt: new Date() }
  );
  
  const session = await Session.create({
    facultyId: req.faculty.facultyId,
    year, branch, subject, mode,
    isActive: true,
    startTime: new Date(),
    closedAt: null
  });
  
  res.json({ 
    sessionId: session._id,
    message: "Session started",
    session: session 
  });
});

// Close session
router.post("/closeSession", auth, async(req, res) => {
  const {sessionId} = req.body;

  const session = await Session.findById(sessionId);
  if (!session || !session.isActive) {
    return res.status(400).json({ error: "No active session" });
  }

  // close the session
  session.isActive = false;
  session.closedAt = new Date();
  await session.save();

  // get all students in this subject/year
  const students = await Student.find({
    year: session.year,
    branch: session.branch
  });

  // get students who marked present
  const presentStudents = await Attendance.find({
    sessionId,
    status: 'present'
  }).select('studentId');

  const presentStudentIds = presentStudents.map(a => a.studentId.toString());
  // mark students absent who did'nt attend
  for(const student of students){
    if(!presentStudentIds.includes(student._id.toString())){
      let subjectRecord = student.attendance.find(a => a.subject === session.subject);
      if(!subjectRecord){
        subjectRecord = {subject: session.subject, total:0, present:0};
        student.attendance.push(subjectRecord);
      }

      subjectRecord.total += 1; 
      await student.save();

      // Create absent record
      await Attendance.create({
        studentId: student._id,
        sessionId,
        subject: session.subject,
        status: 'absent',
        markedAt: new Date()
      });
    }
  }
  
  res.json({ message: "Session closed successfully" });
});

// Check active session (for dashboard)
router.get("/activeSession", auth, async (req, res) => {
  const session = await Session.findOne({ 
    facultyId: req.faculty.facultyId, 
    isActive: true, 
    closedAt: null
  }).populate('facultyId');

  if(!session){
    return res.json({hasActiveSession:false});
  }

  res.json({ hasActiveSession: true, session });
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
