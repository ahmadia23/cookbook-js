const express = require("express");
const { ppid } = require("process");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');


const cookbookController = require("./controller/cookbooks");
const productController = require("./controller/recipes");

const errorController = require("./controller/error");
const db = require("./util/database");

const ejs = require('ejs');

const cookbookRoutes = require("./routes/cookbook.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")))

app.set('view engine', 'ejs');
app.set("views", "views");

app.use(cookbookRoutes);


app.use(cookbookController.getHome);
app.use(errorController.get404);

app.listen(3000)
