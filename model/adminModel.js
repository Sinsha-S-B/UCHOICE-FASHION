const mongoose=require("mongoose")

 const adminDetails=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
 })

 const admin=mongoose.model("admins",adminDetails).collection;

 module.exports=admin