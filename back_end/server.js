const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const dbConfig = require('./config/mongodb.config.js')
const User = require('./model/users.js')

const cors = require('cors')
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url)
    .then(()=>{
        console.log("can connect to MongoDB")
     }).catch(err=>{
        console.log('cannot connect to MongoDB')
        process.exit();
     })

     app.use(cors())
     require('./routes/user-route')(app);

     const server = app.listen(3000,()=>{
        let port = server.address().port
        console.log('run at http://localhost:%s',port)
     })

     
