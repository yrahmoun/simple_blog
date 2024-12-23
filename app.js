const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

express.set('view engine', 'ejs');

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server up and running on port: ${port}`);
});
