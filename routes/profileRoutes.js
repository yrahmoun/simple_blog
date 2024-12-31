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
    const { title, content } = blog;
    res.render("edit", { blogId, title, content });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "error fetching data" });
  }
});

router.put("/profile/:blogId", async (req, res) => {
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
    await blog.save();
    return res.redirect("/profile");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "error fetching data" });
  }
});

module.exports = router;
