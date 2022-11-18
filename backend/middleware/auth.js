
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../util/errorHandler");
const User = require("../models/userModel");
exports.isAuthenticateUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    // if we don't get token
    // that means user is not login
    if (!token) {
        return next(new ErrorHandler("Please Register/login for get full access."));
    }

    // decode the token data
    const decodeData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodeData.id);

    next();
});

// check if the user is admin or not

// here ...role==admin
//we take as a spread operator for use the array method
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource `,
                    403
                )
            );
        }

        next();
    };
};

