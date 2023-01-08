const Recipe = require("../models/recipe");
const Cookbook = require("../models/cookbook");


exports.getAddRecipe =  (req,res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const id = req.params.cookbookId
  if (!isLoggedIn){
    res.redirect("/login")
  }
  Cookbook.findByPk(id)
    .then((cookbook) => {
      res.render("add-recipe", {
        pageTitle: "Add Recipe",
        editing: false,
        cookbook: cookbook,
        isAuthenticated: isLoggedIn
      });
    })
    .catch(err => console.log(err))
}

exports.postAddRecipe =  (req,res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const time = req.body.time;
  const image =  req.body.url;
  const id = req.params.cookbookId;
  Cookbook.findByPk(id)
  .then((cookbook) => {
    console.log(name);
    cookbook.createRecipe({
      name: name,
      description: description,
      time: time,
      imageUrl: image,
    })
    .then(results => {
      console.log("created recipe")
      res.redirect(`/cookbooks/${id}/recipes`)
    })
    .catch(err => {
      console.log(err)
    });
  })
  .catch(err => {console.log(err)});
}


exports.getEditRecipe =  (req,res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const editMode = req.query.edit;
   console.log(editMode)
  if (!editMode) {
    return res.redirect('/');
  }
  const cookbookId = req.params.cookbookId;
  const id = req.params.id;
  Cookbook.findByPk(cookbookId)
    .then((cookbook) => {
      Recipe.findByPk(id)
        .then((recipe) => {
          res.render('add-recipe', {
            pageTitle: 'Edit Product',
            editing: editMode,
            path: '/edit-product',
            recipe: recipe,
            cookbook: cookbook,
            isAuthenticated: isLoggedIn
          });
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err));
}


exports.postEditRecipe =  (req,res, next) => {
  console.log("hellooooooooooo theeeere")
  const id = req.body.id;
  const cookbookId = req.params.cookbookId;
  const name = req.body.name;
  const description = req.body.description;
  const time  = req.body.time;
  const url =  req.body.url;
  Recipe.findByPk(id)
    .then(recipe => {
      recipe.update({
        name: name,
        description: description,
        time: time,
        url: url
      })
    })
    .then(results => {
      console.log('UPDATED Recipe!');
      res.redirect(`/cookbooks/${cookbookId}/recipes`);
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
  const isLoggedIn = req.session.isLoggedIn;
  res.render("../views/new-cookbook", {
    pageTitle: "new cookbook",
    isAuthenticated: isLoggedIn
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
  Cookbook.findByPk(id)
    .then((cookbook)=> {
      cookbook.destroy();
      res.redirect("/cookbooks");
    })
    .catch((err)=> {console.log(err)});
}

exports.postSaving =  (req,res, next) => {
  const recipeId = req.body.id;
  let fetchedSaving;
  req.user.getSaving()
    .then((saving) => {
      fetchedSaving = saving;
      return saving.getRecipes({where: {id: recipeId}});
    })
    .then(recipes => {
      let recipe;
      if (recipes.length > 0){
        recipe = recipes[0];
      }
      if (recipe) {
        alert("already added");
        res.redirect("/saved-recipes");
      }
      return Recipe.findByPk(recipeId)
        .then((recipe) => {
          return fetchedSaving.addRecipe(recipe, {through: {
            password: req.user.password,
            email: req.user.email
          }});
        })
        .catch(err => console.log(err));
    })
    .then(() => {
      res.redirect('/saved-recipes')
    })
    .catch(err => console.log(err));
}

exports.postSavingDeleteRecipe =  (req,res, next) => {
  const recipeId = req.body.id;
  console.log("hellooooooo");
  let fetchedsaving;
  req.user
    .getSaving()
    .then(saving => {
      fetchedsaving = saving;
      return saving.getRecipes({where: {id: recipeId}});
    })
    .then((recipes) => {
      const recipe = recipes[0];
      return recipe.savingItem.destroy();
    })
    .then((results) => {
      res.redirect("/saved-recipes");
    })
    .catch(err => {
      console.log(err);
    })
}
