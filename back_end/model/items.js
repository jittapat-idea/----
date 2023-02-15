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
    },
    imageURL:{
        type:String,
        require:true
    },
    borrowedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    borrowedQuantity: {
        type: Number,
        default: 0
    }
})

module.exports =new mongoose.model("item",itemSchema);