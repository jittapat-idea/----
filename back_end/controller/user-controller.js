const users = require('../model/users')

exports.index = (req,res) => {
    res.send('<h1>User Application</h1><hr><a href="/api/user">รายชื่อ user</a>')
}

//ฟังก์ชั่น หาทั้งหมด
exports.findAll = (req,res) => {
    users.find().then(data => {
        res.json(data)
    }).catch(err => {
        res.status(500).send({
            msg: err.message
        })
    })
}