const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin");
const recipesController = require("../controller/recipes");
const cookbookController = require("../controller/cookbooks");


router.get("/saved-recipes", recipesController.getSavingRecipes);
router.post("/cookbooks/recipes", adminController.postSaving);
router.get("/my-recipes", recipesController.getMyRecipes);

router.get("/cookbooks/:cookbookId/recipes", cookbookController.getCookbookRecipes);
router.get("/cookbooks/:cookbookId/", cookbookController.getCookbook);


router.get("/recipes/:id", recipesController.getRecipe);
router.get("/login", adminController.getLogin);
router.post("/login", adminController.postLogin);

router.get("/cookbooks", cookbookController.getCookbooks);

router.get("/cookbooks/:cookbookId/add-recipe", adminController.getAddRecipe);
router.post("/cookbooks/:cookbookId/add-recipe", adminController.postAddRecipe);

router.get("/new-cookbook", adminController.getAddCookbook);
router.post("/new-cookbook", adminController.postAddCookbook);

router.get("/cookbooks/:cookbookId/edit-recipe/:id",adminController.getEditRecipe);
router.post("/cookbooks/:cookbookId/edit-recipe/:id", adminController.postEditRecipe);

router.post("/delete-save", adminController.postSavingDeleteRecipe);
router.post("/delete-recipe", adminController.postDeleteRecipe);
router.post("/delete-cookbook", adminController.postDeleteCookbook);


router.get("/home", cookbookController.getHome);

module.exports = router;
