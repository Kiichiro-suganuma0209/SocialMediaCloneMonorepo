const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    // username: {
    //     type: String,
    //     required: true,
    //     min: 3, 
    //     max: 25,
    //     unique: true,
    // },
    // email: {
    //     type: String,
    //     required: true,
    //     // require: true,
    //     max: 50,
    //     unique: true,
    // },
    // password: {
    //     type: String,
    //     required: true,
    //     // require: true,
    //     min: 6,
    //     max: 50
    // },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "",
    },

    coverPicture: {
        type: String,
        default: "",
    },
    followers: {
        type: Array,
        default: [],
    },
    followings: {
        type: Array,
        default: [],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    desc: {
        type: String,
        max: 70, 
    },
    city: {
        type: String,
        max: 50,

    },
    resetToken: { type: String },  // トークンを保存
    resetTokenExpiration: { type: Date },  // 有効期限を保存
},

{timestamps: true}

);

module.exports = mongoose.model("User", UserSchema);