const Cookbook = require("../models/cookbook");
const Recipe = require("../models/recipe");

exports.getHome = (req,res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  console.log(req.session);
  res.render("../views/home", {
    pageTitle: "home",
    cookbooks: "ok",
    isAuthenticated: isLoggedIn
  });
}


exports.getCookbooks = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  Cookbook.findAll()
    .then((cookbooks) => {
      res.render("cookbooks-index", {
        pageTitle: "index of cookbooks",
        cookbooks: cookbooks,
        isAuthenticated: isLoggedIn
      });
    })
    .catch(err => console.log(err));
}

exports.getCookbook = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const id = req.params.cookbookId
  Cookbook.findByPk(id)
    .then((cookbook) => {
      res.render("cookbook-detail", {
        pageTitle: cookbook.name,
        cookbook: cookbook,
        recipes: cookbook.recipes,
        isAuthenticated: isLoggedIn
      });
    })
    .catch(err => console.log(err));
}
exports.getCookbookRecipes = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const id = req.params.cookbookId;
  console.log("hello")
  Cookbook.findByPk(id)
    .then((cookbook) => {
      Recipe.findAll({where: {cookbookId: id}})
        .then((recipes) => {
          res.render("cookbook-recipes", {
            pageTitle: cookbook.title,
            cookbook: cookbook,
            recipes: recipes,
            isAuthenticated: isLoggedIn
          });
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err));
}
