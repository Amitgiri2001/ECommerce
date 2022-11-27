// here we are create the product models
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter Product name first."],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter Product Description first."]
    },
    price: {
        type: Number,
        required: [true, "Please enter Product Price first."],
        maxLength: [8, "Price of the product cant exceed 99 lakhs"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    // we want array of image objects
    images: [
        {
            public_id: {
                type: String,
                // required: true
            },
            url: {
                type: String,
                // required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter Product Category."]
    },
    stock: {
        type: Number,
        required: [true, "Please enter Product Stock first."],
        maxLength: [5, "Product Stock can't exceed 10000"],
        default: 1
    },
    noOfReviews: {
        type: Number,
        default: 0
    },
    // we want array of review objects
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

// export the model
module.exports = mongoose.model("Product", productSchema);