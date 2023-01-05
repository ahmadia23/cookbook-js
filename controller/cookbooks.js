const Cookbook = require("../models/cookbook");

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
  const id = req.body.cookbookId;
  Cookbook.findByPk(id)
    .then((cookbook) => {
      res.render("cookbook-recipes", {
        pageTitle: cookbook.title,
        cookbook: cookbook,
        recipes: cookbook.recipes
      });
    })
    .catch(err => console.log(err));
}
