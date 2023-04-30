const mongoose=require("mongoose")
require('../config/connection')
const couponDetails=new mongoose.Schema({

    couponCode:{
        type:String,
        require:true
    },
    discountPrice:{
        type:Number,
        require:true
    },
    createDate:{
        type:String,
        require:true
    },
    MinimumPrice:{
        type:Number,
        require:true
    },
    expireDate:{
        type:String,
        require:true
    },
    discountType:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        require:true
    }
})

const coupon=mongoose.model("coupons",couponDetails).collection;

module.exports=coupon



