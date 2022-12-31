const Recipe = require("../models/recipe");


const recipes = [];


exports.getRecipe = (req,res, next) => {
  const id = req.params.id
    Recipe.findById(id)
    .then(recipe => {
      res.render("recipe-detail", {
        pageTitle: "recipe-detail",
        recipes: recipe
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getRecipes = (req, res, next) => {
  Recipe.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("../views/index", {
        pageTitle: "index",
        recipes: rows
      });
    })
    .catch(err => console.log(err));
}


exports.getAddRecipe =  (req,res, next) => {
  res.render("../views/add-recipe", {
    pageTitle: "Add Recipe",
  });
}

exports.postAddRecipe =  (req,res, next) => {
    const name = req.body.recipe;
    const description = req.body.description;
    const time = req.body.time;
    const image =  req.body.url;
    const recipe = new Recipe(
        null,
        name,
        description,
        time,
        image
      );
    recipe.save()
    .then(() => {
      res.redirect("/recipes");
    })
    .catch(err => {
      console.log(err)
    });
}

exports.getEditRecipe =  (req,res, next) => {
  res.render("../views/edit-recipe", {
    pageTitle: "Edit Recipe",
  });
}

exports.postEditRecipe =  (req,res, next) => {
  recipes.push({
    name: req.body.recipe,
    description: req.body.description,
    time: req.body.time,
    image: req.body.url
  })
  res.redirect("/recipes");
}
