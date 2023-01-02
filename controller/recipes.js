const Recipe = require("../models/recipe");


const recipes = [];


exports.getRecipe = (req,res, next) => {
  const id = req.params.id
    Recipe.findById(id)
    .then(([recipe]) => {
      res.render("recipe-detail", {
        pageTitle: "recipe-detail",
        recipe: recipe
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
  const editMode = req.query.edit;
   console.log(editMode)
  if (!editMode) {
    return res.redirect('/');
  }
  const id = req.params.id;
  Recipe.findById(id)
    .then(([recipe]) => {
      res.render('add-recipe', {
        pageTitle: 'Edit Product',
        editing: editMode,
        path: '/edit-product',
        recipe: recipe[0]
      });
    })
    .catch(err => console.log(err));
}


exports.postEditRecipe =  (req,res, next) => {
    const id = req.body.id;
    const name = req.body.recipe;
    const description = req.body.description;
    const time  = req.body.time;
    const url =  req.body.url;
    const recipe =  new Recipe(
      id,
      name,
      description,
      time,
      url
    )
    recipe.save();
    res.redirect("/recipes");
}

exports.postDeleteRecipe =  (req,res, next) => {
    const id = req.body.id;
    console.log(id);
    Recipe.deleteById(id)
      .then(()=> {
        res.redirect("/recipes");
      })
      .catch((err)=> {console.log(err)});
}
