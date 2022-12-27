const recipes = [];

exports.getRecipes =(req,res, next) => {
  res.render("../views/index", {
    pageTitle: "index"
  });
}


exports.getHome = (req,res, next) => {
  res.render("../views/home", {
    pageTitle: "home",
    recipes: recipes
  });
}
