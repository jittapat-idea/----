const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    //UserID: Number,
    name:{
        type:String,
        required:true
    } ,
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        required:true
    }
})

module.exports =new mongoose.model("user",userSchema);


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