const User=require("../model/userModel")
const bcrypt=require('bcrypt');
const { response } = require("express");
const product = require("../model/productModel");
const { products } = require("./adminController");
const session = require("express-session");
const user = require("../model/userModel");
const nodemailer=require("nodemailer")
const verifyLcartogin = require('../middleware/userAuth')
const Cart = require("../model/cartModel");
const { ObjectId } = require("mongodb");
const uuid = require('uuid');
const order = require("../model/orderModel");
const crypto = require("crypto");

let sessionName
let otp
let otpEmail
let cartCount
var errMsg;

const loaduserHome=async(req,res)=>{
  try {
    let user  = req.session.user;
    res.render('user/home',{user,cartCount})
  } catch (error) {
    console.log(error.message);
  }
}
const loaduserHomee=async(req,res)=>{
  try {
    let user  = req.session.user;
    res.redirect('/')
  } catch (error) {
    console.log(error.message);
  }
}

const loaduserLogin = async (req,res)=>{
  try {
      errMsg=req.session.err
      if(req.session.user){
        res.redirect('/')
      }else{
        res.render('user/login',{errMsg})
        req.session.err=null
      }
      
  } catch (error) {
      console.log(error.message);
  }
}

const userCheck = async(req,res)=>{

  try {
    const userInfo = {
      email: req.body.email,
      password: req.body.password,
  }
  var respons = {}

  var users = await User.findOne({ email: userInfo.email })
  if (users) {
      if (users.status) {

          bcrypt.compare(userInfo.password, users.password).then((status) => {
              if (status) {
                
                  respons.user = users
                  respons.status = true
                  console.log("login successful")
                  req.session.user = respons.user.name
                
                  req.session.userId=respons.user._id
                  res.redirect('/')

              } else {
                  respons.msg = "Invalid password"
                  req.session.err = respons.msg
                  res.redirect('/login')
              }
          })

      } else {
          respons.msg = "Your account has been blocked"
          req.session.err = respons.msg
          res.redirect('/login')
      }
  }
  else {
      respons.msg = "Invalid email"
      req.session.err = respons.msg
      res.redirect('/login')
  }
    
  } catch (error) {
    console.log(error.message);
  }

}


const userLogout=async(req,res)=>{
  try {
    req.session.user=null
    res.redirect('/login')

  } catch (error) {
    console.log(error.message);
  }

}

const loaduserSignup = async (req,res)=>{
    try {
      if(req.session.user){
        res.redirect('/')
      }else{
        errMsg=req.session.errMsg
        res.render('user/signup',{errMsg})
        req.session.errMsg=null
      }
    } catch (error) {
        console.log(error.message);
    }
}

const newJoin = async (req, res)=>{
    try{
      let inviter = req.params.id
      const userExist = await User.findOne({ referralId:inviter })
      if(!userExist){
          inviter = null
      }else{
        inviter = inviter
      }
      req.session.inviter = inviter
      res.redirect("/signup")
    }catch(error){
      console.log(error.message);
    }
}

const insertUser = async (req,res)=>{
    try {
        var nameRegex = /^([A-Za-z ]){5,25}$/gm;
        var pswdRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]){8,16}/gm
        var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
        const validatemail = await User.findOne({ email:req.body.email })
        if (req.body.name == '') {
          req.session.errMsg = "Name field is Empty"
          res.redirect('/signup')
        } else if(nameRegex.test(req.body.name)!=true){
           req.session.errMsg ="Enter Valid Name"
           res.redirect('/signup')
        }else if (req.body.email == '') {
        req.session.errMsg = "Email Field is Empty"
          res.redirect('/signup')
        } else if (validatemail) {
        req.session.errMsg = "Email already exist"
          res.redirect('/signup')
        } else if (emailRegex.test(req.body.email) != true) {
        req.session.errMsg = "Invalid email"
          res.redirect('/signup')
        } else if (req.body.mobile == '') {
        req.session.errMsg = "Phone number field is empty"
          res.redirect('/signup')
        } else if (phoneRegex.test(req.body.mobile) != true) {
        req.session.errMsg = "Invalid Phone number"
          res.redirect('/signup')
        } else if (req.body.password == '') {
        req.session.errMsg = "Password field is empty"
          res.redirect('/signup')
        } else if (pswdRegex.test(req.body.password) != true) {
        req.session.errMsg = "password should contain atleast 8 characters uppercase lowercase and number"
          res.redirect('/signup',)
        }else if(req.body.confirmpassword == ''){
          req.session.errMsg = "Confirm Password field is empty"
          res.redirect('/signup')
        }else if(req.body.password!=req.body.confirmpassword){
          req.session.errMsg = " Password doesn't match!"
          res.redirect('/signup')
        }
        else {
          const referralId = crypto.createHash("shake256", { outputLength: 6 })
          .update(req.body.email)
          .digest("hex");
          console.log(referralId,'referralIddddddddddddddddddddddd');
          
            const userData={
                name:req.body.name,
                referralId:referralId,
                email:req.body.email,
                mobile:req.body.mobile,
                password:req.body.password,
                status:true,
                is_admin:0
            }
            userData.password=await bcrypt.hash(userData.password,10)
            if(req.session.inviter){
                await User.updateOne({referralId:req.session.inviter},{$inc:{balance:5}})
                req.session.inviter = null
            }
            await User.insertOne(userData).then((data) =>{
                console.log(data);
          })
          req.session.user = req.body.name
          res.redirect('/login')
        }
    }
    catch (error) {
        console.log(error.message);
    }
}


