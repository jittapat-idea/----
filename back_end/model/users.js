const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    UserID: Number,
    FullName: String,
    Email: String,
    Password: String
})

module.exports = mongoose.model("user",userSchema);


// const StudentSchema = mongoose.Schema(
//     {
//         StudentId: Number,
//         FullName: String,
//         Email: String
//     },
//     {
//         versionKey: false
//     }
// )

// const TeacherSchema = mongoose.Schema(
//     {
//         TeacherId: Number,
//         FullName: String,
//         Email: String
//     },
//     {
//         versionKey: false
//     }
// )

// module.exports = {
//     Student: mongoose.model('Student_user',StudentSchema),
//     Teacher: mongoose.model('Teacher_user',TeacherSchema)
// }