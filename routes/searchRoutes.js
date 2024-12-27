const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.get("/search", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "query required" });
  }
  try {
    const users = await User.find({
      username: { $regex: `^${query}`, $options: "i" },
    }).limit(5);
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
