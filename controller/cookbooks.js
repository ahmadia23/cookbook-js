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

exports.getCookbooks = async (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  try {
    const cookbooks = await Cookbook.findAll();
    res.json({
      pageTitle: "index of cookbooks",
      cookbooks: cookbooks,
      isAuthenticated: isLoggedIn,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCookbook = async (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const id = req.params.cookbookId;
  try {
    const cookbook = await Cookbook.findByPk(id);
    res.json({
      pageTitle: cookbook.name,
      cookbook: cookbook,
      recipes: cookbook.recipes,
      isAuthenticated: isLoggedIn,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCookbookRecipes = async (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const id = req.params.cookbookId;
  try {
    const cookbook = await Cookbook.findByPk(id);
    //check if cookbook's recipes belongs to the user
    const recipes = await Recipe.findAll({ where: { cookbookId: id } });
    res.json({
      pageTitle: cookbook.title,
      cookbook: cookbook,
      recipes: recipes,
      isAuthenticated: isLoggedIn,
      goodUser: false,
    });
  } catch (error) {
    console.log(error);
  }
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
};
