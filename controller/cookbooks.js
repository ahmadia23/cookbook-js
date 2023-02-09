const Cookbook = require("../models/cookbook");
const Recipe = require("../models/recipe");

exports.getCookbooks = async (req, res, next) => {
  try {
    const cookbooks = await Cookbook.findAll();
    res.json({
      pageTitle: "index of cookbooks",
      cookbooks: cookbooks,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCookbook = async (req, res, next) => {
  const id = req.params.cookbookId;
  const userId = req.userId;
  try {
    const cookbook = await Cookbook.findByPk(id);
    const cookbookData = cookbook.dataValues;
    if (!cookbookData) {
      res.status(404).json({ message: "Not found" });
    }

    const adminMode = userId === cookbookData.userId;
    res.json({
      pageTitle: cookbook.name,
      cookbook: cookbook,
      recipes: cookbook.recipes,
      adminMode: adminMode,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCookbookRecipes = async (req, res, next) => {
  const id = req.params.cookbookId;
  const userId = req.userId;
  try {
    const cookbook = await Cookbook.findByPk(id);
    //check if cookbook's recipes belongs to the user
    const recipes = await Recipe.findAll({ where: { cookbookId: id } });
    if (!recipes) {
      res.status(404).json({ message: "No recipes found" });
    }
    res.json({
      pageTitle: cookbook.title,
      cookbook: cookbook,
      recipes: recipes,
      adminMode: userId === cookbook.userId,
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
