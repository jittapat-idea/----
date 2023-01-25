
module.exports = (app) => {
    const user = require("../controller/user-controller")

    app.get('/',user.index);
    app.get('/api/user',user.findAll);

    app.post('/api/user',user.create);
    app.get('/api/user/:userId',user.findById);
    app.put('/api/user/:userId',user.update);
    app.delete('/api/user/:userId',user.delete);
}

