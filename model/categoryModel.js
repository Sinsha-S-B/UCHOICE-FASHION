const mongoose=require("mongoose")

const categoryDetails=new mongoose.Schema({

    category:{
        type:String,
        required:true
    },
    sub_category:{
        type:Array,
        required:true
    },
    status:{
        type:Boolean,
        default:1,
        required:true
    },  
    offerStatus:{
        type:Boolean,
        defaut:true
    },
    discount:{
        type:Number,
        default:0
    }
})

const category=mongoose.model("categories",categoryDetails).collection;

module.exports=category
