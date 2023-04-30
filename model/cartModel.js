const mongoose=require("mongoose")

require('../config/connection')
const cartDetails = mongoose.Schema({
    userId:{
        type:String,
        required : true
    },
    product:{
        type:Array,
        required : true
    },
    couponTotal:{
        type:Number
    }

    
})
const cart = mongoose.model("carts",cartDetails).collection

module.exports=cart;