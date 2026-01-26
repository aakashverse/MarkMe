const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student', 
        required: true 
    },

    sessionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Session', 
        required: true 
    },

    subject: {
        type: String,
        required: true
    },

    descriptor: [Number], 

    status: { 
        type: String, 
        enum: ['present', 'absent'], 
        default: 'absent' 
    },

    markedAt: { type: Date, default: Date.now }
});

// avoids proxy or double attnd.
AttendanceSchema.index(
  { studentId: 1, sessionId: 1 },
  { unique: true }
);


const Attendance = mongoose.model('Attendance', AttendanceSchema); 
module.exports = Attendance;