const getOtpLogin=async(req,res)=>{
  try {
    var user=req.session.user
    if(user){
      res.redirect('/')
    }else{
    otp=req.session.otp
    data=req.session.otpData
    err=req.session.otpErr
    invalid=req.session.InvalidOtp
    res.render('otplogin',{otp,data,err,invalid})
    req.session.otpErr=null
    req.session.InvalidOtp = null
    }
  } catch (error) {
    console.log(error.message);
  }
}
const otpVerification=async(req,res)=>{
  try {
    let data = req.body;
    let response={}
        let checkuser = await user.findOne({email:data.email})
        if(checkuser){
          if(checkuser.status) {
            otpEmail = checkuser.email
            response.otp = OTP()
            let otp = response.otp
            let mailTransporter = nodemailer.createTransport({
                service : "gmail",
                auth : {
                    user:'uchoice1919@gmail.com',
                    pass:process.env.EMAIL
                }
            })
            let details = {
                from:'uchoice1919@gmail.com',
                to:'sinshasb@gmail.com',
                subject:"UCHOICE",
                text: otp+" is your UCHOICE verification code. Do not share OTP with anyone "
            }
            mailTransporter.sendMail(details,(err)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log("OTP Send Successfully ");
                }
            })

            function OTP(){
                OTP = Math.random()*1000000
                OTP = Math.floor(OTP)
                return OTP
            }
            response.user = checkuser
            response.status = true
            if(response.status){
              req.session.otp=response.otp;
              req.session.otpData=req.body;
              req.session.otpUser=response.user;
              res.redirect('/otplogin')
            }
          }
          else{
            req.session.otpErr="Entered email is blocked!";
            res.redirect('/otplogin');
            req.session.otpErr = null;
          }
        }
        else{
          req.session.otpErr="Email not registered!";
          res.redirect('/otplogin');
          req.session.otpErr = null;
        }
  } catch (error) {
    console.log(error.message);
  }

}
const otpLogin=async(req,res)=>{
  try {
    otp=req.session.otp
    userOtp=req.body.digit
    var user=req.session.otpUser
    console.log(otp,userOtp);
    if(otp==userOtp){
      req.session.user=user.name 
      req.session.userId=user._id
      req.session.otp=null
      console.log("success");
      res.redirect('/')
    }else{
      req.session.InvalidOtp="Invalid Otp"
      console.log("err");
      res.redirect('/otplogin')
    }
  } catch (error) {
    console.log(error.message);
  }
}

const categoryFilter=async(req,res)=>{
  try {
    var response={}
    req.session.category=req.body
    console.log(req.body);
    res.json(response)
  } catch (error) {
    console.log(error.message);
  }
}



//-----------------------------------  user profile------------------------
const profileUser=async(req,res)=>{
  try {
    let user=req.session.user
    let userId=req.session.userId
    console.log('rinsha',userId);
  
    let userCheck=await User.findOne({_id:new ObjectId(userId)})
    console.log(userCheck,'userCheckkkkkkkkkkkkkkkkkkkkkkkkkkk');

    res.render('userProfile',{user,userCheck})
    
  } catch (error) {
    console.log(error);
  }
}
const changePassword= async(req,res)=>{
  try {
   let Err=req.session.verifyErr
   res.render('userchangePassword',{user:req.session.user,Err})
   req.session.verifyErr=null

  } catch (error) {
    console.log(error.message);
  }
}
let changePasswordPost=async(req,res)=>{
  try {
    let password=req.body.password
    let newpass=req.body.newpassword
    let userId=req.session.userId
    console.log('sinsha',userId);
    let userData=await user.findOne({_id:new ObjectId(userId)})
    currPass=userData.password
    bcrypt.compare(password,currPass).then(async(status)=>{
      if(status){
        if(newpass==password){
          req.session.verifyErr='You cant reset with same password!'
          res.redirect('/userchangePassword')
        }else{
          let Password=await bcrypt.hash(newpass,10)
         user.updateOne({_id:new ObjectId(userId)},{$set:{password:Password}})
         res.redirect('/')
        }
        
      }else{
        req.session.verifyErr='Wrong Password'
        res.redirect('/userchangePassword')
      }
    })
  
  } catch (error) {
    console.log(error.message);
  }
}


