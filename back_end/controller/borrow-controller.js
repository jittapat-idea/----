const items = require('../model/items.js')

const navLinks = [
    { href: '/home', label: 'Home' },
    { href: '/items', label: 'Items' },
    { href: '/about', label: 'About' },
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