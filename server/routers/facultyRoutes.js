const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Faculty = require('../models/Faculty');
const Session = require('../models/Session');

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
  
  // existing session close
  await Session.findOneAndUpdate(
    { facultyId: req.faculty.facultyId, isActive: true },
    { isActive: false }
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
  });
  res.json({ hasActiveSession: !!session });
});


module.exports = router;
