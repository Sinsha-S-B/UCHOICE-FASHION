var express = require("express");
var router = express.Router();
const bodyParse = require("body-parser");
const userController = require("../controller/userController");
const productController = require("../controller/productController");
const adminController = require("../controller/adminController");
const cartController = require("../controller/cartController")
const couponController = require("../controller/couponController")
const {verifyLogin} = require("../middleware/userAuth")

// const verifyLogin = require("../middleware/userAuth").verifyLogin




//user home
router.get("/",userController.loaduserHome);
router.get("/home",userController.loaduserHomee);

//user login
router.get("/login", userController.loaduserLogin);
router.post("/login", userController.userCheck);

//user logout
router.get("/logout", userController.userLogout);

//user signup
router.get("/signup", userController.loaduserSignup);
router.post("/signup", userController.insertUser);

//shop route
router.get("/shop",productController.loadShop);

//single product route
router.get("/single", productController.loadSingleProduct);
router.get("/singleImage/:id", productController.loadSingleProductget);

//otp verification route
router.get("/otplogin", userController.getOtpLogin);

router.post("/otplogin", userController.otpVerification);

router.post("/verifyotp", userController.otpLogin);

//category filter
router.post('/category-filter',userController.categoryFilter)

//cart route
router.get('/cart',verifyLogin,cartController.cartItems)
router.get('/addtoCart/:id',verifyLogin,cartController.addToCart)

router.get("/newJoin/:id",userController.newJoin)

//product quantity change
router.post('/change-product-quantity',cartController.changeProductQuantity)

//remove cart item
router.get('/deleteitem/:id/:item',cartController.deletecart)

//user profile
router.get('/userProfile',verifyLogin,userController.profileUser)

//change password
router.get('/userchangePassword',verifyLogin,userController.changePassword)
router.post('/userchangePassword',userController.changePasswordPost)

//edit user
router.get('/editUser/:id',verifyLogin,userController.editProfile)
router.post('/editUser/:id',verifyLogin,userController.editprofilePost)

//checkout

router.get('/checkout',verifyLogin,cartController.checkoutGet)

//placeorder
router.post('/placeorder',cartController.placeorderpost)

//cancel order
router.get('/orderscancel/:id',userController.orderCancel)


//order success page
router.get('/success',cartController.successpage)

//view orders
router.get('/orders',verifyLogin,cartController.getUserOrders)

//orders page
router.get('/viewOrderProducts/:id',cartController.viewOrderProducts)

//payment router
router.post('/verify-payment',cartController.verifyPayment)

//addaddress
router.get('/addaddress',userController.addaddressget)
router.post('/addaddress',userController.addaddress)


//addressbook
router.get('/addressbook',userController.addressbook)

//passaddress
router.get('/passaddress/:indexof',userController.passaddress)

//apply coupon

router.post('/couponApply',couponController.applyCoupon)







module.exports = router;
