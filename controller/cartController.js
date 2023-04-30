const { ObjectId } = require("mongodb");
const Cart = require("../model/cartModel");
const product = require("../model/productModel");
const { response } = require("express");
const user = require("../model/userModel");
const order = require("../model/orderModel");
const coupon = require("../model/couponModel");
const RazorPay = require("razorpay");
const flash = require("express-flash");
const session = require("express-session");
const Toastify = require("toastify-js");
const { log } = require("console");
const item = { name: "Product A", price: 9.99 };
require('dotenv').config()

var instance = new RazorPay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_PASS,
});

let proId;
let products;

const cartGet = async (req, res) => {
  try {
    res.render("cart", { user: req.session.user });
  } catch (error) {
    console.log(error);
  }
};

const addToCart = async (req, res) => {
  try {
    let proId = req.params.id;
    let userId = req.session.userId;
    let userCart = await Cart.findOne({ user: new ObjectId(userId) });
    let proObj = {
      item: new ObjectId(proId),
      quantity: 1,
    };

    if (userCart) {
      let proExist = userCart.products.findIndex(
        (product) => product.item == proId
      );
      console.log(proExist);
      if (proExist != -1) {
        Cart.updateOne(
          { user: new ObjectId(userId), "products.item": new ObjectId(proId) },
          {
            $inc: { "products.$.quantity": 1 },
          }
        );
        setTimeout(() => {
          res.redirect("/single");
        }, 4000);
      } else {
        Cart.updateOne(
          { user: new ObjectId(userId) },
          {
            $push: { products: proObj },
          }
        ).then((response) => {
          setTimeout(() => {
            res.redirect("/single");
          }, 4000);});
      }
    } else {
      let cartObj = {
        user: new ObjectId(userId),
        products: [proObj],
      };
      Cart.insertOne(cartObj).then((response) => {

        
        res.redirect("/single");
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const singleaddToCart = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
  }
};

const cartItems = async (req, res) => {
  try {
    let userId = req.session.userId;
    let total = req.session.userId;

    let Ctotal = await Cart.aggregate([
      {
        $match: { user: new ObjectId(userId) },
      },
      {
        $unwind: "$products",
      },
      {
        $project: {
          item: "$products.item",
          quantity: "$products.quantity",
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
      {
        $group: {
          _id: null,
          Ctotal: { $sum: { $multiply: ["$quantity", "$product.price"] } },
        },
      },
    ]).toArray();

    let user = req.body.user;
    let totalvalue = Ctotal[0]?.Ctotal;

    let cart = await Cart.aggregate([
      {
        $match: { user: new ObjectId(userId) },
      },
      {
        $unwind: "$products",
      },
      {
        $project: {
          item: "$products.item",
          quantity: "$products.quantity",
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
    ]).toArray();
    let product = cart;
    res.render("cart", { user: req.session.user, product, totalvalue });
  } catch (error) {
    console.log(error);
  }
};

const changeProductQuantity = async (req, res) => {
  try {
    let details = req.body;
    details.count = parseInt(details.count);
    details.quantity = parseInt(details.quantity);
    if (details.count == -1 && details.quantity == 1) {
      Cart.updateOne(
        { _id: new ObjectId(details.cart) },
        {
          $pull: { products: { item: new ObjectId(details.product) } },
        }
      );
      res.json({ removeProduct: true });
    } else {
      Cart.updateOne(
        {
          _id: new ObjectId(details.cart),
          "products.item": new ObjectId(details.product),
        },
        {
          $inc: { "products.$.quantity": details.count },
        }
      );
      let userId = req.session.userId;
      let total = req.session.userId;

      let Ctotal = await Cart.aggregate([
        {
          $match: { user: new ObjectId(userId) },
        },
        {
          $unwind: "$products",
        },
        {
          $project: {
            item: "$products.item",
            quantity: "$products.quantity",
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
        {
          $group: {
            _id: null,
            Ctotal: { $sum: { $multiply: ["$quantity", "$product.price"] } },
          },
        },
      ]).toArray();

      let user = req.body.user;
      let totalvalue = Ctotal[0]?.Ctotal;
      res.json({ totalvalue });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const deletecart = async function (req, res) {
  cartdeleteid = req.params.id;
  carttitemid = req.params.item;

  await Cart.updateOne(
    { _id: new ObjectId(cartdeleteid) },
    { $pull: { products: { item: new ObjectId(carttitemid) } } }
  );
  res.redirect("/cart");
};

//..............checkout......................................

// const checkoutGet = async (req, res) => {
//   try {
//     let userId = req.session.userId;
//     let total = await Cart.aggregate([
//       {
//         $match: { user: new ObjectId(userId) },
//       },
//       {
//         $unwind: "$products",
//       },
//       {
//         $project: {
//           item: "$products.item",
//           quantity: "$products.quantity",
//         },
//       },
//       {
//         $lookup: {
//           from: "products",
//           localField: "item",
//           foreignField: "_id",
//           as: "product",
//         },
//       },
//       {
//         $project: {
//           item: 1,
//           quantity: 1,
//           product: { $arrayElemAt: ["$product", 0] },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: { $multiply: ["$quantity", "$product.price"] } },
//         },
//       },
//     ]).toArray();
//     total = total[0]?.total;

//     let adp=req.session.adp
//     res.render("checkout", { total,user:req.session.user,userId,adp });
//   } catch (error) {
//     console.log(error);
//   }
// };

let coponErr = "";
const checkoutGet = async (req, res) => {
  try {
    let userId = req.session.userId;
    let total = await Cart.aggregate([
      {
        $match: { user: new ObjectId(userId) },
      },
      {
        $unwind: "$products",
      },
      {
        $project: {
          item: "$products.item",
          quantity: "$products.quantity",
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
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$quantity", "$product.price"] } },
        },
      },
    ]).toArray();
    total = total[0]?.total;

    let couponData = await coupon.find().toArray();
    console.log(couponData,'couponDataddddddddddddddddddddddd');

    let couponsId = req.session.coupon;

    let cartData = await Cart.findOne({ user: new ObjectId(userId) });
    let discount = cartData.couponTotal;
    
    if (discount != undefined) {
      total -= discount;
      if (couponsId) {
        let couponVal = await coupon.find({ couponCode: couponsId }).toArray();
      
        let minimum = couponVal[0].MinimumPrice;
        let discountPrice = couponVal[0].discountPrice;
       
        if (total < minimum) {
          coponErr = "Purchase for Rs. " + minimum;
        } else {
          await Cart.updateOne(
            { user: new ObjectId(userId) },
            { $set: { couponTotal: discountPrice } }
          );
          total -= couponVal[0].discountPrice;
          coponErr = "coupon addedd successfully";

          await user.updateOne(
            { name: req.session.user },
            { $addToSet: { usedCoupon: couponsId } }
          );
          let couponTotal = couponVal[0].discountPrice;
          req.session.couponTotal = couponTotal;
        }
      }
    } else {
      if (couponsId) {
        let couponVal = await coupon.find({ couponCode: couponsId }).toArray();
        console.log(couponVal, "couponVallllllllllllllllllll");

        let minimum = couponVal[0].MinimumPrice;
        let discountPrice = couponVal[0].discountPrice;
        if (total < minimum) {
          coponErr = "Purchase for Rs. " + minimum;
        } else {
          await Cart.updateOne(
            { user: new ObjectId(userId) },
            { $set: { couponTotal: discountPrice } }
          );
          total -= couponVal[0].discountPrice;
          coponErr = "coupon addedd successfully";

          await user.updateOne(
            { name: req.session.user },
            { $addToSet: { usedCoupon: couponsId } }
          );

          let couponTotal = couponVal[0].discountPrice;

          req.session.couponTotal = couponTotal;
        }
      }
    }
    let adp = req.session.adp; 
    let coponerr = req.session.couponerror1;
    res.render("checkout", {total, user: req.session.user,userId,adp,coponerr,coponErr,couponData });
    coponErr = null;
    req.session.coupon = null;
    req.session.couponerror1 = null;
  } catch (error) {
    console.log(error);
  }
};

const placeorderpost = async (req, res) => {
  try {
    let userId = req.session.userId;
    let total = req.session.userId;

    let Ctotal = await Cart.aggregate([
      {
        $match: { user: new ObjectId(userId) },
      },
      {
        $unwind: "$products",
      },
      {
        $project: {
          item: "$products.item",
          quantity: "$products.quantity",
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
      {
        $group: {
          _id: null,
          Ctotal: { $sum: { $multiply: ["$quantity", "$product.price"] } },
        },
      },
    ]).toArray();

    let user = req.body.user;
    let totalPrice = Ctotal[0]?.Ctotal;

    let cart = await Cart.aggregate([
      {
        $match: { user: new ObjectId(userId) },
      },
      {
        $unwind: "$products",
      },
      {
        $project: {
          item: "$products.item",
          quantity: "$products.quantity",
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
    ]).toArray();
    console.log("cartttttttttttttttttttttttt", cart);
    let products = cart;
    let status = req.body["payment-method"] === "COD" ? "shipped" : "shipped";

    let orderObj = {
      deliveryDetails: {
        Firstname: req.body.Firstname,
        Lastname: req.body.Lastname,
        Email: req.body.Email,
        Mobilenumber: req.body.Mobilenumber,
        Address: req.body.Address,
        Postcode: req.body.Postcode,
        State: req.body.State,
        City: req.body.City,
      },
      userId: new ObjectId(userId),
      paymentMethod: req.body["payment-method"],
      products: products,
      totalAmount: totalPrice,
      status: status,
      orderedUser: req.session.user,
      date: new Date().toLocaleDateString(),
    };

    await order.insertOne(orderObj).then((data) => {
      if (req.body["payment-method"] === "COD") {
        res.json({ codSuccess: true });
      } else {
        let orderId = data.insertedId;
        console.log("order id:", totalPrice);

        var options = {
          amount: totalPrice * 100,
          currency: "INR",
          receipt: "" + orderId,
        };
        instance.orders.create(options, function (err, order) {
          let response = order;
          res.json(response);
        });
      }
      Cart.deleteOne({ user: new ObjectId(userId) });
      console.log(response);
    });
    console.log(req.body);
  } catch (error) {
    console.log(error.message);
  }
};

let successpage = async (req, res) => {
  try {
    let user = req.session.user;
    res.render("placeorder", { user });
  } catch (error) {
    console.log(error.message);
  }
};

let getUserOrders = async (req, res) => {
  try {
    let userId = req.session.userId;
    let user = req.body.user;
    let orders = await order.find({ userId: new ObjectId(userId) }).sort({_id:-1}).toArray();
    res.render("orders", { user: req.session.user, orders });
  } catch (error) {
    console.log(error.message);
  }
};
let viewOrderProducts = async (req, res) => {
  try {
    let orderId = req.params.id;
    let orderItems = await order
      .aggregate([
        {
          $match: { _id: new ObjectId(orderId) },
        },
        {
          $unwind: "$products",
        },
        {
          $project: {
            item: "$products.item",
            quantity: "$products.quantity",
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

    let OrderItems = orderItems;
    res.render("viewOrderProducts", { user: req.body.user, OrderItems });
  } catch (error) {
    console.log(error.message);
  }
};

let verifyPayment = async (req, res) => {
  try {
    let payment = req.body.payment;
    let orderId = req.body.order.receipt;
    const crypto = require("crypto");
    let hmac = crypto.createHmac("sha256", "BOlNsT8OIiO822Q04GalNB0z");
    hmac.update(payment.razorpay_order_id + "|" + payment.razorpay_payment_id);
    hmac = hmac.digest("hex");

    if (hmac == payment.razorpay_signature) {
      order.updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { status: "shipped" } }
      );
      res.json({ status: true });
    } else {



      res.json({ status: false });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  cartGet,
  addToCart,
  singleaddToCart,
  cartItems,
  changeProductQuantity,
  deletecart,
  checkoutGet,
  placeorderpost,
  successpage,
  getUserOrders,
  viewOrderProducts,
  verifyPayment,
};
