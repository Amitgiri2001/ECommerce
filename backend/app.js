const express = require("express");
const { isAuthenticateUser } = require("./middleware/auth");
const app = express();
// use cookie parser for generate cookie while user is created(/login)
const cookieParser=require("cookie-parser");

// here we use middleWare for better error handle
const errorMiddleware = require("./middleware/error");
const bodyParser=require("body-parser");
const fileUpload=require("express-fileupload")

// we use json format for take input in json format from forms
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

// route
const product = require("./route/productRoute");
const user = require("./route/userRoute");
const order = require("./route/orderRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

app.use(errorMiddleware);

module.exports = app;