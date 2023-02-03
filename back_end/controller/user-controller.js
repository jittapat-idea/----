// const users = require('../model/users')

// exports.index = (req,res) => {
//     res.send('<h1>User Application</h1><hr><a href="api/user">รายชื่อ user</a>')
// }

// //ฟังก์ชั่น หาทั้งหมด
// exports.findAll = (req,res) => {
//     users.find().then(data => {
//         res.json(data)
//     }).catch(err => {
//         res.status(500).send({
//             msg: err.message
//         })
//     })
// }

// //ฟังก์ชั่น สร้าง ID Json ใหม่
// exports.create = (req,res) => {
//     const c = new users(req.body)

//     c.save().then(data =>{
//         res.json(data)
//     }).catch(err => {
//         return res.status(500).json({
//             msg: "ไม่สามารถเพิ่มข้อมูลได้เนื่องจาก : " + err.message 
//         })
//     })
// }

// //ฟังก์ชั่น หาดวย ID Json เเค่ 1 record
// exports.findById = (req,res) => {
//     users.findById(req.params.userID).then(data =>{
//         if(!data){
//             return res.status(404).json({
//                 msg: "ไม่พบ record รหัส : " + req.params.userID
//             })
//         }
//         res.json(data)
//     }).catch(err => {
//         return res.states(500).json({
//             msg: "เกิดข้อผิดพลาด เนื่องจาก : " + err.message
//         })
//     })
// }

// exports.update = (req,res) => {
//     users.findByIdAndUpdate(req.params.userID, {$set: req.body},{new: true}).then(data =>{
//         if(!data){
//             return res.status(404).json({
//                 msg: "ไม่พบ record รหัส : " + req.params.userID
//             })
//         }
//         res.json(data)
//     }).catch(err => {
//         return res.states(500).json({
//             msg: "เกิดข้อผิดพลาด เนื่องจาก : " + err.message
//         })
//     })
// }

// exports.delete = (req,res) => {
//     users.findByIdAndDelete(req.params.userID).then(data =>{
//         if(!data){
//             return res.status(404).json({
//                 msg: "ไม่พบ record รหัส : " + req.params.userID
//             })
//         }
//         res.json({msg: "ลบข้อมูลเรียบร้อยเเล้ว+++"})
//     }).catch(err => {
//         return res.states(500).json({
//             msg: "เกิดข้อผิดพลาด เนื่องจาก : " + err.message
//         })
//     })
// }

//const sessions = require('express-session')
const users = require('../model/users.js')

const navLinks = [
   { href: '/', label: 'Home' },
   { href: '/items', label: 'Items' },
   { href: '/about', label: 'About' },
 ];

var session
exports.index = (req,res)=>{
   session = req.session;
   if(session.userid){
      res.render("home", { navLinks })
   }else
   res.render("login")
   
    
 }
 exports.logout = (req,res)=>{
   req.session.destroy();
   res.redirect('/');
 }

 exports.loginpage = (req,res) =>{
   res.render("login")
 }

 exports.signup = (req,res)=>{
    res.render("signup")
 }

 exports.signup_db = async(req,res)=>{
   const data = {name , email , password} = req.body;
   //  const data = {
   //     email:req.body.email,
   //     name:req.body.name,
   //     password:req.body.password
   //  }
    const user = new users({
      name,
      email,
      password
    })
    //await users.insertMany([data])
    await user.save()
    
    res.render("login")
 }

 exports.login = async(req,res)=>{

   try{
      
      const check= await users.findOne({name:req.body.name})
      const isvalid = await check.ischeckpassword(req.body.password)
      console.log(isvalid);
      if(isvalid ){
         session=req.session;
         session.userid=req.body.name;
         console.log(req.session)
         res.render("home", { navLinks })
      }
      else{
         res.send("password wrong")
      }
   }
   catch{
      res.send("wrong detail")
   }
   
 }