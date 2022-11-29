const mongoose = require("mongoose")
const validator = require("validator");
const bcrypt = require("bcryptjs");
// jwt for create cookies
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name."],
        maxLength: [30, "Name Should not exceed 30 character."],
        minLength: [3, "Name Length should not less than 4 character"]
    },
    email: {
        type: String,
        required: [true, "Please Enter your email."],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email."]
    },
    password: {
        type: String,
        required: [true, "Please Enter your Password."],
        minLength: [8, "Password should be greater than 7 character."],
        // select false because we want want to find it from mongodb
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            // required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

});

// we want to do encrypt password before save the password
userSchema.pre("save", async function (next) {

    // check if password is already encrypted or not
    if (!this.isModified("password")) {
        next();
    }

    // here we use function keyword for use this keyword
    this.password = await bcrypt.hash(this.password, 10);
})

// JWT token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

// compare password (user) and (db)
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);