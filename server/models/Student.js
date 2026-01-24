const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema({
        year: {
            type: String,
            required: true
        },
        branch: {
            type: String,
            required: true,
        },
        rollno: {
            type: Number,
            required: true,
        },
        attendance: {
            type: Number,
            default: 0,
        },
        faceDescriptorCode: {
            type: [String],
            // required: true,
        },
        lat: {
            type: Number,
        },
        log: {
            type: Number,
        }
    }
);

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;