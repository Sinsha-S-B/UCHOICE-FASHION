const mongoose=require("mongoose")
require('../config/connection')
const orderDetails=new mongoose.Schema({
    deliverydetails:{
        type:Object,
        required : true
    },
    userId:{
        type:String,
        required:true
    },
    paymentMethod:{
        type:String,
        required:true
    },
    products:{
        type:Array,
        required:true
    },
    TotalAmount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    orderdate:{
        type:String,
        required:true,
    },
    paymentStatus:{
       type:String,
       required:true,
    },
    month:{
        type:Number,
        required:true
    }
    
    })
 const order=mongoose.model("orders",orderDetails).collection;

 module.exports=order
