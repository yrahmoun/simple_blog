const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
dotenv.config();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
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
