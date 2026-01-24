const mongoose = require("mongoose");

const FacultySchema = mongoose.Schema({
    facultyId: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required : true,
    }

});

const Faculty = mongoose.model("Faculty", FacultySchema);
module.exports = Faculty;