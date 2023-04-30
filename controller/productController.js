let product = require("../model/productModel");
let sharp = require("sharp");
let uuid = require("uuid");
let { default: mongoose } = require("mongoose");
let categories = require("../model/categoryModel");
const category = require("../model/categoryModel");

let edit;
let id2;
let productDetails;
let productInfo;
let selectone;
const { ObjectId } = mongoose.Types;

const loadaddProducts = async (req, res) => {
  try {
    let category = await categories.find().toArray();
    let rmsg = req.session.msg;
    let value = req.session.addpro;
    res.render("admin/addProducts", { rmsg, category, value });
    req.session.msg = null;
  } catch (error) {
    console.log(error.message);
  }
};

// const insertProducts = async (req, res) => {
//   try {
//     image = req.files?.image;
//     productInfo = req.body;
//     req.session.addpro = productInfo;

//     var rmsg;
//     var nameRegex = /^([A-Za-z0-9_ ]){3,20}$/i;
//     var brandRegex = /^([A-Za-z0-9_ ]){3,20}$/i;
//     var categoryRegex = /^([A-Za-z0-9_ ]){3,20}$/i;
//     var subcategoryRegex = /^([A-Za-z0-9_ ]){3,20}$/i;
//     var priceRegex = /^([0-9.]){1,}$/i;
//     var paraRegex = /^(.|\s)*[a-zA-Z]+(.|\s)*$/;

//     if (productInfo.title == "") {
//       rmsg = "Product Name cannot be empty";
//       req.session.msg = rmsg;
//       res.redirect("/admin/addProducts");
//     } else if (nameRegex.test(productInfo.title) != true) {
//       rmsg = "Enter valid Product Name";
//       req.session.msg = rmsg;
//       res.redirect("/admin/addProducts");
//     } else if (paraRegex.test(productInfo.brand) != true) {
//       rmsg = "Brand cannot be empty";
//       req.session.msg = rmsg;
//       res.redirect("/admin/addProducts");
//     } else if (brandRegex.test(productInfo.brand) != true) {
//       rmsg = "enter valid Brand";
//       req.session.msg = rmsg;
//       res.redirect("/admin/addProducts");
//     } else if (categoryRegex.test(productInfo.category) != true) {
//       rmsg = "Category cannot be empty";
//       req.session.msg = rmsg;
//       res.redirect("/admin/addProducts");
//     } else if (categoryRegex.test(productInfo.category) != true) {
//       rmsg = "enter valid category";
//       req.session.msg = rmsg;
//       res.redirect("/admin/addProducts");
//     }
//     // } else if (subcategoryRegex.test(productInfo.subcategory) != true) {
//     //   rmsg = "Subcategory cannot be empty";
//     //   req.session.msg = rmsg;
//     //   res.redirect("/admin/addProducts");
//     // } else if (subcategoryRegex.test(productInfo.subcategory) != true) {
//     //   rmsg = "enter valid subcategory";
//     //   req.session.msg = rmsg;
//     //   res.redirect("/admin/addProducts");
//     // }
//     else if (productInfo.price == "") {
//       rmsg = "price cannot be empty";
//       req.session.msg = rmsg;
//       res.redirect("/admin/addProducts");
//     } else if (priceRegex.test(productInfo.price) != true) {
//       rmsg = "enter valid price";
//       req.session.msg = rmsg;
//       res.redirect("/admin/addProducts");
//     } else if (priceRegex.test(productInfo.stocks) != true) {
//       rmsg = "enter valid product stock";
//       req.session.msg = rmsg;
//       res.redirect("/admin/addProducts");
//     } else if (productInfo.stock == "") {
//       rmsg = "stock cannot be empty";
//       req.session.msg = rmsg;
//       res.redirect("/admin/addProducts");
//     } else if (paraRegex.test(productInfo.description) != true) {
//       rmsg = "enter valid description";
//       req.session.msg = rmsg;
//       res.redirect("/admin/addProducts");
//     } else if (productInfo.description == "") {
//       rmsg = "description cannot be empty";
//       req.session.msg = rmsg;
//       res.redirect("/admin/addProducts");
//     } else if (!image) {
//       rmsg = "Add minimum 1 image";
//       req.session.msg = rmsg;
//       res.redirect("/admin/addProducts");
//     } else if (image.length > 3) {
//       rmsg = "Add maximum 3 images";
//       req.session.msg = rmsg;
//       res.redirect("/admin/addProducts");
//     } else {
//       count = image.length;
//       imgId = [];
//       if (count) {
//         for (i = 0; i < count; i++) {
//           imgId[i] = uuid.v4();
//           image[i].mv(
//             "./public/images/productImages/" + imgId[i] + ".jpg",
//             (err, done) => {
//               if (err) {
//                 console.log(err);
//               } else {
//                 console.log("done");
//               }
//             }
//           );
//         }
//       } else {
//         imgId[0] = uuid.v4();
//         image.mv(
//           "./public/images/productImages/" + imgId[0] + ".jpg",
//           (err, done) => {
//             if (err) {
//               console.log(err);
//             } else {
//               console.log("done");
//             }
//           }
//         );
//       }
//       productInfo.price = parseInt(productInfo.price);
//       productInfo.stock = parseInt(productInfo.stock);
//       productInfo.image = imgId;
//       const productData = {
//         title: productInfo.title,
//         brand: productInfo.brand,
//         category: productInfo.category,
//         // subcategory: productInfo.subcategory,
//         price: productInfo.price,
//         stocks: productInfo.stocks,
//         description: productInfo.description,
//         image: productInfo.image,
//       };
//       await product.insertMany([productData]);
//       req.session.product = req.body;
//       res.redirect("/admin/products");
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };

