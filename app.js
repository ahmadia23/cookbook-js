const express = require("express");

const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const session = require("express-session")
const sequelize = require("./util/database");
const SequelizeStore = require("connect-session-sequelize")(
 session.Store
);
const flash = require("connect-flash");


const cookbookController = require("./controller/cookbooks");
const recipesController = require("./controller/recipes");
const adminController = require("./controller/recipes");
const errorController = require("./controller/error");


const Recipe = require("./models/recipe");
const Cookbook = require("./models/cookbook");
const User = require("./models/user");
const Saving = require("./models/saving");
const SavingItem = require("./models/saving-item");


const ejs = require('ejs');

const authRoutes = require("./routes/auth.js");
const cookbookRoutes = require("./routes/cookbook.js");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


app.use(
  session({
    secret: 'my secret',
    store: new SequelizeStore({
      db: sequelize,
    }),
    resave: false,
    saveUninitialized: false
  })
  );

app.use(flash());

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
app.use(authRoutes);

app.use(cookbookController.getHome);
app.use(errorController.get404);

Recipe.belongsTo(Cookbook, {constraints: true, onDelete: 'CASCADE'});
User.hasOne(Cookbook);
Cookbook.hasMany(Recipe);

Cookbook.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasOne(Saving);
Saving.belongsToMany(Recipe, {through: SavingItem});
Recipe.belongsToMany(Saving, {through: SavingItem});


sequelize
  .sync({ force: true})
  .then(saving => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  })
