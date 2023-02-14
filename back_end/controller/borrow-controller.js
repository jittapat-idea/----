const items = require('../model/items.js')

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