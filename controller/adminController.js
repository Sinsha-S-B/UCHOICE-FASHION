const Admin = require("../model/adminModel");
const bcrypt = require("bcrypt");
const product = require("../model/productModel");
const user = require("../model/userModel");
var mongoose1 = require("mongoose");
var verifyLogin = require("../middleware/adminAuth")
// var verifyLogin = require("../middleware/adminAuth").verifyLogin
const order=require("../model/orderModel");
const { ObjectId, Long } = require("mongodb");

const loadadminHome = async (req, res) => {
  try {
    let userCount=await user.find().count()
    let deliveryCount=await order.find({status:'delivered'}).count()
    let pendingCount=await order.find({status:'shipped'}).count()
    let blockeduserCount = await user.find({status:true}).count()
    let revenue = await order.aggregate([{$match:{status:"delivered"}},{ $group: { _id: null, sum: { $sum: "$totalAmount" } } },{$project:{_id:0}}]).toArray()

    if (revenue.length != 0) {
      totalRevenue = revenue[0].sum 
  } else {
    totalRevenue = 0
  }
    res.render("admin/home",{userCount,deliveryCount,pendingCount,totalRevenue,blockeduserCount});
  } catch (error) {
    console.log(error.message);
  }
};

const loadadminLogin = async (req, res) => {
  try {
    if(req.session.admin){
      res.redirect('/admin')
    }else{
      res.render("admin/login"); 
    }
    
  } catch (error) {
    console.log(error.message);
  }
};

const products = async (req, res) => {
  let products = await product.find().toArray();
  res.render("admin/products", { products });
};

