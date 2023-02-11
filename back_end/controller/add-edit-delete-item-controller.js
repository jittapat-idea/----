const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const items = require('../model/items.js')
const fs = require('fs')

const storage = multer.diskStorage({
  destination:"./public/uploads/",
  filename: function(req,file,cb){
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    )
  }
})

const upload = multer({
  storage: storage,
  limits:{fileSize:5000000},
  fileFilter: function(req, file, cb){
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if(mimetype && extname){
      return cb(null,true)
    }
    cb("Error: File upload only supports the following filetypes - " + filetypes);
  }
}).single("image")

const navLinks = [
    { href: '/home', label: 'Home' },
    { href: '/items', label: 'Items' },
    { href: '/add-item', label: 'Add Item' },
    { href:'/logout',label:'logout'}
  ];
  var currentYear=(new Date().getFullYear())

exports.Additems = (req, res)=>{
    session = req.session;
    if(session.userid){
        res.render("add_item",{
            navLinks,
            userName:session.userid,
            currentYear
        })
    }else
    res.render("login")
}

exports.Additems_db = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.render("error", { message: err });
    }
    if(!req.file){
      return res.render("error",{ message: "not file upload" })
    }
    const { itemname, description, quantity } = req.body;
    try {
      console.log("you try");
      const check = await items.findOne({ itemname: itemname });
      if (!check && itemname != "" && description != "" && quantity != "") {
        sharp(req.file.path)
        .resize(200)
        .toFile("./public/uploads/resized-" + req.file.filename, async(err) =>{
          if(err){
            return res.render("error", { message: err });
          }
          const data = {
            itemname,
            description,
            quantity,
            imageURL:"resized-" + req.file.filename,
          };
          await items.insertMany([data]);
          res.redirect("/home");
        })
      } else if (itemname == "" && description == "" && quantity == "") {
        res.render("error", { message: "incomplete information" });
      } else {
        res.render("error", { message: "you already have this item" });
      }
    } catch(error){
      res.render("error", { message: error });
    }
  });
};


exports.edititem = (req, res)=>{
  session = req.session;
  if(session.userid){
      items.findById(req.params.id).then(data =>{
        if(!data){
          return res.status(404).json({
            msg: "ไม่พบ record รหัส : " + req.params.userID
          })
        }
        res.render("edit_item",{
          navLinks,
          userName:session.userid,
          currentYear,
          id: req.params.id,
          item: data
        })
      }).catch(err => {
        return res.states(500).json({
          msg: "เกิดข้อผิดพลาด เนื่องจาก : " + err.message
        })
      })
  }else
  res.render("login")
}

exports.edititem_db = async (req, res) => {
  const {itemname , description , quantity} = req.body;
  const id = req.params.id
  try {
    console.log(req.params.id);
    const item = await items.findById(id);
    if (!item) {
      return res.status(404).send("Item not found");
    }
    else if(itemname != ''&& description != '' && quantity != ''){
      item.itemname = itemname;
      item.description = description;
      item.quantity = quantity;
      await item.save();
      res.redirect('/items');
    }
    else if(itemname == ''|| description == '' || quantity == ''){
      res.render("error", {message: 'incomplete information'})
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};
exports.deletez = (req, res) => {
  console.log(req.params.id)
  items.findById(req.params.id)
    .then(data => {
      if (!data) {
        return res.status(404).json({
          msg: "No record found with ID: " + req.params.id
        });
      }
      console.log(`data.imageURL:${data.imageURL}`)
      
      fs.unlink(`./public/uploads/${data.imageURL}`, (err) => {
        if (err) {
          console.error(err);
        }
        const originalFilename = data.imageURL.replace('resized-','');
        fs.unlink(`./public/uploads/${originalFilename}`, (err) => {
          if (err) {
            console.error(err);
          }
          items.findByIdAndDelete(req.params.id)
            .then(() => {
              res.redirect("/items");
            });
        });
      });
    })
    .catch(err => {
      return res.status(500).json({
        msg: "An error occurred: " + err.message
      });
    });
};

// exports.edititem_db = (req, res) =>{
//   items.findByIdAndUpdate(req.params.id,{$set: req.body},{new: true})
//     .then(data => {
//       if (!data) {
//         return res.status(404).json({
//           msg: "ไม่พบ Record รห้ส: " + req.params.id
//         })
//       }
//       // Redirect to the Show Item Page
//       res.redirect("/items");
//     }).catch(err => {
//       return res.status(500).json({
//         msg: "ไม่สามารถ update ข้อมูลได้ เนื่องจาก: " + err.message
//       })
//     })
// }


