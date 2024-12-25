const express = require("express");
const Blog = require("../models/blogModel");

const router = express.Router();

router.get("/create", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.render("create");
});

router.post("/create", (req, res) => {
  const blog = new Blog({
    ...req.body,
    author: req.session.userId,
  });
  blog
    .save()
    .then(() => {
      console.log(`${req.session.user} has posted a new blog`);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
