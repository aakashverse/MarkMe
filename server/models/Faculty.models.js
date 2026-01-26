const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

    const FacultySchema = mongoose.Schema(
    {
        facultyId: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required : true,
        },
    });

    FacultySchema.methods.generateToken = async function() {
        return jwt.sign(
            { _id: this._id, facultyId: this.facultyId }, 
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
    };


const Faculty = mongoose.model("Faculty", FacultySchema);
module.exports = Faculty;