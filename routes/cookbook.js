const express = require("express");
const router = express.Router();
const productController = require("../controller/recipes");



router.get("/recipes", productController.getRecipes);


module.exports = router;
