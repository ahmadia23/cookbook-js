const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin");
const recipesController = require("../controller/recipes");
const cookbookController = require("../controller/cookbooks");




router.get("/cookbooks/:cookbookId/recipes", recipesController.getRecipes);


router.get("/cookbooks/:cookbookId/recipes/:id", recipesController.getRecipe);

router.get("/cookbooks", cookbookController.getCookbooks);

router.get("/cookbooks/:cookbookId/recipes/add-recipe", adminController.getAddRecipe);
router.post("/cookbooks/:cookbookId/recipes/add-recipe", adminController.postAddRecipe);

router.get("/new-cookbook", adminController.getAddCookbook);
router.post("/new-cookbook", adminController.postAddCookbook);

router.get("/edit-recipe/:id",adminController.getEditRecipe);
router.post("/edit-recipe", adminController.postEditRecipe);

router.post("/delete-recipe", adminController.postDeleteRecipe);
router.post("/delete-cookbook", adminController.postDeleteCookbook);


router.get("/home", cookbookController.getHome);

module.exports = router;
