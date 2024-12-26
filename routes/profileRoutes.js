const express = require("express");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");

const router = express.Router();

router.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const userId = req.session.userId;
  Blog.find({ author: userId })
    .sort({ createdAt: -1 })
    .then((blogs) => {
      res.render("profile", { blogs });
    })
    .catch((err) => {
      console.log(err);
    });
});

function getUserId(username) {
  return User.findOne({ username })
    .then((user) => {
      if (user) {
        return user._id;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

router.get("/profile/:user", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const user = req.params.user;
  if (user === req.session.user) {
    return res.redirect("/profile");
  }
  getUserId(user)
    .then((userId) => {
      if (!userId) {
        return res.redirect("/");
      }
      return Blog.find({ author: userId })
        .sort({ createdAt: -1 })
        .populate("author", "username");
    })
    .then((blogs) => {
      res.render("userProfile", { blogs });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
