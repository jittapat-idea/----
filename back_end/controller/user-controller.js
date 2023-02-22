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
const users = require('../model/users.js');
const { borrowitem } = require('./borrow-controller.js');

userLinks = [
   { href: '/home', label: 'Home'  },
   { href: '/items', label: 'Items'},
   { href:'/logout',label:'logout'}
 ];
adminLinks = [
   { href: '/home', label: 'Home'  },
   { href: '/items', label: 'Items' },
   { href: '/add-item', label: 'Add Item' },
   { href:'/logout',label:'logout'}
 ];
 
 var currentYear=(new Date().getFullYear())
var session
exports.index = async(req,res)=>{
   session = req.session;
   const username = session.userid
   if(session.userid){
      const user = await users.findOne({name:username}).populate('borrowedItems').exec()
      if(user.role == 'admin'){
         res.render("home", {
            navLinks:adminLinks,
            userName:username,
            borrowedItems:user.borrowedItems,
            currentYear,
           })
      }else{
         res.render("home", {
            navLinks:userLinks,
            userName:username,
            borrowedItems:user.borrowedItems,
            currentYear,
         })
      }
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
   const {name , email , password} = req.body;
   const role = "user"
   try{
       const check= await users.findOne({email:email})
       if(!check && name != ''&& password != '' && email != ''){
         const user = new users({
            name,
            email,
            password,
            role
          })
          await user.save()
          res.render("login")
       }
       else if(name == ''|| password == '' || email == ''){
         res.render("error", {message: 'incomplete information'})
       }
       else{
         res.render("error", {message: 'your email is already use'})
       }
   }
   catch{
      res.render("error", {message: 'error'})
   }
 }

 exports.login = async(req,res)=>{
   
   try{
      const check= await users.findOne({name:req.body.name})
      if(!check){
         res.render("error", {message: 'your name is worng'})
      }
      const isvalid = await check.ischeckpassword(req.body.password)
      console.log(isvalid);
      if(isvalid){
         session=req.session;
         session.userid=req.body.name;
         console.log(check.role)
         console.log(req.session)
         const username = session.userid
         const user = await users.findOne({name:username}).populate('borrowedItems').exec()
         if(check.role == 'admin'){
            res.render("home", {
               navLinks:adminLinks,
               userName:username,
               borrowedItems:user.borrowedItems,
               currentYear,
               userRole:check.role
              })
         }else{
            res.render("home", {
               navLinks:userLinks,
               userName:username,
               borrowedItems:user.borrowedItems,
               currentYear,
               userRole:check.role
            })
         }
      }
      else{
         res.render("error", {message: 'your password is worng'})
      }
   }
   catch{
      if(!req.body.name || !req.body.password){
         res.render("error", {message: 'name or password invalid'})
      }
      else{
         res.render("error", {message: 'session error'})
      }
   }
   
 }

 exports.isAdmin = async(req,res,next) => {
   const name = req.session.userid
   const check= await users.findOne({name:name})
   console.log(check)
   if(check){
      if(check && check.role === "admin"){
         next()
      }
      else{
         res.render("error", {message: 'your are not Admin'})
      }
   }else{
      res.render("error", {message: 'No user found'})
   }
   
 }