const editProfile = async (req, res)=> {
  try {
    var errMsg=req.session.errMsg
    let user=req.session.user
    const editprofile = req.params.id
    const editprofiledata = await User.findOne({ _id:new ObjectId(editprofile)  })
    res.render("editUserprofile",{user,editprofiledata,errMsg})
    req.session.errMsg=null
  } catch (error) {
    console.log(error.message);
  }
 
}

const editprofilePost = async (req, res)=> {
  try {
    
    var nameRegex = /^([A-Za-z ]){5,25}$/gm;
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
    if (req.body.name == '') {
      req.session.errMsg = "Name field is Empty"
      res.redirect('/editUser/'+req.session.userId)
    } else if(nameRegex.test(req.body.name)!=true){
       req.session.errMsg ="Enter Valid Name"
       res.redirect('/editUser/'+req.session.userId)
    }else if (req.body.mobile == '') {
       req.session.errMsg = "Phone number field is empty"
       res.redirect('/editUser/'+req.session.userId)
    } else if (phoneRegex.test(req.body.mobile) != true) {
       req.session.errMsg = "Invalid Phone number"
       res.redirect('/editUser/'+req.session.userId)
    }else{
      let id = req.session.userId
      await User.updateOne({ _id: new ObjectId(id) }, {
        $set: {
          name:req.body.name,
          mobile:req.body.mobile
        }
      })
      res.redirect('/userProfile')
    }  
  
}catch (error) {
    console.log(error.message);
  }
}

const addressbook=async(req,res)=>{
  try {
    let user=req.session.user

    let userId=req.session.userId
    console.log(userId);
    let addressDetails=await User.aggregate([
      {
        $match: { _id: new ObjectId(userId) }
      },{
        $unwind:'$address'
      },{
        $project: {
          firstname:"$address.firstname",
          lastname: "$address.lastname",
          street: "$address.street",
          state: "$address.state",
          town: "$address.town",
          zip: "$address.zip",
          phone: "$address.phone",
          email: "$address.email",
         },
       }

    ]).toArray()
    res.render('addressbook',{user,addressDetails})
    
  } catch (error) {
    console.log(error.message);
  }
}


const addaddressget=async(req,res)=>{
  try {
    
    let user=req.session.user
    res.render('addaddress',{user})
  } catch (error) {
    console.log(error.message);
    
  }
}


 const addaddress=async(req,res,next)=>{
  try {
    let userId = req.session.userId;
    let data = req.body;
    console.log('dataaaaaaaaaaaa',data);
    console.log("Datasssss",data);
    let address = {
      id : uuid.v4(),
      // name :  req.body.fname +" "+  req.body.lname,
      firstname:req.body.fname,
      lastname:req.body.lname,
      street :  req.body.street,
      state :  req.body.state,
      town :  req.body.town,
      zip :  req.body.zip,
      phone :  req.body.phone,
      email :  req.body.email
    }
    User.updateOne({_id:new ObjectId(userId)},{$push:{address:address}}).then(()=>{
      res.redirect('/addressbook');
    });
    
  } catch (error) {
    console.log(error);
    
    
  }
 }

 const passaddress=async(req,res)=>{
  try {

    let pasid=req.params.indexof
    let userId=req.session.userId
    console.log('userId',userId);
    console.log('pasid',pasid);
    let addressPass=await User.aggregate([
      {
        $match: { _id: new ObjectId(userId) }
      },{
        $unwind:'$address'
      },{
        $project: {
          firstname:"$address.firstname",
          lastname: "$address.lastname",
          street: "$address.street",
          state: "$address.state",
          town: "$address.town",
          zip: "$address.zip",
          phone: "$address.phone",
          email: "$address.email",
         },
       }

    ]).toArray()
    let adp=addressPass[pasid]
    req.session.adp=adp
     res.redirect('/checkout')

    
  } catch (error) {
    console.log(error.message);
    
  }
 }

 const orderCancel = async(req, res)=> {
  let orderId=req.params.id

  await order.updateOne({ _id: new ObjectId(orderId) },{$set:{status:"cancelled"}})
  res.redirect("/orders")
}


module.exports={
    loaduserHome,
    loaduserHomee,
    loaduserLogin,
    loaduserSignup,
    insertUser,
    userCheck,
    userLogout,
    getOtpLogin,
    otpVerification,
    otpLogin,
    categoryFilter,
    profileUser,
    changePassword,
    changePasswordPost,
    editProfile,
    editprofilePost,
    addaddressget,
    addressbook,
    addaddress,
    passaddress,
    orderCancel,
    newJoin

}