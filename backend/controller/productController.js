
// import product model 
const Product = require("../models/productModel");
const ErrorHandler = require("../util/errorHandler");
// Async error -> for un given needed things
const catchAsyncError = require("../middleware/catchAsyncError");
// import ApiFeatures for search filter
const ApiFeature = require("../util/apiFeatures");



// create New product ->Admin
// and export it 
exports.createProduct = catchAsyncError(async (req, res, next) => {
    // create new product from the model
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    // send created status code
    res.status(201).json({
        success: true,
        product
    })
});


// GET ALL PRODUCTS
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
    // return next(new ErrorHandler("Temp error by me",500));
    // per page products
    const resultPerPage = 3;
    const productCount = await Product.countDocuments();
    // for get only the filtered products
    const apiFeature =await  new ApiFeature(Product.find(), req.query).search().filter();

    // const products = await apiFeature.query;

    let products = await apiFeature.query;

    let filteredProductsCount = products.length;
    // for apply the pagination
    const apiFeatures = new ApiFeature(Product.find(), req.query).search().filter().pagination(resultPerPage);

    // await apiFeature.pagination(resultPerPage);

    products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        filteredProductsCount,
    })
});

// get one product details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    const trimmed_id = id.trim();
    const product = await Product.findById(trimmed_id);
    // if no product find
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });

});

//UPDATE PRODUCT ->Admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {

    let product = await Product.findById(req.params.id);
    // if no product find
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // if product is founded then update it
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        product,
    });

});

// DELETE ONE PRODUCT
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    // if no product find
    if (!product) {
        return res.status(500).json({
            success: false,
            message: "this product is not founded!"
        });
    }
    await product.remove();
    res.status(200).json({
        success: true,
        message: "Product deleted successfully."
    });
});

// create product review and update
// (ex tir pe 2 nisani - _ -)

exports.createReviews = catchAsyncError(async (req, res, next) => {

    // spread
    const { rating, comment, productId } = req.body;

    // create  new review obj
    const review = {
        user: req.user._id,
        name: req.user.name,
        comment,
        rating: Number(rating),
    }

    // check if the user is already reviewed the product or not
    // first of all we need to find the product

    const product = await Product.findById(productId);
    // so now we need to find the user in the reviews of this product
    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

    //if the user is already reviewed the product
    // then update the review
    if (isReviewed) {
        // first find the review
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.comment = comment;
                rev.rating = rating;
            }
        });
    }
    else {
        // save the new review
        product.reviews.push(review);
        // update the count of reviews
        product.noOfReviews = product.reviews.length;

    }
    // update the ratings
    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Review added successfully.",
        review
    });
});

// get all reviews of a product
exports.getAllReviews = catchAsyncError(async (req, res, next) => {
    // first we need to find the product
    const Id = req.query.productId;

    const product = await Product.findById(Id);
    // if no product find
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    // then all reviews of this product
    const reviews = product.reviews;

    res.status(200).json({
        message: true,
        reviews
    });
});

// delete one review

// Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
    });
});
