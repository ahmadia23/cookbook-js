const Recipe = require("../models/recipe");
const Cookbook = require("../models/cookbook");


exports.getRecipe = (req,res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const id = req.params.id
    Recipe.findByPk(id)
    .then((recipe) => {
      res.render("recipe-detail", {
        pageTitle: recipe.name,
        recipe: recipe,
        isAuthenticated: isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getRecipes = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const id = req.params.cookbookId;
  Recipe.findAll()
    .then((recipes) => {
      res.render("index", {
        pageTitle: "cookbook",
        recipes: recipes,
        isAuthenticated: isLoggedIn
      });
    })
    .catch(err => console.log(err));
}


exports.getSavingRecipes = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  req.user.getSaving()
    .then((saving) => {
      return saving
      .getRecipes()
      .then(recipes => {
        console.log(recipes)
        res.render("savings", {
          pageTitle: "My recipes to make",
          recipes: recipes,
          isAuthenticated: isLoggedIn
        });
      })
      .catch(err => {console.log(err)});
    })
    .catch(err => console.log(err));
}

exports.getMyRecipes = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const id = req.params.cookbookId;
  Recipe.findAll({where: { userId: req.user.id}})
    .then(recipes => {
      console.log(recipes);
    })
    .then((recipes) => {
      res.render("user-recipes", {
        pageTitle: "My recipes to make",
        recipes: recipes,
        isAuthenticated: isLoggedIn
      });
    })
    .catch(err => console.log(err));
}
