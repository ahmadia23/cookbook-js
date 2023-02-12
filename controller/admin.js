const Recipe = require("../models/recipe");
const Cookbook = require("../models/cookbook");
const fileHelper = require("../util/file");
const User = require("../models/user");

exports.authorize = async (req, res, next) => {
  const userId = req.userId;
  const cookbookId = req.params.cookbookId;
  const protectionAccess = req.query.accessType;
  const cookbookData = await Cookbook.findAll({ where: { id: cookbookId } });
  const cookbook = cookbookData[0].dataValues;
  console.log(cookbook);
  if (!cookbook) {
    return res.status(404).json({ message: "cookbook not found" });
  }
  if (
    protectionAccess === "addNewRecipe" ||
    protectionAccess === "deleteRecipe"
  ) {
    if (userId !== cookbook.userId) {
      return res.status(403).json({ message: "not authorized" });
    } else {
      return res.status(200).json({ message: "ok" });
    }
  }
  return res.status(500).json({ message: "it failed bro" });
};

exports.postAddRecipe = async (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const time = req.body.time;
  const image = req.body.imageUrl;
  const cookbookId = req.params.cookbookId;
  console.log("from postAdd recipe:", req.body);
  // if (!image) {
  //   return res.status(422).json({
  //     pageTitle: "new recipe",
  //     recipe: {
  //       name: name,
  //       theme: theme,
  //       description: description,
  //     },
  //     errorMessage: "Attached file is not an image !.",
  //     validationErrors: [],
  //   });
  // }
  try {
    const cookbook = await Cookbook.findByPk(cookbookId);
    console.log(cookbook);
    if (cookbook.userId === req.userId) {
      const recipe = await cookbook.createRecipe({
        name: name,
        description: description,
        time: time,
        imageUrl: image,
      });
      console.log("created recipe");
      res.status(200).json({ recipe: recipe, cookbook: cookbook });
    } else {
      const error = new Error({ message: "Unauthorized to create recipe" });
      error.status = 403;
      throw error;
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postEditRecipe = async (req, res, next) => {
  const id = req.body.id;
  const cookbookId = req.params.cookbookId;
  const name = req.body.name;
  const description = req.body.description;
  const time = req.body.time;
  const url = req.body.url;

  try {
    const recipe = await Recipe.findByPk(id);
    const cookbook = await recipe.getCookbook();
    if (cookbook.userId !== req.user.id) {
      return res.redirect("/");
    }
    await recipe.update({
      name: name,
      description: description,
      time: time,
      url: url,
    });
    console.log("UPDATED Recipe!");
    res.redirect(`/cookbooks/${cookbookId}/recipes`);
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteRecipe = async (req, res, next) => {
  const recipeId = req.params.recipeId;
  console.log(recipeId);
  console.log("helloooo");
  try {
    const recipe = await Recipe.findByPk(recipeId);
    console.log(recipe);
    const cookbook = await recipe.getCookbook();
    if (cookbook.userId !== req.userId) {
      console.log(cookbook);
      return res.status(403).json({ message: "Not authorized" });
    }
    await recipe.destroy();
    console.log("Recipe deleted");
    res.status(200).json({ message: "successfully deleted" });
  } catch (err) {
    console.log("Error deleting recipe: ", err.message);
  }
};

exports.postAddCookbook = async (req, res, next) => {
  const name = req.body.name;
  const theme = req.body.theme;
  const image = req.body.image;
  const description = req.body.description;
  const id = req.userId;
  try {
    const user = await User.findAll({ where: { id: id } });
    if (!user) {
      res.status(401).json({ message: "Not Authenticated" });
    }
    const results = await user[0].createCookbook({
      name: name,
      theme: theme,
      imageUrl: image,
      description: description,
    });
    res.status(200).json({ cookbook: results });
  } catch (err) {
    const error = new Error({ message: "could not add a new cookbook" });
    console.log(err);
  }
};

exports.deleteCookbook = async (req, res, next) => {
  try {
    const id = req.params.cookbookId;
    const userId = req.userId;
    const cookbook = await Cookbook.findByPk(id);
    if (!cookbook) {
      res.status(401).json({ message: "Not cookbook found" });
    }
    if (cookbook.userId !== userId) {
      res.status(403).json({ message: "Not authorized !" });
    }
    // fileHelper.deleteFile(cookbook.imageUrl);
    await cookbook.destroy();
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: "deleting failed" });
  }
};

exports.postSaving = async (req, res, next) => {
  try {
    const recipeId = req.body.id;
    const saving = await req.user.getSaving();
    const recipes = await saving.getRecipes({ where: { id: recipeId } });
    let recipe;
    if (recipes.length > 0) {
      recipe = recipes[0];
    }
    if (recipe) {
      alert("already added");
      res.redirect("/saved-recipes");
    } else {
      recipe = await Recipe.findByPk(recipeId);
      await saving.addRecipe(recipe, {
        through: {
          password: req.user.password,
          email: req.user.email,
        },
      });
    }
    console.log("Saved Recipe");
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: "deleting failed" });
  }
};

exports.postSavingDeleteRecipe = async (req, res, next) => {
  try {
    const recipeId = req.body.id;
    const saving = await req.user.getSaving();
    const recipes = await saving.getRecipes({ where: { id: recipeId } });
    const recipe = recipes[0];
    await recipe.savingItem.destroy();
    res.redirect("/saved-recipes");
  } catch (err) {
    console.log(err);
  }
};

// exports.postAddCookbook =  (req,res, next) => {
//   const name = req.body.name;
//   const theme = req.body.theme;
//   const image = req.file;
//   const description = req.body.description
//   if (!image){
//     return res.status(422).render("../views/new-cookbook", {
//       pageTitle: "new cookbook",
//       isAuthenticated: isLoggedIn,
//       cookbook: {
//         name: name,
//         theme: theme,
//         description: description
//       },
//       errorMessage: 'Attached file is not an image !.',
//       validationErrors: []
//     });
//   }
//   const imageUrl = image.path;

//   req.user.createCookbook({
//     name: name,
//     theme: theme,
//     imageUrl: imageUrl,
//     description: description
//   })
//   .then(results => {
//     console.log("created Cookbook");
//     res.redirect("/cookbooks");
//   }).catch(err => {
//     console.log(err)
//   });
// }
