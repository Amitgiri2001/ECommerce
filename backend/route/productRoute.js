const express=require("express");
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails, createReviews, getAllReviews, deleteReview } = require("../controller/productController");
const { isAuthenticateUser, authorizeRoles } = require("../middleware/auth");

const router=express.Router();

// when we get products route -> then we call getAllProducts function

// get all products route
router.route("/products").get(getAllProducts);
// create new products route
router.route("/admin/product/new").post(isAuthenticateUser,authorizeRoles("admin"),createProduct);
// update + delete product route
router.route("/admin/products/:id").put(isAuthenticateUser,authorizeRoles("admin"),updateProduct).delete(isAuthenticateUser,authorizeRoles("admin"),deleteProduct);
// get product details
router.route("/product/:id").get(getProductDetails);
// review route
router.route("/review").put(isAuthenticateUser,createReviews);

// get all reviews
router.route("/reviews").get(getAllReviews).delete(isAuthenticateUser,authorizeRoles("admin"),deleteReview);





/*
// this is another way
const ap=express();
 ap.get("/product",(req,res)=>{
    res.status(200).json({message:"All fine."})
}); 
*/

module.exports=router;