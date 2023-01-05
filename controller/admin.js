const Recipe = require("../models/recipe");
const Cookbook = require("../models/cookbook");


exports.getAddRecipe =  (req,res, next) => {
  res.render("add-recipe", {
    pageTitle: "Add Recipe",
    editing: false,
  });
}

exports.postAddRecipe =  (req,res, next) => {
  const name = req.body.recipe;
  const description = req.body.description;
  const time = req.body.time;
  const image =  req.body.url;
  req.user.createRecipe({
    name: name,
    description: description,
    time: time,
    imageUrl: image,
  })
  .then(results => {
    console.log("created recipes")
  }).catch(err => {
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
  Recipe.findByPk(id)
    .then((recipe) => {
      res.render('add-recipe', {
        pageTitle: 'Edit Product',
        editing: editMode,
        path: '/edit-product',
        recipe: recipe
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
  Recipe.findByPk(id)
    .then(recipe => {
      recipe.name = name;
      recipe.description = description;
      recipe.time = time;
      recipe.url = url;
      return recipe.save();
    })
    .then(results => {
      console.log('UPDATED Recipe!');
      res.redirect('/recipes');
    })
    .catch(err => console.log(err));
  };

exports.postDeleteRecipe =  (req,res, next) => {
  const id = req.body.id;
  Recipe.findByPk(id)
    .then((recipe)=> {
      recipe.destroy();
      res.redirect("/recipes");
    })
    .catch((err)=> {console.log(err)});
}


exports.getAddCookbook = (req,res, next) => {
  res.render("../views/new-cookbook", {
    pageTitle: "new cookbook",
  });
}

exports.postAddCookbook =  (req,res, next) => {
  const name = req.body.name;
  const theme = req.body.theme;
  const image = req.body.image;
  const description = req.body.description
  req.user.createCookbook({
    name: name,
    theme: theme,
    imageUrl: image,
    description: description
  })
  .then(results => {
    console.log("created Cookbook");
    res.redirect("/cookbooks");
  }).catch(err => {
    console.log(err)
  });
}

exports.postDeleteCookbook =  (req,res, next) => {
  const id = req.body.id;
  console.log("hello teeest");
  Cookbook.findByPk(id)
    .then((cookbook)=> {
      cookbook.destroy();
      res.redirect("/cookbooks");
    })
    .catch((err)=> {console.log(err)});
}
