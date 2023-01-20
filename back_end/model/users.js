const mongoose = require('mongoose')

const StudentSchema = mongoose.Schema(
    {
        StudentId: Number,
        FullName: String,
        Email: String
    },
    {
        versionKey: false
    }
)

const TeacherSchema = mongoose.Schema(
    {
        TeacherId: Number,
        FullName: String,
        Email: String
    },
    {
        versionKey: false
    }
)

module.exports = {
    Student: mongoose.model('Student_user',StudentSchema),
    Teacher: mongoose.model('Teacher_user',TeacherSchema)
}