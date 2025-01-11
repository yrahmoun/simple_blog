const express = require("express");
const Blog = require("../models/blogModel");
const upload = require("../middleware/multerConfig");
const get_image_url = require("../middleware/imageUpload");

const router = express.Router();

router.get("/create", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.render("create");
});

router.post("/create", upload.single("blogPic"), async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized access." });
  }
  let blogPic = null;
  if (req.file) {
    try {
      blogPic = await get_image_url(req.file.buffer);
    } catch (error) {
      console.log(error);
      return res.status(500).json({error: "unable to upload image"});
    }
  }
  const blog = new Blog({
    ...req.body,
    author: req.session.userId,
    blogPic,
  });
  blog
    .save()
    .then(() => {
      console.log(`${req.session.user} has posted a new blog`);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to create blog" });
    });
});

router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  Blog.find()
    .populate("author", "username profilePic")
    .sort({ createdAt: -1 })
    .then((blogs) => {
      res.render("home", { blogs });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
