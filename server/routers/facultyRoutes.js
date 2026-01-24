const express = require("express");
const bcrypt = require("bcryptjs");
const FacultyAuth = require("../models/FacultyAuth");
const router = express.Router();

// FACULTY SIGNUP
router.post("/signup", async (req, res) => {
  const { facultyId, password } = req.body;

  const exists = await FacultyAuth.findOne({ facultyId });
  if (exists) {
    return res.status(400).json({ error: "Faculty already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const faculty = await FacultyAuth.create({
    facultyId,
    password: hashed,
  });

  res.status(201).json({
    message: "Signup successful",
    token: await faculty.generateToken(),
  });
});

// FACULTY LOGIN
router.post("/login", async (req, res) => {
  const { facultyId, password } = req.body;

  const faculty = await FacultyAuth.findOne({ facultyId });
  if (!faculty) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, faculty.password);
  if (!match) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({
    message: "Login successful",
    token: await faculty.generateToken(),
  });
});

module.exports = router;
