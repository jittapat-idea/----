const items = require('../model/items.js')
const users = require('../model/users.js')

const navLinks = [
    { href: '/home', label: 'Home' },
    { href: '/items', label: 'Items' },
    { href: '/add-item', label: 'Add Item' },
    { href:'/logout',label:'logout'}
  ];
  var currentYear=(new Date().getFullYear())
exports.getAllitems = async(req, res) => {
    session = req.session;
    if(session.userid){
        items.find().then(data => {
            res.render("items",{
                navLinks,
                showitem:data,
                userName:session.userid,
                currentYear
            })
        }).catch(err => {
            res.status(500).send({msg: err.message})
        })
    }else
    res.render("login")
}

exports.borrowitem = (req, res) =>{
    session = req.session;
    const id = req.params.id;
    if(session.userid){
        items.findById( id,(err,item) =>{
            if(err) return res.status(500).send('error finding item');
            if(!item) return res.status(500).send('item not found');
            res.render('borrow_item',{
                item,
                navLinks,
                currentYear,
                userName:session.userid
            })
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
        return res.status(404).json({ message: 'Item not found' });
      }
      if (!item.quantity) {
        return res.status(400).json({ message: 'Item quantity not defined' });
      }
      if (item.quantity < borrowAmount) {
        return res.status(400).json({ message: 'Not enough quantity' });
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
                  return res.status(500).json({ message: 'Failed to save user data' });
                });
            })
            .catch(error => {
              return res.status(500).json({ message: 'Failed to find user' });
            });
        })
        .catch(error => {
          return res.status(500).json({ message: 'Failed to save item data' });
        });
    })
    .catch(error => {
      return res.status(500).json({ message: 'Failed to find item' });
    });
};
