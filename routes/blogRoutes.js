const express = require("express");
const Blog = require("../models/blogModel");
const upload = require("../middleware/multerConfig");
const get_image_url = require("../middleware/imageUpload");
const blogSorter = require("../middleware/blogSorter");

module.exports = (io) => {
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
        return res.status(500).json({ error: "unable to upload image" });
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

  router.get("/", async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    try {
      const blogs = await Blog.find()
        .populate("author", "username profilePic")
        .sort({ createdAt: -1 });
      const userId = req.session.userId;
      let blogsWithLikeStatus = blogs.map((blog) => ({
        ...blog.toObject(),
        likeStatus: blog.likes.includes(userId),
      }));
      if (req.query.sort) {
        const option = req.query.sort;
        const sortedBlogs = blogSorter(blogsWithLikeStatus, option);
        return res.render("home", { blogs: sortedBlogs });
      }
      res.render("home", { blogs: blogsWithLikeStatus });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error fetching blogs" });
    }
  });

  router.put("/blogs/likes", async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "unauthorized access" });
    }
    const blogId = req.body.blogId;
    try {
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ error: "blog doesn't exist" });
      }
      const isLiked = blog.likes.includes(req.session.userId);
      if (isLiked) {
        blog.likes.pull(req.session.userId);
      } else {
        blog.likes.push(req.session.userId);
      }
      const savedBlog = await blog.save();
      io.emit("blogLikeChange", {
        blogId: savedBlog._id,
        blogLikes: savedBlog.likes.length,
      });
      res.status(200).json({
        likeStatus: !isLiked,
        message: !isLiked ? "you like the blog" : "you unliked the blog",
      });
    } catch (error) {
      res.status(500).json({ error: "error liking the blog" });
    }
  });

  return router;
};
