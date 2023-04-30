const mongoose=require("mongoose")
require('../config/connection')

const userData=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    referralId:{
        type:String,
        required:true
    },
    balance:{
        type:Number,
        required:true,
        default:0
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    },
    is_admin:{
        type:Number,
        required:true
    },
    is_verified:{
        type:Number,
        default:0
    },
    usedCoupon:{
        type:String,
        required:true
    }

})

const user=mongoose.model("User",userData).collection;

module.exports=user;