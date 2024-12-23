const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");

const app = express();
dotenv.config();

app.set('view engine', 'ejs');

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server up and running on port: ${port}`);
});

app.use(userRoutes);
