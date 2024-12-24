const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("register", { errorMessage: null });
});

router.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  User.findOne({ $or: [{ username }, { email }] })
    .then((existingUser) => {
      if (existingUser) {
        let errorMessage = "";
        if (existingUser.email === email) {
          errorMessage = "email already exists";
        } else {
          errorMessage = "user already exists";
        }
        res.render("register", { errorMessage });
      }
      const user = new User({ username, email, password });
      return user.save();
    })
    .then((savedUser) => {
      if (savedUser) {
        req.session.user = savedUser.username;
        return res.redirect("/");
      }
    })
    .catch((err) => {
      console.log(err);
    });
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

router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.render("home", { user: req.session.user });
});

module.exports = router;
