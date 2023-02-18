
// module.exports = (app) => {
//     const user = require("../controller/user-controller")

//     app.get('/',user.index);
//     app.get('/api/user',user.findAll);

//     app.post('/api/user',user.create);
//     app.get('/api/user/:userId',user.findById);
//     app.put('/api/user/:userId',user.update);
//     app.delete('/api/user/:userId',user.delete);
// }

module.exports =(app)=>{
    const user = require("../controller/user-controller.js")
    const error = require("../controller/404-controller.js")
    const item = require("../controller/borrow-controller.js")
    const aeditem = require("../controller/add-edit-delete-item-controller.js")

    app.get('/',user.index);
    app.get('/login',user.index);
    app.get('/signup',user.signup);
    app.get('/home', user.index);
    app.get('/logout',user.logout);
    app.get('/items',item.getAllitems);
    app.get('/add-item',user.isAdmin,aeditem.Additems);
    app.get('/edit-item/:id',user.isAdmin,aeditem.edititem);
    app.get('/borrow/:id',item.borrowitem);
    
    app.post('/return-item/:id',item.returnitem_db);
    app.post('/borrow/:itemId',item.borrowitem_db);
    app.post('/delete-item/:id',user.isAdmin,aeditem.deletez);
    app.post('/edit-item/:id',user.isAdmin,aeditem.edititem_db);
    app.post('/add-item',user.isAdmin,aeditem.Additems_db);
    app.post('/signup',user.signup_db);
    app.post('/home',user.login);
    
    app.get('*',error.error);
}