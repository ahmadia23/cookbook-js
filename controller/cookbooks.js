const Cookbook = require("../models/cookbook");
const Recipe = require("../models/recipe");

exports.getHome = (req,res, next) => {
  res.render("../views/home", {
    pageTitle: "home",
    cookbooks: "ok"
  });
}


exports.getCookbooks = (req, res, next) => {
  Cookbook.findAll()
    .then((cookbooks) => {
      res.render("cookbooks-index", {
        pageTitle: "index of cookbooks",
        cookbooks: cookbooks
      });
    })
    .catch(err => console.log(err));
}

exports.getCookbook = (req, res, next) => {
  const id = req.params.cookbookId
  Cookbook.findByPk(id)
    .then((cookbook) => {
      res.render("cookbook-detail", {
        pageTitle: cookbook.name,
        cookbook: cookbook,
        recipes: cookbook.recipes
      });
    })
    .catch(err => console.log(err));
}
exports.getCookbookRecipes = (req, res, next) => {
  const id = req.params.cookbookId;
  console.log("hello")
  Cookbook.findByPk(id)
    .then((cookbook) => {
      Recipe.findAll({where: {cookbookId: id}})
        .then((recipes) => {
          res.render("cookbook-recipes", {
            pageTitle: cookbook.title,
            cookbook: cookbook,
            recipes: recipes
          });
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err));
}
