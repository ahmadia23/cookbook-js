const Recipe = require("../models/recipe");
const Cookbook = require("../models/cookbook");

exports.getRecipe = async (req, res, next) => {
  const cookbookId = req.params.cookbookId;
  const recipeId = req.params.recipeId;
  const cookbookData = await Cookbook.findAll({ where: { id: cookbookId } });
  const cookbook = cookbookData[0].dataValues;

  Recipe.findByPk(recipeId)
    .then((recipe) => {
      const adminMode = cookbook.userId === req.userId;
      res.json({
        pageTitle: recipe.name,
        recipe: recipe,
        adminMode: adminMode,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// exports.getRecipes = (req, res, next) => {
//   const isLoggedIn = req.session.isLoggedIn;
//   const id = req.params.cookbookId;
//   Recipe.findAll()
//     .then((recipes) => {
//       res.json({
//         recipes: recipes,

//       });
//     })
//     .catch(err => console.log(err));
// }

exports.getSavingRecipes = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  req.user
    .getSaving()
    .then((saving) => {
      return saving
        .getRecipes()
        .then((recipes) => {
          console.log(recipes);
          res.render("savings", {
            pageTitle: "My recipes to make",
            recipes: recipes,
            isAuthenticated: isLoggedIn,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
};

exports.getMyRecipes = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const id = req.params.cookbookId;
  Recipe.findAll({
    include: [
      {
        model: Cookbook,
        where: { userId: req.user.id },
      },
    ],
  })
    .then((recipes) => {
      res.render("user-recipes", {
        pageTitle: "My recipes to make",
        recipes: recipes,
        isAuthenticated: isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
