const express = require("express");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const profileRoutes = require("./routes/profileRoutes");
const searchRoutes = require("./routes/searchRoutes");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const methodOverride = require("method-override");

const app = express();
const dirPath = path.join(__dirname, "public");

app.set("view engine", "ejs");
app.use(express.static(dirPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URI,
      ttl: 24 * 60 * 60 * 2,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 2,
      httpOnly: true,
    },
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

const server = app.listen(port, () => {
  console.log(`server up and running on port: ${port}`);
});

const io = require("socket.io")(server);

app.use(userRoutes);
app.use(blogRoutes(io));
app.use(profileRoutes);
app.use(searchRoutes);

io.on("connection", (socket) => {
  console.log("soclet.io connection set.");

  socket.on("disconnect", () => {
    console.log("A client disconnected.");
  });
})