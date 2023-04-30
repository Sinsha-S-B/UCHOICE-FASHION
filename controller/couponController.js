const { default: mongoose } = require("mongoose");
let coupon = require("../model/couponModel");
let user = require("../model/userModel");
const {ObjectId} = mongoose.Types
//admin side
let addCoupon = async (req, res) => {
  try {
    let coupenerr = req.session.couponerr;

    const couponData = await coupon.find().toArray();

    res.render("admin/coupon", { couponData, coupenerr });
  } catch (error) {
    console.log(error.message);
  }
};

let addCouponpost = async (req, res) => {
  try {
    let couponDetaile = req.body;
    console.log('couponDetaile',couponDetaile);

    const regex = new RegExp(req.body.couponCode, "i");

    console.log('regex',regex);

    const couponExist = await coupon.findOne({
      couponCode: { $regex: regex },
    });
    console.log('couponExist',couponExist);


    if (couponExist) {
      res.redirect("/admin/coupon");
      let couponerr = "coupon is already exist";

      req.session.couponerr = couponerr;
    } else {
      await coupon.insertMany([couponDetaile]);

      res.redirect("/admin/coupon");
    }
  } catch (error) {
    console.log(error.message);
  }
};

let editcoupon = async (req, res) => {
  try {

    let couponDetails=await coupon.findOne({_id:new ObjectId(req.params.id)})
    console.log(couponDetails,'couponDetailssssssssssssssssssssss');
    res.render("admin/editCoupon",{couponDetails});
  } catch (error) {
    console.log(error.message);
  }
};
let editcouponpost = async(req,res)=>{
  try {
    let coupondatas=req.body
    console.log(coupondatas,'coupondatasssssssssssssss');

    await coupon.updateOne({_id:new ObjectId(req.params.id)},{$set:{

      couponCode:req.body.couponCode,
      discountPrice:req.body.discountPrice,
      createDate:req.body.createDate,
      MinimumPrice:req.body.MinimumPrice,
      expireDate:req.body.expireDate,
      discountType:req.body.discountType

    }
    
  })
  setTimeout(() => {
      res.redirect('/admin/coupon')
  }, 1000);
    
    
  } catch (error) {
    console.log(error);
    
  }
}
//userside

let applyCoupon = async (req, res) => {
  try {
    let couponId = req.body.couponcode;
    let username = req.session.user;
    
    let couponCheck = await coupon.find().toArray();
    let exist = false;

    for (let i = 0; i < couponCheck.length; i++) {
      if (couponCheck[i].couponCode === couponId) {
        exist = true;
        break;
      }
    }
    
    if (exist) {
     
let usedCouponCheck = await user.find({ name: username }).toArray()
let couponExists = usedCouponCheck[0].usedCoupon.includes(couponId) ? 1 : 0;

    if (couponExists == 0) {      
     
      let couponss= await coupon.find({couponCode:couponId}).toArray()
        const date = new Date().toISOString().slice(0, 10);
      console.log(couponss);
        if (date < couponss[0].expireDate) {
          req.session.coupon = couponId;
         
        } else {
          let couponError = "Coupon is alredy expierd";
          req.session.couponerror1 = couponError;
          couponError = null;
          req.session.couponError = null;
        }
     
    }  else {
      let couponerr = "This coupon is alredy used";
      req.session.couponerror1 = couponerr;
    }
    } else {
      let couponerror1 = "invalid Coupon code";
      req.session.couponerror1 = couponerror1;
    }

    res.redirect("/checkout");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  addCoupon,
  addCouponpost,
  editcoupon,
  editcouponpost,
  applyCoupon,
};
