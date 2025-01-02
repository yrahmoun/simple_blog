const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerConfig");
const cloudinary = require("../middleware/cloudinaryConfig");
const User = require("../models/userModel");

router.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("register", { errorMessage: null });
});

router.post("/register", upload.single("profilePic"), async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      let errorMessage = "";
      if (existingUser.email === email) {
        errorMessage = "email already exists";
      } else {
        errorMessage = "user already exists";
      }
      return res.render("register", { errorMessage });
    }
    let profilePic =
      "https://res.cloudinary.com/drrhpzcb0/image/upload/v1735809308/yrucsbdwtfphubtd8yhs.jpg"; // Default profile pic URL

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      profilePic = uploadResult.secure_url;
    }
    const user = await new User({ username, email, password, profilePic });
    const savedUser = await user.save();
    if (savedUser) {
      req.session.user = savedUser.username;
      req.session.userId = savedUser._id;
      return res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("login", { errorMessage: null });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((foundUser) => {
      let errorMessage = "";
      if (foundUser) {
        if (foundUser.password !== password) {
          errorMessage = "invalid information";
          return res.render("login", { errorMessage });
        } else {
          console.log(`${foundUser.username} has loggoed in`);
          req.session.user = foundUser.username;
          req.session.userId = foundUser._id;
          return res.redirect("/");
        }
      } else {
        errorMessage = "username doesn't exist";
        return res.render("login", { errorMessage });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/logout", (req, res) => {
  const user = req.session.user;
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("logout failed.");
    }
    res.status(200).send("user has successfully lpgged out");
    console.log(`${user} has logged out`);
  });
});

module.exports = router;
