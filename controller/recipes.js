const Recipe = require("../models/recipe");
const Cookbook = require("../models/cookbook");


exports.getRecipe = (req,res, next) => {
  const id = req.params.id
    Recipe.findByPk(id)
    .then((recipe) => {
      res.render("recipe-detail", {
        pageTitle: recipe.name,
        recipe: recipe
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getRecipes = (req, res, next) => {
  const id = req.params.cookbookId;
  Recipe.findAll({where: {cookbookId: id}})
    .then((recipes) => {
      res.render("index", {
        pageTitle: "cookbook",
        recipes: recipes
      });
    })
    .catch(err => console.log(err));
}
