const Recipe = require("../models/recipe");
const Cookbook = require("../models/cookbook");
const User = require("../models/user");
const Saving = require("../models/saving");
const SavingItem = require("../models/saving-item");

exports.authorize = async (req, res, next) => {
  const userId = req.userId;
  const cookbookId = req.params.cookbookId;
  const protectionAccess = req.query.accessType;
  const cookbookData = await Cookbook.findAll({ where: { id: cookbookId } });
  const cookbook = cookbookData[0].dataValues;
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
  const ingredients = req.body.ingredients;
  const steps = req.body.steps;
  const cookbookId = req.params.cookbookId;

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
    if (cookbook.userId === req.userId) {
      const recipe = await cookbook.createRecipe({
        name: name,
        description: description,
        time: time,
        imageUrl: image,
        ingredients: ingredients,
        steps: steps,
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
  console.log("hellooooo");
  const recipeId = req.params.recipeId;
  const name = req.body.name;
  const description = req.body.description;
  const time = req.body.time;
  const ImageUrl = req.body.ImageUrl;
  const ingredients = req.body.ingredients;
  const steps = req.body.steps;

  try {
    const recipe = await Recipe.findByPk(recipeId);
    const cookbookData = await recipe.getCookbook();
    const cookbook = cookbookData.dataValues;
    console.log("from posteditrecipe recipe is :", recipe);
    console.log("from posteditrecipe cookbook is : ", cookbook);

    if (cookbook.userId !== req.userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    await recipe.update({
      name: name,
      description: description,
      time: time,
      imageUrl: ImageUrl,
      ingredients: ingredients,
      steps: steps,
    });
    console.log("UPDATED Recipe!");
    res.status(200).json({ message: `success, updated recipes` });
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteRecipe = async (req, res, next) => {
  const recipeId = req.params.recipeId;
  console.log(recipeId);
  try {
    const recipe = await Recipe.findByPk(recipeId);
    console.log(recipe);
    const cookbook = await recipe.getCookbook();
    if (cookbook.userId !== req.userId) {
      console.log("cookbook found", cookbook);
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
    const recipeId = req.params.recipeId;
    const userData = await User.findByPk(req.userId);
    const user = userData.dataValues;
    const recipeSaved = await SavingItem.findOne({
      where: { recipeId: recipeId },
    });
    console.log("from post saving", recipeSaved);
    if (recipeSaved) {
      return res.status(403).json({ message: "already added" });
    } else {
      recipe = await Recipe.findOne({ where: { id: recipeId } });
      userSaving = await Saving.findOne({ where: { userId: req.userId } });
      const savingRecipe = await SavingItem.create({
        savingId: userSaving.id,
        recipeId: recipe.id,
      });
    }
    console.log("Saved Recipe");
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "saving failed" });
  }
};

exports.postSavingDeleteRecipe = async (req, res, next) => {
  try {
    console.log("well done");
    const recipeId = req.params.recipeId;
    const saving = await req.user.getSaving();
    const recipes = await saving.getRecipes({ where: { id: recipeId } });
    const recipe = recipes[0];
    await recipe.savingItem.destroy();
    res.status(200).json({ message: "success" });
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
