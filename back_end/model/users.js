const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    
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
    },
    role:{
        type:String,
        default:"user",
        enum:["user","admin"]
    },
    borrowedItems: [{
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "items"
        },
        quantity: {
          type: Number
        }
      }]
})

userSchema.pre('save', async function (next){
    try{
      const salt = await bcrypt.genSalt(10)
      const hashpassword = await bcrypt.hash(this.password,salt);
      this.password = hashpassword;
      console.log(this.name,this.email,this.password)
      next()
    }
    catch(error){
        next(error)
    }
})

userSchema.methods.ischeckpassword = async function (password) {
    try{
        return await bcrypt.compare(password,this.password);
    }
    catch(error){
        next(error);
    }
}


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