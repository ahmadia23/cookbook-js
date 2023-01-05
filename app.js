const express = require("express");

const path = require("path");
const app = express();
const bodyParser = require('body-parser');


const cookbookController = require("./controller/cookbooks");
const recipesController = require("./controller/recipes");
const adminController = require("./controller/recipes");

const errorController = require("./controller/error");
const sequelize = require("./util/database");
const Recipe = require("./models/recipe");
const Cookbook = require("./models/cookbook");
const User = require("./models/user");
const Saving = require("./models/saving");


const ejs = require('ejs');

const cookbookRoutes = require("./routes/cookbook.js");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")))

app.set('view engine', 'ejs');
app.set("views", "views");

app.use((req, res, next) => {
  User.findByPk(1)
  .then((user) => {
    req.user = user;
    next();
  })
  .catch(err => {
    console.log(err)
  });
});
app.use(cookbookRoutes);

app.use(cookbookController.getHome);
app.use(errorController.get404);

Recipe.belongsTo(Cookbook, {constraints: true, onDelete: 'CASCADE'});
User.hasOne(Cookbook);
Cookbook.hasMany(Recipe);

Cookbook.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasOne(Saving);
Saving.hasMany(Recipe);
Recipe.belongsTo(User, {through: Saving})


sequelize
  .sync()
  .then(results => {
    User.findByPk(1);
  })
  .then(user => {
    if (!user){
      return User.create({email: 'test@test.com', password: 'Adou23', });
    }
    return user;
  })
  .then(user => {
    return user.createSaving({quantity: 0});
  })
  .then(saving => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  })
