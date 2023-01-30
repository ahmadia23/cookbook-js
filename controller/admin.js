const Recipe = require("../models/recipe");
const Cookbook = require("../models/cookbook");
const fileHelper = require("../util/file");
const User = require("../models/user");

exports.getAddRecipe = async (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const id = req.params.cookbookId;
  if (!isLoggedIn) {
    res.redirect("/login");
  }
  try {
    const cookbook = await Cookbook.findByPk(id);
    if (cookbook.userId !== req.user.id) {
      return res.redirect(`/cookbooks/${cookbook.id}/recipes`);
    }
    res.json("add-recipe", {
      pageTitle: "Add Recipe",
      editing: false,
      cookbook: cookbook,
      isAuthenticated: isLoggedIn,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postAddRecipe = async (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const name = req.body.name;
  const description = req.body.description;
  const time = req.body.time;
  const image = req.file;
  const id = req.params.cookbookId;
  if (!image) {
    return res.status(422).render("../views/add-recipe", {
      pageTitle: "new recipe",
      isAuthenticated: isLoggedIn,
      recipe: {
        name: name,
        theme: theme,
        description: description,
      },
      errorMessage: "Attached file is not an image !.",
      validationErrors: [],
    });
  }
  try {
    const cookbook = await Cookbook.findByPk(id);
    if (cookbook.userId === req.user.id) {
      const recipe = await cookbook.createRecipe({
        name: name,
        description: description,
        time: time,
        imageUrl: image.path,
      });
      console.log("created recipe");
      res.redirect(`/cookbooks/${id}/recipes`);
    } else {
      throw new Error("Unauthorized to create recipe");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getEditRecipe = async (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const editMode = req.query.edit;
  console.log(editMode);
  if (!editMode) {
    return res.redirect("/");
  }
  const cookbookId = req.params.cookbookId;
  const id = req.params.id;
  try {
    const cookbook = await Cookbook.findByPk(cookbookId);
    const recipe = await Recipe.findByPk(id);
    res.render("add-recipe", {
      pageTitle: "Edit Product",
      editing: editMode,
      path: "/edit-product",
      recipe: recipe,
      cookbook: cookbook,
      isAuthenticated: isLoggedIn,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditRecipe = async (req, res, next) => {
  console.log("hellooooooooooo theeeere");
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
  const id = req.body.id;
  const cookbookId = req.params.cookbookId;
  try {
    const recipe = await Recipe.findByPk(id);
    const cookbook = await recipe.getCookbook();
    if (cookbook.userId !== req.user.id) {
      console.log(cookbook);
      return res.redirect(`/recipes/${recipe.id}`);
    }
    await recipe.destroy();
    console.log("Recipe deleted");
    res.redirect(`/cookbooks/${cookbookId}/recipes`);
  } catch (err) {
    console.log("Error deleting recipe: ", err.message);
  }
};

exports.getAddCookbook = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render("../views/new-cookbook", {
    pageTitle: "new cookbook",
    isAuthenticated: isLoggedIn,
  });
};

exports.postAddCookbook = async (req, res, next) => {
  console.log("hellooooooooooo");
  console.log(req.body);
  const user = new User({
    email: "somemail@gmail.com",
    password: "Adou232323@",
  });
  const name = req.body.name;
  const theme = req.body.theme;
  const image = req.body.image;
  const description = req.body.description;
  try {
    const results = await user.createCookbook({
      name: name,
      theme: theme,
      imageUrl: image,
      description: description,
    });
    console.log(results);
    res.redirect("/cookbooks");
  } catch (err) {
    console.log(err);
  }
};

exports.deleteCookbook = async (req, res, next) => {
  try {
    const id = req.params.cookbookId;
    const cookbook = await Cookbook.findByPk(id);
    fileHelper.deleteFile(cookbook.imageUrl);
    await cookbook.destroy();
    console.log("heloooo delete cookbook");
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log("hellloooooo");
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
    console.log("hellooooooo");
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
