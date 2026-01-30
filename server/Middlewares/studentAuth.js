const jwt = require('jsonwebtoken');
const Student = require('../models/Student.models');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Student.findById(decoded.studentId).select("-__v");
    if (!student) return res.status(401).json({ error: "Student not found" });

    req.student = student; // very important
    next();
  } catch (err) {
    console.log("StudentAuth error:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};
