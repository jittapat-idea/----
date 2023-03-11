const items = require('../model/items.js')
const users = require('../model/users.js')

userLinks = [
  { href: '/home', label: 'Home'  },
  { href: '/items', label: 'Items'},
  { href:'/logout',label:'logout'}
];
adminLinks = [
  { href: '/home', label: 'Home'  },
  { href: '/items', label: 'Items' },
  { href: '/add-item', label: 'Add Item' },
  { href:'/logout',label:'logout'},
];

var currentYear=(new Date().getFullYear())
exports.getAllitems = async(req, res) => {
    session = req.session;
    const username = session.userid
    const user = await users.findOne({name:username})
    
    userRole = user.role
    if(session.userid){
        if(user.role == 'admin'){
          items.find().then(data =>{
            console.log(user.role)
            res.render("items",{
              navLinks:adminLinks,
              showitem:data,
              userName:session.userid,
              currentYear,
              userRole
            })
          }).catch(err => {
            res.render("error", {message: err.message});
            
        })
        }else{
          items.find().then(data => {
              res.render("items",{
                  navLinks:userLinks,
                  showitem:data,
                  userName:session.userid,
                  currentYear,
                  userRole
              })
          }).catch(err => {
              res.render("error", {message: err.message});
          })
        }
    }else
    res.render("login")
}

exports.borrowitem = async(req, res) =>{
    session = req.session;
    const username = session.userid
    const user = await users.findOne({name:username})
    const id = req.params.id;
    if(session.userid){
        items.findById( id,(err,item) =>{
            if(err) return res.render("error", {message: 'error finding item'});
            if(!item) return res.render("error", {message: 'item not found'});
            if(user.role == 'admin'){
              res.render('borrow_item',{
                item,
                navLinks:adminLinks,
                currentYear,
                userName:session.userid,
                userRole:user.role
              })
            }else{
              res.render('borrow_item',{
                  item,
                  navLinks:userLinks,
                  currentYear,
                  userName:session.userid,
                  userRole:user.role
              })
            }
        })
    }else
    res.render("login")
}


exports.borrowitem_db = (req, res, next) => {
  session = req.session;
  const itemId = req.body.itemId;
  const borrowAmount = req.body.borrowAmount;
  console.log(itemId);
  console.log(session.userid);
  const username = session.userid;
  items.findById(itemId)
    .then(item => {
      if (!item) {
        return res.render("error", {message: 'error finding item'});
      }
      if (!item.quantity) {
        return res.render("error", {message: 'Item quantity not defined'});
      }
      if (item.quantity < borrowAmount) {
        return res.render("error", {message: 'Not enough Item '});
      }
      if(!borrowAmount || borrowAmount == 0){
        return res.render("error", {message: 'Amount invalid'});
      }
      
      // Update the item quantity
      item.quantity -= borrowAmount;
      item
        .save()
        .then(() => {
          // Add the borrowed item to the user's profile
          users.findOne({name: username})
            .then(user => {
              user.borrowedItems.push({
                item: itemId,
                quantity: borrowAmount,
                itemName: item.itemname
              });
              user
                .save()
                .then(() => {
                  res.redirect('/items');
                })
                .catch(error => {
                  return res.render("error", {message: 'Failed to save user data'});
                });
            })
            .catch(error => {
              return res.render("error", {message: 'Failed to find user '});
            });
        })
        .catch(error => {
          return res.render("error", {message: 'Failed to save item data'});
        });
    })
    .catch(error => {
      return res.render("error", {message: 'Failed to find item'});
    });
};

exports.returnitem_db = async(req,res) =>{
  session = req.session;
  const username = session.userid;
  const itemId = req.params.id;
  console.log(username);
  console.log(itemId);
  try{
    const itemz = await items.findOne({_id: itemId})
    const user = await users.findOne({name: username})
    const borrowItem = user.borrowedItems.find((item) => item.item.toString() == itemId)
    console.log(borrowItem);
    if(!itemz){
      return res.render("error", {message: 'Item not found'});
    }
    if(!user){
      return res.render("error", {message: 'User not found'});
    }
    if (borrowItem) {
      itemz.quantity += borrowItem.quantity;
      user.borrowedItems.splice(user.borrowedItems.indexOf(borrowItem), 1);
      await itemz.save();
      await user.save();
    } else {
      return res.render("error", {message: 'User has not borrowed this item'});
    }
    
    res.redirect('/');
  }catch (err) {
    console.error(err);
    return res.render("error", {message: 'Server Error'});
  }

}
