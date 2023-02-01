
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

    app.get('/',user.index);
    app.get('/login',user.loginpage);
    app.get('/signup',user.signup);
    app.get('/home', user.index);
    app.get('/logout',user.logout);

    app.post('/signup',user.signup_db);
    app.post('/home',user.login);
}