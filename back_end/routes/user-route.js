
module.exports = (app) => {
    const user = require("../controller/user-controller")

    app.get('/',user.index);
    app.get('/api/user',user.findAll);
}