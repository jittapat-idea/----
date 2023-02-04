const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    itemname:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }
})

module.exports =new mongoose.model("item",itemSchema);