const express = require("express");
const { ppid } = require("process");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');

const cookbookRoutes = require("./routes/cookbook.js");

const productController = require("./controller/recipes");

const errorController = require("./controller/error");

const ejs = require('ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")))

app.set('view engine', 'ejs');

app.use(cookbookRoutes);


app.use("/home", productController.getHome);
app.use(errorController.get404);

app.listen(3000)
