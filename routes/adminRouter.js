var express = require("express");
var router = express.Router();

const productController = require("../controller/productController");
const adminController = require("../controller/adminController");
const couponController = require("../controller/couponController")
var verifyLogin = require("../middleware/adminAuth").verifyLogin



//admin route
router.get("/",verifyLogin, adminController.loadadminHome);

router.get("/login",adminController.loadadminLogin)

router.post("/login", adminController.checkAdmin);
//admin logout
router.get("/logout", adminController.adminLogout);
//products route
router.get("/products",verifyLogin, adminController.products);
//add product
router.get("/addProducts",verifyLogin, productController.loadaddProducts);
router.post("/addProducts", productController.insertProducts);

//users route
router.get("/users",verifyLogin, adminController.loadUsers);
router.post("/admin/users", adminController.loadUsersPost);

//user management-block
router.get("/block/:id", adminController.blockUser);

//user management-unblock
router.get("/unblock/:id", adminController.unblockUser);

//Edit product
router.get("/editProduct/:id",verifyLogin, productController.editProductget);
router.post("/editProduct/:id", productController.editProductpost);

//delete Product
router.get("/delete/:id", productController.deleteProduct);

//category route
router.get("/categories",verifyLogin, productController.loadCategoriesget);
//router.post("/categories", productController.loadCategoriespost);

//add category route
router.get("/addCategories",verifyLogin,productController.addCategoriesget)
router.post("/addCategories",productController.addCategoriespost)


//category management-enable
router.get("/enable/:id",productController.enableCategory);

//category management-disable
router.get("/disable/:id", productController.disableCategory);


//edit category route
router.get("/editCategories/:id",productController.editCategoriesget)
router.post("/editCategories/:id",productController.editCategoriespost)

//orders
router.get('/orders',verifyLogin,adminController.getOrders)

//ordered products
router.get('/orderedProducts/:id',adminController.viewOrderedProducts)

//changing order status
router.post('/shipping/:id',adminController.shippingRoute)
router.post('/deliverd/:id',adminController.deliverdRoute)
router.post('/cancelled/:id',adminController.cancelledRoute)
router.post('/returnconfirm/:id',adminController.returnconfirmRoute)

//dashboard
router.get('/salesReport',adminController.salesReport)


router.get('/salesReports',adminController.reportSales)


//coupon
router.get('/coupon',couponController.addCoupon)
router.post('/couponAdd',couponController.addCouponpost)

//editCoupon

router.get('/editcoupon/:id',couponController.editcoupon)
router.post('/editcoupon/:id',couponController.editcouponpost)


//prouct offer
router.get('/productOffer',productController.productOfferManagement);
router.get('/editProOffer/:id',productController.productOfferEdit);
router.post('/editProOffer/:id',productController.productOfferEditPost);


//category offer
router.get('/categoryOffer',productController.categoryOfferManagement);
router.get('/categoryOffer/:id',productController.catOfferEdit);







module.exports = router;
