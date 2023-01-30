const Cookbook = require("../models/cookbook");
const Recipe = require("../models/recipe");

exports.getHome = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.json({
    pageTitle: "home",
    cookbooks: "ok",
    isAuthenticated: isLoggedIn,
  });
};

exports.getCookbooks = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  Cookbook.findAll()
    .then((cookbooks) => {
      res.json({
        pageTitle: "index of cookbooks",
        cookbooks: cookbooks,
        isAuthenticated: isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCookbook = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const id = req.params.cookbookId;
  Cookbook.findByPk(id)
    .then((cookbook) => {
      res.json({
        pageTitle: cookbook.name,
        cookbook: cookbook,
        recipes: cookbook.recipes,
        isAuthenticated: isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
exports.getCookbookRecipes = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const id = req.params.cookbookId;

  Cookbook.findByPk(id)
    .then((cookbook) => {
      //check if cookbook's recipes belongs to the user
      Recipe.findAll({ where: { cookbookId: id } })
        .then((recipes) => {
          console.log(cookbook);
          // if (cookbook.userId === req.user.id)
          // {
          //   return res.render({
          //     pageTitle: cookbook.title,
          //     cookbook: cookbook,
          //     recipes: recipes,
          //     isAuthenticated: isLoggedIn,
          //     goodUser: true
          //   });
          // }
          return res.json({
            pageTitle: cookbook.title,
            cookbook: cookbook,
            recipes: recipes,
            isAuthenticated: isLoggedIn,
            goodUser: false,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
};
