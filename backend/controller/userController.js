
const ErrorHandler = require("../util/errorHandler");
// Async error -> for un given needed things
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../util/jwtToken");
const sendEmail = require("../util/sendEmail.js")
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// registration
exports.registerUser = catchAsyncError(async (req, res, next) => {
console.log("req: "+req);
  // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //   folder: "avatars",
  //   width: 150,
  //   crop: "scale",
  // });
  // console.log("cloud : "+myCloud)
  const { name, email, password } = req.body;
  const user = await User.create({
    name, email, password,
    avatar: {
      public_id: "fh",
      url: "sdfj"
    },
  });
  // user cookie token
  sendToken(user, 201, res);
  /*
  const token = user.getJWTToken();
  res.status(200).json({
      success: true,
      message: "User created successfully.",
      token,
      user
  });
*/
});

// login user

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // if email or password was not given
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Your email and password.", 404));
  }

  // if both was given then find the user
  // ->because password is unselected by default
  const user = await User.findOne({ email: email }).select("+password");

  // if user don't exits-> then return err
  if (!user) {
    return next(new ErrorHandler("Invalid Email or password."));
  }

  // check the password is correct or not
  const checkPassword = user.comparePassword(password);

  // if password was wrong
  if (!checkPassword) {
    return next(new ErrorHandler("Invalid Email or password."));
  }

  // if password also matched
  // user cookie token
  sendToken(user, 200, res);
});


// Log out user
exports.logout = catchAsyncError(async (req, res, next) => {
  // delete the token immediately->set the value null
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Log out successfully."
  });
});



// Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // req.protocol->http/ https
  //req.get("host") -> localhost
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `ECommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    // again save the user
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});



// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  // find the user
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmedPassword) {
    return next(
      new ErrorHandler(
        "password don't matched.",
        400
      )
    );
  }
  // save the new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});


// get user details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  // we get the req.user when any user is login
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    message: "All Details",
    user
  });
});



// update User password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});


//update profile

exports.updateProfile = catchAsyncError(async (req, res, next) => {

  // create a new user obj from user entered data
  const newUser = {
    name: req.body.name,
    email: req.body.email
  };

  // update the user in our database
  const user = await User.findByIdAndUpdate(req.user.id, newUser, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "User updated successfully.",
    user
  });
});


// get all users -> (admin)

exports.getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users
  });
});

// get single user details (admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User don't exists with this id: ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    user
  });
});

// update user role
exports.updateUserRole = catchAsyncError(async (req, res, next) => {

  // create a new user obj from user entered data
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    role:req.body.role,
  };

  // update the user in our database
  const user = await User.findByIdAndUpdate(req.params.id, newUser, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });



  res.status(200).json({
    success: true,
    message: "User updated successfully.",
    user
  });
});

// delete user ->admin
// update user role
exports.deleteUserProfile = catchAsyncError(async (req, res, next) => {

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User don't exists with this id: ${req.params.id}`));
  }

  await user.remove();
  res.status(200).json({
    success: true,
    message: "User Deleted successfully."
  });
});


