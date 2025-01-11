const mongoose = require("mongoose");
const User = require("./userModel");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    blogPic: {
        type: String,
    }
}, {timestamps: true});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;