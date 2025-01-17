const express = require("express");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const upload = require("../middleware/multerConfig");
const get_image_url = require("../middleware/imageUpload");

const router = express.Router();

router.get("/profile", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const userId = req.session.userId;
  try {
    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });
    const user = await User.findById(userId);
    res.render("profile", { blogs, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
});

router.get("/profile/:user", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const username = req.params.user;
  if (username === req.session.user) {
    return res.redirect("/profile");
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.redirect("/");
    }
    const blogs = await Blog.find({ author: user._id }).sort({ createdAt: -1 });
    res.render("userProfile", { blogs, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
});

router.delete("/profile", (req, res) => {
  const { blogId } = req.body;

  if (!blogId) {
    return res.status(400).json({ message: "Blog ID is required" });
  }
  Blog.findByIdAndDelete(blogId)
    .then((deletedBlog) => {
      if (!deletedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.status(200).json({ message: "blog was successfully deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "failed to delete the blog" });
    });
});

router.get("/profile/:blogId/edit", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  const blogId = req.params.blogId;
  try {
    const blog = await Blog.findById(blogId).populate("author", "username");
    if (!blog) {
      return res.status(404).json({ error: "blog doesn't exist" });
    }
    if (blog.author.username !== req.session.user) {
      return res.status(401).json({ error: "unauthorized access" });
    }
    res.render("edit", { blog });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "error fetching data" });
  }
});

router.put("/profile/:blogId", upload.single("blogPic"), async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "unauthorized access" });
  }
  const blogId = req.params.blogId;
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  try {
    const blog = await Blog.findById(blogId).populate("author", "username");
    if (!blog) {
      return res.status(404).json({ error: "blog doesn't exist" });
    }
    if (blog.author.username !== req.session.user) {
      return res.status(401).json({ error: "unauthorized access" });
    }
    blog.title = title;
    blog.content = content;
    if (req.file) {
      let blogPic = null;
      try {
        blogPic = await get_image_url(req.file.buffer);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "unable to upload image" });
      }
      blog.blogPic = blogPic;
    }
    await blog.save();
    return res.redirect("/profile");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "error fetching data" });
  }
});

module.exports = router;
