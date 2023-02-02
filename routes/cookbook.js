const express = require("express");
const adminController = require("../controller/admin");
const recipesController = require("../controller/recipes");
const cookbookController = require("../controller/cookbooks");
const {body, check} = require("express-validator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();


router.get("/saved-recipes", recipesController.getSavingRecipes);
router.post("/cookbooks/recipes", adminController.postSaving);
router.get("/my-recipes", recipesController.getMyRecipes);

router.get("/cookbooks/:cookbookId/recipes", cookbookController.getCookbookRecipes);
router.get("/cookbooks/:cookbookId/", cookbookController.getCookbook);


router.get("/recipes/:id", recipesController.getRecipe);


router.get("/cookbooks", cookbookController.getCookbooks);

router.get("/cookbooks/:cookbookId/add-recipe", adminController.getAddRecipe);
router.post("/cookbooks/:cookbookId/add-recipe",
  [ body('name')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
    body('description')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
    body('time')
    .isIn([0, 60])
    .isAlphanumeric()
    .trim(),
  ], adminController.postAddRecipe);

router.get("/new-cookbook", adminController.getAddCookbook);
router.post("/new-cookbook", adminController.postAddCookbook);

router.get("/cookbooks/:cookbookId/edit-recipe/:id", adminController.getEditRecipe);
router.post("/cookbooks/:cookbookId/edit-recipe/:id", adminController.postEditRecipe);

router.post("/delete-save", adminController.postSavingDeleteRecipe);
router.post("/delete-recipe", adminController.postDeleteRecipe);
router.delete("/cookbooks/:cookbookId", adminController.deleteCookbook);




module.exports = router;