const checkAdmin = async (req, res) => {
  try {
    const adminData = {
      email: req.body.email,
      password: req.body.password,
    };
    Admin.findOne({
      email: adminData.email,
      password: adminData.password,
    }).then((response) => {
      if (response) {
        console.log(response);
        req.session.admin=response.email
        res.redirect("/admin");
      } else {
        res.redirect("/admin/login");
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const adminLogout=async(req,res)=>{
  try {
    req.session.admin=null
    res.redirect('/admin/login')

  } catch (error) {
    console.log(error.message);
  }

}

const loadUsers = async (req, res) => {
  try {
    const users = await user.find().toArray();

    res.render("admin/users", { users });
  } catch (error) {
    console.log(error.message);
  }
};
const loadUsersPost = async (req, res) => {
  try {
    res.redirect("/admin/users");
  } catch (error) {
    console.log(error.message);
  }
};

const blockUser = async (req, res) => {
  try {
   
    await user.updateOne({ email: req.params.id }, { $set: { status: false } });
    res.redirect("/admin/users");
  } catch (error) {
    console.log(error.message);
  }
};

const unblockUser = async (req, res) => {
  try {
  
    await user.updateOne({ email: req.params.id }, { $set: { status: true } });
    res.redirect("/admin/users");
  } catch (error) {
    console.log(error.message);
  }
};


const getOrders=async(req,res)=>{
  try {
    let orders = await order.find().sort({_id:-1}).toArray()  
    res.render('admin/orders',{orders})
    
  } catch (error) {
    console.log(error.message);
  }
}

const  viewOrderedProducts=async(req,res)=>{
  try {
    let orderId=req.params.id
    let status=await order.findOne({_id:new ObjectId(orderId)})
    statuspass=status.status

    let orderItems = await order.aggregate([
      {
        $match: { _id: new ObjectId(orderId) },
      }
      ,
       {
         $unwind: "$products",
       },
       {
        $project: {
          item: "$products.item",
          quantity: "$products.quantity"
         },
       },
       {
         $lookup: {
           from: "products",
           localField: "item",
           foreignField: "_id",
           as: "product",
         },
       },
       {
        $project: {
          item: 1,
          quantity: 1,
          product: { $arrayElemAt: ["$product", 0] },
        },
      },
       ])
    .toArray();
    res.render('admin/viewOrderProducts',{orderItems,statuspass,orderId})
    
  } catch (error) {
    console.log(error.message);
    
  }
}

let shippingRoute=async(req,res)=>{
  
  try {
    let orderId=req.params.id
    await order.updateOne({_id:new ObjectId(orderId)},{$set:{status:"shipped"}})
    res.redirect('/admin/orders')
    
  } catch (error) {
    console.log(error.message);
    
  }
}

let deliverdRoute=async(req,res)=>{
  try {
    let orderId=req.params.id
    await order.updateOne({_id:new ObjectId(orderId)},{$set:{status:"delivered"}})
    let date=new Date().toLocaleDateString()
    await order.updateOne({_id:new ObjectId(orderId)},{$set:{salesDate:date}})

    res.redirect('/admin/orders')
    
  } catch (error) {
    console.log(error.message);
    
  }
}

let cancelledRoute=async(req,res)=>{
  try {
    let orderId=req.params.id
    await order.updateOne({_id:new ObjectId(orderId)},{$set:{status:"cancelled"}})
    res.redirect('/admin/orders')
    
  } catch (error) {
    console.log(error.message);
    
  }
}

 let returnconfirmRoute=async(req,res)=>{
  try {
    let orderId=req.params.id
    await order.updateOne({_id:new ObjectId(orderId)},{$set:{status:"return confirmed"}})
    res.redirect('/admin/orders')
    
  } catch (error) {
    console.log(error.message);
    
  }
}

let salesReport=async(req,res)=>{
  try {

    let salesdatas = await order.aggregate([
      { $match: { status: 'delivered' } }
       , 
     { $unwind: "$products" }
        ]).sort({_id:-1}).toArray()

        if(req.session.report){
          salesdatas=req.session.report
          res.render('admin/salesReport',{salesdatas})
          req.session.report=null
        }else{
          res.render('admin/salesReport',{salesdatas})
        }
        


      // console.log(salesdatas[0].products.item);

    // res.render('admin/salesReport',{salesdatas})
  } catch (error) {
    console.log(error.message);
    
  }
}



let reportSales=async(req,res)=>{
  try {
    
    salesParam = req.query.name
    console.log(salesParam);
    if (salesParam == "day") {
       
        const today = new Date();
         const todayDate = today.toLocaleDateString();

       // Get tomorrow's date
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
         const tomorrowDate = tomorrow.toLocaleDateString();

         // Output the dates
         console.log(todayDate);
         console.log(tomorrowDate);


       let dailysalesReport = await order.aggregate([

            {
                $unwind: "$products"
            }
            ,
            {
                $match: { status: "delivered" }
            }
           ,
          {
           $match: {
                   salesDate: { $gte: todayDate, $lte: tomorrowDate }
                  }
             }
         ]).sort({_id:-1}).toArray()
         console.log(dailysalesReport,'dailysalesReport');

        req.session.report = dailysalesReport
    } 
    else if (salesParam == "month"){

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).toLocaleDateString();
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).toLocaleDateString();
      
        console.log(firstDayOfMonth);
        console.log(lastDayOfMonth);

      
     monthlysalesReport = await order.aggregate([

            {
                $unwind: "$products"
            },
           {
                $match: { status: "delivered" }
            },
            {
                $match: {
                    salesDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
                }
            }
        ]).sort({_id:-1})
        .toArray()
       
       
        console.log(monthlysalesReport);
       
        req.session.report = monthlysalesReport
       
    }
    else{
        lifetimesalesReport = await order.aggregate([
            {
              $unwind: "$products"
            }
            ,
            {
              $match: {status: "delivered" }
            }
            
          ]).sort({_id:-1}).toArray()
          req.session.report = lifetimesalesReport  
          console.log(lifetimesalesReport,'lifetimesalesReporttttttttttttttttt');
       
     }

   res.redirect('/admin/salesReport')
 } 

catch (error) {
    console.log(error)  
    
}
}
  



module.exports = {
  loadadminLogin,
  checkAdmin,
  products,
  loadUsers,
  loadUsersPost,
  blockUser,
  unblockUser,
  loadadminHome,
  adminLogout,
  getOrders,
  viewOrderedProducts,
  shippingRoute,
  deliverdRoute,
 cancelledRoute,
 returnconfirmRoute,
 reportSales,
 salesReport
};