const insertProducts = async (req, res) => {
  try {
    image = req.files?.image;
    console.log(image, "imageeeeeeeeeeeeeeeee");
    productInfo = req.body;
    req.session.addpro = productInfo;

    var rmsg;
    var nameRegex = /^([A-Za-z0-9_ ]){3,20}$/i;
    var brandRegex = /^([A-Za-z0-9_ ]){3,20}$/i;
    var categoryRegex = /^([A-Za-z0-9_ ]){3,20}$/i;
    var subcategoryRegex = /^([A-Za-z0-9_ ]){3,20}$/i;
    var priceRegex = /^([0-9.]){1,}$/i;
    var paraRegex = /^(.|\s)*[a-zA-Z]+(.|\s)*$/;

    if (productInfo.title == "") {
      rmsg = "Product Name cannot be empty";
      req.session.msg = rmsg;
      res.redirect("/admin/addProducts");
    } else if (nameRegex.test(productInfo.title) != true) {
      rmsg = "Enter valid Product Name";
      req.session.msg = rmsg;
      res.redirect("/admin/addProducts");
    } else if (paraRegex.test(productInfo.brand) != true) {
      rmsg = "Brand cannot be empty";
      req.session.msg = rmsg;
      res.redirect("/admin/addProducts");
    } else if (brandRegex.test(productInfo.brand) != true) {
      rmsg = "enter valid Brand";
      req.session.msg = rmsg;
      res.redirect("/admin/addProducts");
    } else if (categoryRegex.test(productInfo.category) != true) {
      rmsg = "Category cannot be empty";
      req.session.msg = rmsg;
      res.redirect("/admin/addProducts");
    } else if (categoryRegex.test(productInfo.category) != true) {
      rmsg = "enter valid category";
      req.session.msg = rmsg;
      res.redirect("/admin/addProducts");
    } else if (productInfo.price == "") {
      rmsg = "price cannot be empty";
      req.session.msg = rmsg;
      res.redirect("/admin/addProducts");
    } else if (priceRegex.test(productInfo.price) != true) {
      rmsg = "enter valid price";
      req.session.msg = rmsg;
      res.redirect("/admin/addProducts");
    } else if (priceRegex.test(productInfo.stocks) != true) {
      rmsg = "enter valid product stock";
      req.session.msg = rmsg;
      res.redirect("/admin/addProducts");
    } else if (productInfo.stock == "") {
      rmsg = "stock cannot be empty";
      req.session.msg = rmsg;
      res.redirect("/admin/addProducts");
    } else if (paraRegex.test(productInfo.description) != true) {
      rmsg = "enter valid description";
      req.session.msg = rmsg;
      res.redirect("/admin/addProducts");
    } else if (productInfo.description == "") {
      rmsg = "description cannot be empty";
      req.session.msg = rmsg;
      res.redirect("/admin/addProducts");
    } else if (!image) {
      rmsg = "Add minimum 1 image";
      req.session.msg = rmsg;
      res.redirect("/admin/addProducts");
    } else if (image.length > 3) {
      rmsg = "Add maximum 3 images";
      req.session.msg = rmsg;
      res.redirect("/admin/addProducts");
    } else {
      let count = image.length;
      let imgId = [];
      if (count) {
        for (i = 0; i < count; i++) {
          imgId[i] = uuid.v4();
          if (image[i].tempFilePath) {
            let path = image[i].tempFilePath;
            await sharp(path)
              .rotate()
              .resize(600, 800)
              .jpeg({ mozjpeg: true })
              .toFile(`./public/images/productImages/${imgId[i]}.jpg`);
          }
        }
      }
      // productInfo.price = parseInt(productInfo.price);
      // productInfo.stock = parseInt(productInfo.stock);
      productInfo.image = imgId;
      const productData = {
        title: productInfo.title,
        brand: productInfo.brand,
        category: productInfo.category,
        price: parseInt(productInfo.price),
        stocks: parseInt(productInfo.stocks),
        description: productInfo.description,
        discountPrice:productInfo.discountPrice,
        discount:productInfo.discount,
        originalPrice:productInfo.originalPrice,
        image: productInfo.image,
        status: true,
      };
      await product.insertMany([productData]).then((data) => {
        req.session.product = req.body;
        res.redirect("/admin/products");
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadShop = async (req, res) => {
  try {
    let category = req.query.category;
    let categoryData = await categories.find().toArray();
    let user = req.session.user;
    let products;
    if (category) {
      products = await product.find({ category: category }).toArray();
      if (products.length == 0) {
        filtermsg = "No results found";
      }
    } else {
      products = await product.find().toArray();
    }
    res.render("user/shop", { products, user, categoryData });
  } catch (error) {
    console.log(error);
  }
};

//<---------load single product page---------->
const loadSingleProduct = async (req, res) => {
  try {
    let user = req.session.user;
    res.render("single", { productDetails, user });
    console.log("jdsflsdfadsff", productDetails);
  } catch (error) {
    console.log(error.message);
  }
};
//<--------fetching the single product details------->
const loadSingleProductget = async (req, res) => {
  try {
    const singleProduct = req.params.id;
    console.log(req.params);
    productDetails = await product.findOne({
      _id: new ObjectId(singleProduct),
    });
    res.redirect("/single");
  } catch (error) {
    console.log(error.message);
  }
};

const editProductget = async (req, res, next) => {
  try {
    rmsg = req.session.msg;
    productId = req.params.id;
    let category = await categories.find().toArray();

    edit = await product.findOne({ _id: new ObjectId(productId) });
    res.render("admin/editProduct", { edit, rmsg, category });
    req.session.msg = null;
  } catch (error) {
    console.log(error);
  }
};

const editProductpost = async (req, res) => {
  try {
    image = req.files?.image;
    productInfo = req.body;
    let productId = req.params.id;

    var rmsg;
    var nameRegex = /^([A-Za-z0-9_ ]){3,20}$/i;
    var brandRegex = /^([A-Za-z0-9_ ]){3,20}$/i;
    var categoryRegex = /^([A-Za-z0-9_ ]){3,20}$/i;
    var subcategoryRegex = /^([A-Za-z0-9_ ]){3,20}$/i;
    var priceRegex = /^([0-9.]){1,}$/i;
    var paraRegex = /^(.|\s)*[a-zA-Z]+(.|\s)*$/;

    if (productInfo.title == "") {
      rmsg = "Product Name cannot be empty";
      req.session.msg = rmsg;
      res.redirect("/admin/editProduct/" + req.params.id);
    } else if (nameRegex.test(productInfo.title) != true) {
      rmsg = "Enter valid Product Name";
      req.session.msg = rmsg;
      res.redirect("/admin/editProduct/" + req.params.id);
    } else if (paraRegex.test(productInfo.brand) != true) {
      rmsg = "Brand cannot be empty";
      req.session.msg = rmsg;
      res.redirect("/admin/editProduct/" + req.params.id);
    } else if (brandRegex.test(productInfo.brand) != true) {
      rmsg = "enter valid Brand";
      req.session.msg = rmsg;
      res.redirect("/admin/editProduct/" + req.params.id);
    } else if (categoryRegex.test(productInfo.category) != true) {
      rmsg = "Category cannot be empty";
      req.session.msg = rmsg;
      res.redirect("/admin/editProduct/" + req.params.id);
    } else if (categoryRegex.test(productInfo.category) != true) {
      rmsg = "enter valid category";
      req.session.msg = rmsg;
      res.redirect("/admin/editProduct/" + req.params.id);
    } else if (subcategoryRegex.test(productInfo.subcategory) != true) {
      rmsg = "Subcategory cannot be empty";
      req.session.msg = rmsg;
      res.redirect("/admin/editProduct/" + req.params.id);
    } else if (subcategoryRegex.test(productInfo.subcategory) != true) {
      rmsg = "enter valid subcategory";
      req.session.msg = rmsg;
      res.redirect("/admin/editProduct/" + req.params.id);
    } else if (productInfo.price == "") {
      rmsg = "price cannot be empty";
      req.session.msg = rmsg;
      res.redirect("/admin/editProduct/" + req.params.id);
    } else if (priceRegex.test(productInfo.price) != true) {
      rmsg = "enter valid price";
      req.session.msg = rmsg;
      res.redirect("/admin/editProduct/" + req.params.id);
    } else if (priceRegex.test(productInfo.stocks) != true) {
      rmsg = "enter valid product stock";
      req.session.msg = rmsg;
      res.redirect("/admin/editProduct/" + req.params.id);
    } else if (productInfo.stock == "") {
      rmsg = "stock cannot be empty";
      req.session.msg = rmsg;
      res.redirect("/admin/editProduct/" + req.params.id);
    } else if (paraRegex.test(productInfo.description) != true) {
      rmsg = "enter valid description";
      req.session.msg = rmsg;
      res.redirect("/admin/editProduct/" + req.params.id);
    } else if (productInfo.description == "") {
      rmsg = "description cannot be empty";
      req.session.msg = rmsg;
      res.redirect("/admin/editProduct/" + req.params.id);
    } else {
      productId = req.params.id;
      productInfo = req.body;
      await product
        .updateOne(
          { _id: new ObjectId(productId) },
          {
            $set: {
              title: productInfo.title,
              brand: productInfo.brand,
              // category: productInfo.category,
              subcategory: productInfo.subcategory,
              stocks: parseInt(productInfo.stocks),
              price: parseInt(productInfo.price),
              description: productInfo.description,
            },
          }
        )
        .then(() => {
          obj = req.files;
          console.log("hello", obj);
          if (obj) {
            const count = Object.keys(obj).length;
            for (i = 0; i < count; i++) {
              imgId = Object.keys(obj)[i];
              console.log(imgId);
              image = Object.values(obj)[i];
              console.log("imaaaage", imgId);
              image
                .mv("./public/images/productImages/" + imgId + ".jpg")
                .then((err) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("done");
                  }
                });
            }
            res.redirect("/admin/Products");
          } else {
            res.redirect("/admin/products");
          }
        });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    let del = req.params.id;
    await product.deleteOne({ _id: new ObjectId(del) });
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error.message);
  }
};

const loadCategoriesget = async (req, res) => {
  try {
    let category = await categories.find().toArray();
    res.render("admin/categories", { category });
  } catch (error) {
    console.log(error);
  }
};

const addCategoriesget = async (req, res) => {
  try {
    let msg = req.session.msg;
    res.render("admin/addCategories", { msg });
    req.session.msg = null;
  } catch (error) {
    console.log(error.message);
  }
};
const addCategoriespost = async (req, res) => {
  try {
    categoryInfo = req.body;
    let categoryData = await categories.findOne({
      category: categoryInfo.category,
      // ,
      // subcategory: categoryInfo.sub_category,
    });
    var respons = {};
    var msg;
    var nameRegex = /^([A-Za-z_ ]){3,20}$/i;
    if (categoryInfo.category == "") {
      msg = "enter a category";
      req.session.msg = msg;
      res.redirect("/admin/addCategories");
    } else if (nameRegex.test(categoryInfo.category) != true) {
      msg = "enter valid category";
      req.session.msg = msg;
      res.redirect("/admin/addCategories");
    } else if (categoryData) {
      msg = "Category Already exist!!!";
      req.session.msg = msg;
      res.redirect("/admin/addCategories");
    } else {
      catdata = {
        category: categoryInfo.category,
        // ,
        // sub_category: categoryInfo.subcategory
        status: true,
        
      };
      await categories.insertOne(catdata).then((data) => {
        respons.id = data.insertedId;
      });
      if (respons.id) {
        res.redirect("/admin/categories");
      } else {
        req.session.msg = data;
        res.redirect("/admin/categories");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const disableCategory = async (req, res) => {
  try {
    disable = req.params.id;

    await categories
      .updateOne({ _id: new ObjectId(disable) }, { $set: { status: true } })
      .then((d) => {
        console.log(d);
      });
    res.redirect("/admin/categories");
  } catch (error) {
    console.log(error.message);
  }
};

const enableCategory = async (req, res) => {
  try {
    enable = req.params.id;
    console.log(enable);
    await categories
      .updateOne({ _id: new ObjectId(enable) }, { $set: { status: false } })
      .then((d) => {
        console.log(d);
      });
    res.redirect("/admin/categories");
  } catch (error) {
    console.log(error.message);
  }
};

//edit categories
const editCategoriesget = async (req, res) => {
  try {
    let msg = req.session.msg;
    id3 = req.params.id;

    editCategory = await categories.findOne({ _id: new ObjectId(id3) });
    res.render("admin/editCategories", { editCategory, msg });
    req.session.msg = null;
  } catch (error) {
    console.log(error.message);
  }
};

const editCategoriespost = async (req, res) => {
  try {
    console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
    const categoryData = req.body;
    console.log("categoryDataaaaaaaaaaaaaaa", categoryData);
    id3 = req.params.id;
    console.log("iddddddddd", req.params.id);

    let catexist = await category.findOne({ category: categoryData.category });

    var respons = {};
    var msg;
    var nameRegex = /^([A-Za-z_ ]){3,20}$/i;
    if (categoryData.category == "") {
      msg = "enter a category";
      req.session.msg = msg;
      res.redirect("/admin/editCategories/" + req.params.id);
    } else if (nameRegex.test(categoryData.category) != true) {
      msg = "enter valid category";
      req.session.msg = msg;
      res.redirect("/admin/editCategories/" + req.params.id);
    } else if (catexist) {
      msg = "Category Already exist!!!";
      req.session.msg = msg;
      res.redirect("/admin/editCategories/" + req.params.id);
    } else {
      await categories.updateOne(
        { _id: new ObjectId(id3) },
        {
          $set: {
            category: req.body.category,
            // sub_category: req.body.subcategory,
          },
        }
      );

      res.redirect("/admin/categories");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const productOfferManagement = async (req, res) => {
  try {
    const offer = await product.find().toArray()

    res.render("admin/productManagement",{offer});
  } catch (error) {
    console.log(error);
  }
};

const productOfferEdit=async(req,res)=>{
  try {
       const offers=await product.findOne({_id:new ObjectId(req.params.id)})
     
      
      res.render('admin/editproductOffer',{offers})
  } catch (error) {
      console.log(error)
  }
}
const productOfferEditPost=async(req,res)=>{
  try {
      console.log(req.body);
      const products = await product.findOne({_id:new ObjectId(req.params.id)})
      const price = products?.originalPrice ?? products.price
      const disPer = Math.round((parseFloat(req.body.Discountprice)/price) * 100)
      let originalPrice=products?.originalPrice
      if(!originalPrice){

          originalPrice= products.price
      }
      const disPrice=(originalPrice - parseFloat(req.body.Discountprice)).toFixed(2)
      await product.updateOne({_id:new ObjectId(req.params.id)},{$set:{price:disPrice,originalPrice:originalPrice,discountPrice:req.body.Discountprice,discount:disPer}}) 
      res.redirect('/admin/productOffer')
  } catch (error) {
      console.log(error);
  }
}

const categoryOfferManagement=async(req,res)=>{

  try {
    const catoffer = await category.find().toArray()
    console.log(catoffer,'catofferrrrrrrrrrrrrrrrr');

    res.render('admin/categoryManagement',{catoffer})
    
  } catch (error) {
    console.log(error.message);
  }
  
}

const catOfferEdit=async(req,res)=>{
  try {
    console.log('sssssssssssssssssssssssssssssssssssssss');
    const offers=await category.findOne({_id:new ObjectId(req.params.id)})
    console.log(offers,'offersssssssssss')
        
     res.render('admin/catOfferEdit',{offers})
  } catch (error) {
      
  }
}




module.exports = {
  loadaddProducts,
  insertProducts,
  loadShop,
  loadSingleProduct,
  loadSingleProductget,
  editProductget,
  editProductpost,
  deleteProduct,
  loadCategoriesget,
  editCategoriesget,
  addCategoriesget,
  addCategoriespost,
  editCategoriespost,
  disableCategory,
  enableCategory,
  productOfferManagement,
  productOfferEdit,
  productOfferEditPost,
  categoryOfferManagement,
  catOfferEdit
};
