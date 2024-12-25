const express = require("express");
const Blog = require("../models/blogModel");

const router = express.Router();

router.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const userId = req.session.userId;
  Blog.find({author: userId})
  .sort({createdAt: -1})
  .then((blogs) => {
    res.render("profile", {blogs});
  })
  .catch((err) => {
    console.log(err);
  })
});

module.exports = router;
