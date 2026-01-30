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
            unique: true,
            required: true,
        },
        attendance: {
            type: [
              {
                subject: String,
                total: {type: Number, default: 0 },
                present: {type: Number, default: 0 }
              }
            ],
            default: []
        },
        faceDescriptorCode: {
            type: [Number],
            required: true,
        },
        password: {
            type: String,
            required : true,
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