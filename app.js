const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const profileRoutes = require("./routes/profileRoutes");
const searchRoutes = require("./routes/searchRoutes");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const app = express();
dotenv.config();
const dirPath = path.join(__dirname, 'public');

app.set("view engine", "ejs");
app.use(express.static(dirPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`server up and running on port: ${port}`);
});

app.use(userRoutes);
app.use(blogRoutes);
app.use(profileRoutes);
app.use(searchRoutes);
