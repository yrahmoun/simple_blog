const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "https://res.cloudinary.com/drrhpzcb0/image/upload/v1735809308/yrucsbdwtfphubtd8yhs.jpg"
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
