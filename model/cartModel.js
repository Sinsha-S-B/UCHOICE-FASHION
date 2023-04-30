const mongoose=require("mongoose")

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