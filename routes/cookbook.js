const express = require("express");
const router = express.Router();
const productController = require("../controller/recipes");
const cookbookController = require("../controller/cookbooks");




router.get("/recipes", productController.getRecipes);

router.get("/recipes/:id", productController.getRecipe);


router.get("/new-cookbook", productController.getRecipes);
router.get("/home", cookbookController.getHome);

router.get("/add-recipe", productController.getAddRecipe);
router.post("/add-recipe", productController.postAddRecipe);

router.get("/edit-recipe",productController.getEditRecipe);
router.post("/edit-recipe", productController.postEditRecipe);

module.exports = router;
