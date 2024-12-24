const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    const {username, email, password} = req.body;

    User.findOne({$or: [{username}, {email}]})
        .then((existingUser) => {
            if (existingUser) {
                const errorMessage = "";
                if (existingUser.email === email) {
                    errorMessage = "email already exists";
                }
                else {
                    errorMessage = "user already exists";
                }
                res.render("register", {errorMessage});
            }
            const user = new User({username, email, password});
            return user.save();
        })
        .then(() => {
            return res.redirect("/");
        })
        .catch((err) => {
            console.log(err);
        })
})

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", (req, res) => {
    const {username, password} = req.body;

    User.findOne({username})
        .then((foundUser) => {
            const errorMessage = "";
            if (foundUser) {
                if (foundUser.password !== password) {
                    errorMessage = "invalid information";
                    return res.render("login", {errorMessage});
                }
                else {
                    console.log(`${foundUser.username} has loggoed in`);
                    return res.redirect("/");
                }
            }
            else {
                errorMessage = "username doesn't exist";
                return res.render("login", {errorMessage});
            }
        })
        .catch((err) => {
            console.log(err)
        })
})

router.get("/", (req, res) => {
    res.redirect("/login");
})

module.exports = router;