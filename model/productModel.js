const mongoose=require("mongoose")
require('../config/connection')
const productDetails=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    }, subcategory:{
        type:String,
        required:true
    }, stocks:{
        type:Number,
        required:true
    }, description:{
        type:String,
        required:true
    },image:{
        type:String,
        required:true
    },discount:{
        type:Number,
        default:0
       },
       offerStatus:{
        type:Boolean,
        default:true
       },
      discountPrice:{
        type:Number,
        default:0
      },
      originalPrice:{
        type:Number
  
      }
})
const products=mongoose.model("Products",productDetails).collection

module.exports=products;