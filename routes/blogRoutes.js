const express = require("express");
const router = express.Router();

router.get("/create", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    res.render("create");
})

module.exports = router;