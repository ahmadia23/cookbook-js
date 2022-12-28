const recipes = [];

exports.getRecipes = (req,res, next) => {
  res.render("../views/index", {
    pageTitle: "index",
    recipes: recipes
  });
}

exports.getAddRecipe =  (req,res, next) => {
  res.render("../views/add-recipe", {
    pageTitle: "Add Recipe",
  });
}

exports.postAddRecipe =  (req,res, next) => {
  recipes.push({
    name: req.body.recipe,
    description: req.body.description,
    time: req.body.time,
    image: req.body.url
  })
  console.log(recipes)
  res.redirect("/recipes");
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
  console.log(recipes)
  res.redirect("/recipes");
}

exports.deleteRecipe = (req,res, next) => {
  res.redirect("/recipes")
}
