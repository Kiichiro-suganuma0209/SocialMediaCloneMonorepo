//26 
const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max: 200,
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: [],
    },
},
//投稿日時を取得できる
{ timestamps: true }    
);
//他のファイルでも使えるようになる
module.exports = mongoose.model("Post", PostsSchema); 