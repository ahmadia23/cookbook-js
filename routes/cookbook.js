const express = require("express");
const adminController = require("../controller/admin");
const recipesController = require("../controller/recipes");
const cookbookController = require("../controller/cookbooks");
const { body, check } = require("express-validator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/allow/:cookbookId", isAuth, adminController.authorize);
router.get("/savings", isAuth, recipesController.getSavingRecipes);
router.get("/my-recipes", isAuth, recipesController.getMyRecipes);

router.get(
  "/cookbooks/:cookbookId/recipes",
  isAuth,
  cookbookController.getCookbookRecipes
);
router.get("/cookbooks/:cookbookId/", isAuth, cookbookController.getCookbook);

router.get(
  "/cookbooks/:cookbookId/:recipeId",
  isAuth,
  recipesController.getRecipe
);

router.get("/cookbooks", cookbookController.getCookbooks);

// router.get(
//   "/cookbooks/:cookbookId/add-recipe",
//   isAuth,
//   adminController.getAddRecipe
// );
router.post(
  "/cookbooks/:cookbookId/add-recipe",
  [
    // body("name").isLength({ min: 5 }).isAlphanumeric().trim(),
    // body("description").isLength({ min: 5 }).isAlphanumeric().trim(),
    // body("time").isIn([0, 60]).isAlphanumeric().trim(),
  ],
  isAuth,
  adminController.postAddRecipe
);

router.put("/recipes/:recipeId/edit", isAuth, adminController.postEditRecipe);
router.post("/new-cookbook", isAuth, adminController.postAddCookbook);

router.delete(
  "savings/:recipeId/delete-saving",
  isAuth,
  adminController.postSavingDeleteRecipe
);
router.delete(
  "/recipes/:recipeId/delete",
  isAuth,
  adminController.postDeleteRecipe
);
router.delete("/cookbooks/:cookbookId", isAuth, adminController.deleteCookbook);

router.post("/recipes/:recipeId/save", isAuth, adminController.postSaving);
module.exports = router;
