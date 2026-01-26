const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  facultyId: { type: String, required: true },
  year: String,
  branch: String,
  subject: String,
  mode: { type: String, enum: ['online', 'offline'] },
  isActive: { type: Boolean, default: false },
  startTime: Date,
  endTime: Date
}, { timestamps: true });

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
