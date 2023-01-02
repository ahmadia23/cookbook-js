const express = require("express");
const router = express.Router();
const productController = require("../controller/recipes");
const cookbookController = require("../controller/cookbooks");




router.get("/recipes", productController.getRecipes);

router.get("/recipes/:id", productController.getRecipe);


router.get("/add-recipe", productController.getAddRecipe);
router.post("/add-recipe", productController.postAddRecipe);

router.get("/edit-recipe/:id",productController.getEditRecipe);
router.post("/edit-recipe", productController.postEditRecipe);

router.post("/delete-recipe/:id", productController.postDeleteRecipe);


router.get("/new-cookbook", productController.getRecipes);
router.get("/home", cookbookController.getHome);

module.exports = router;
