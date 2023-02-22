// const express = require('express')
// const bodyParser = require('body-parser')
// const mongoose = require('mongoose')
// const morgan = require('morgan')

// const path=require("path")

// const dbConfig = require('./config/mongodb.config.js')
// const User = require('./model/users.js')

// const cors = require('cors')

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({extended: true}))

// mongoose.Promise = global.Promise;
// mongoose.connect(dbConfig.url)
//     .then(()=>{
//         console.log("can connect to MongoDB")
//      }).catch(err=>{
//         console.log('cannot connect to MongoDB')
//         process.exit();
//      })

//      app.use(cors())
//      require('./routes/user-route')(app);

//      const server = app.listen(3000,()=>{
//         let port = server.address().port
//         console.log('run at http://localhost:%s',port)
//      })

     
const express = require('express')
const app = express();
const path=require("path");
const multer = require("multer");
// const { connected } = require('process');

const hbs=require("hbs")
const handlebarsHelpers = require('handlebars-helpers');
hbs.registerHelper(handlebarsHelpers());

const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/users.js')
const cors = require('cors')

const cookieParser=require('cookie-parser')
const sessions = require('express-session')

const dbConfig = require('./config/mongodb.config.js')
mongoose.Promise = global.Promise
mongoose.connect(dbConfig.url)
    .then(()=>{
        console.log("can connect to MongoDB")
     }).catch(err=>{
        console.log('cannot connect to MongoDB')
        process.exit();
     })

const templatePath = path.join(__dirname,'/template')
const partialsPath = path.join(__dirname, "/template/partials");

//Add the Express-session options
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
   secret: "thisismysecrctekey",
   saveUninitialized:true,
   cookie:{maxAge: oneDay},
   resave: false
}))

// Register the partials directory
hbs.registerPartials(partialsPath);

app.use(express.json())
app.set("view engine","hbs")
app.set("views",templatePath)
app.use(express.urlencoded({extended: true}))

app.use(express.static(__dirname))
app.use(cookieParser())

app.use(cors())
require('./routes/user-route')(app);




app.listen(3000,()=>{
   console.log("port connected")
})
