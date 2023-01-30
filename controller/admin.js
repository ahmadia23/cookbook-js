const Recipe = require("../models/recipe");
const Cookbook = require("../models/cookbook");
const fileHelper = require("../util/file");
const User = require("../models/user");


exports.getAddRecipe =  (req,res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const id = req.params.cookbookId
  if (!isLoggedIn){
    res.redirect("/login")
  }
  Cookbook.findByPk(id)
    .then((cookbook) => {
      if (cookbook.userId !== req.user.id){
        return res.redirect(`/cookbooks/${cookbook.id}/recipes`)
      }
      res.render("add-recipe", {
        pageTitle: "Add Recipe",
        editing: false,
        cookbook: cookbook,
        isAuthenticated: isLoggedIn
      });
    })
    .catch(err => console.log(err))
}


exports.postAddRecipe = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn
    const name = req.body.name;
    const description = req.body.description;
    const time = req.body.time;
    const image = req.file;
    const id = req.params.cookbookId;
    if (!image){
      return res.status(422).render("../views/add-recipe", {
        pageTitle: "new recipe",
        isAuthenticated: isLoggedIn,
        recipe: {
          name: name,
          theme: theme,
          description: description
        },
        errorMessage: 'Attached file is not an image !.',
        validationErrors: []
      });
    };

    Cookbook.findByPk(id)
      .then((cookbook) => {
        // check if the current user is the creator of the cookbook
        if (cookbook.userId === req.user.id) {
          cookbook.createRecipe({
            name: name,
            description: description,
            time: time,
            imageUrl: image.path,
          })
            .then(results => {
                console.log("created recipe")
                res.redirect(`/cookbooks/${id}/recipes`)
            })
            .catch(err => {
                console.log(err)
            });
        } else {
            throw new Error("Unauthorized to create recipe");
        }
      })
      .catch(err => {
          console.log(err);
      });
};


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
      recipe.getCookbook()
        .then(cookbook => {
          if ( cookbook.userId !== req.user.id){
            return res.redirect("/");
          }
          return recipe.update({
            name: name,
            description: description,
            time: time,
            url: url
          })
          .then(results => {
            console.log('UPDATED Recipe!');
            res.redirect(`/cookbooks/${cookbookId}/recipes`);
           });
        })
    })
    .catch(err => console.log(err));
  };

exports.postDeleteRecipe =  (req,res, next) => {
  const id = req.body.id;
  const cookbookId = req.params.cookbookId;
  Recipe.findByPk(id)
  .then(recipe => {
      // retrieve the associated cookbook
    recipe.getCookbook()
      .then(cookbook => {
        // check if the current user is the creator of the cookbook
        if (cookbook.userId !== req.user.id) {
          console.log(cookbook)
            // destroy the recipe
            return res.redirect(`/recipes/${recipe.id}`);
          }
          return recipe.destroy()
          .then((results) => {
            console.log("Recipe deleted");
            res.redirect(`/cookbooks/${cookbookId}/recipes`)
          });
      });
  })
  .catch(err => {
      console.log("Error deleting recipe: ", err.message);
  });
}


exports.getAddCookbook = (req,res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render("../views/new-cookbook", {
    pageTitle: "new cookbook",
    isAuthenticated: isLoggedIn
  });
}

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

exports.postAddCookbook =  (req,res, next) => {
  console.log("hellooooooooooo");
  console.log(req.body)
  const user = new User({
    email: "somemail@gmail.com",
    password: "Adou232323@"
  });
  const name = req.body.name;
  const theme = req.body.theme;
  const image = req.body.image;
  const description = req.body.description;
  user.createCookbook({
      name: name,
      theme: theme,
      imageUrl: image,
      description: description
  })
  .then(results => {
    console.log(results);
    res.redirect("/cookbooks")
  })
  .catch(err => console.log(err))
}

exports.deleteCookbook =  (req,res, next) => {
  const id = req.params.cookbookId;
  Cookbook.findByPk(id)
  .then((cookbook)=> {
    fileHelper.deleteFile(cookbook.imageUrl);
    return cookbook.destroy()
      .then((results) => {
        console.log("heloooo delete cookbook")
        res.status(200).json({message: "success"});
      })
      .catch((err)=>  {
        console.log("hellloooooo");
        res.status(500).json({message: "deleting failed"});
      });
  })
  .catch((err)=>  {
    res.status(500).json({message: "deleting failed"});
  });
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
      console.log("Saved Recipe");
      res.status(200).json({message: "success"});
    })
    .catch(err => {
      res.status(500).json({message: "deleting failed"});
    });
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
