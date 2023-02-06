const items = require('../model/items.js')

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

exports.Additems_db = async(req,res) =>{
    const {itemname , description , quantity} = req.body;
   try{
       console.log("you try")
       const check= await items.findOne({itemname:itemname})
       if(!check && itemname != ''&& description != '' && quantity != ''){
         const data = {
            itemname,
            description,
            quantity
          }
          await items.insertMany([data])
          res.redirect('/home');
       }
       else if(itemname == ''|| description == '' || quantity == ''){
         res.render("error", {message: 'incomplete information'})
       }
       else{
         res.render("error", {message: 'your already have this item'})
       }
   }
   catch{
      res.render("error", {message: 'error'})
   }

}