const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// register student
router.post("/register", async (req, res) => {
  try {
    const { year, branch, rollno, faceDescriptor } = req.body;

    if (!year || !branch || !rollno || !faceDescriptor) {
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
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// get student dash
router.post("/dashboard", async (req, res) => {
  const { rollno } = req.body;
  const student = await Student.findOne({ rollno });

  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  res.json(student);
});

module.exports = router;
