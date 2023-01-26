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
const { connected } = require('process');
const hbs=require("hbs")
const mongoose = require('mongoose')
const User = require('./model/users.js')

const dbConfig = require('./config/mongodb.config.js')
mongoose.connect(dbConfig.url)
    .then(()=>{
        console.log("can connect to MongoDB")
     }).catch(err=>{
        console.log('cannot connect to MongoDB')
        process.exit();
     })

const templatePath = path.join(__dirname,'/template')

app.use(express.json())
app.set("view engine","hbs")
app.set("views",templatePath)
app.use(express.urlencoded({extended: true}))


app.get("/",(req,res)=>{
   res.render("login")
})

app.get("/signup",(req,res)=>{
   res.render("signup")
})

app.post("/signup",async(req,res)=>{

const data = {
   name:req.body.name,
   password:req.body.password
}

await User.insertMany([data])

res.render("home")
})

app.post("/login",async(req,res)=>{

   try{
      const check= await User.findOne({name:req.body.name})
      if(check.password===req.body.password){
         res.render("home")
      }
      else{
         res.send("wrong password")
      }
   }
   catch{
      res.send("wrong detail")
   }
   
   })

app.listen(3000,()=>{
   console.log("port connected")
})
