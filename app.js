const express = require("express");

const path = require("path");
const app = express();

const bodyParser = require("body-parser");
const session = require("express-session");

const sequelize = require("./util/database");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const dotenv = require("dotenv").config();

const flash = require("connect-flash");
const multer = require("multer");
const cors = require("cors");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const cookbookController = require("./controller/cookbooks");
const recipesController = require("./controller/recipes");
const adminController = require("./controller/recipes");
const errorController = require("./controller/error");

const Recipe = require("./models/recipe");
const Cookbook = require("./models/cookbook");
const User = require("./models/user");
const Saving = require("./models/saving");
const SavingItem = require("./models/saving-item");

const ejs = require("ejs");

const authRoutes = require("./routes/auth.js");
const cookbookRoutes = require("./routes/cookbook.js");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Credentials", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  session({
    secret: "my secret",
    store: new SequelizeStore({
      db: sequelize,
    }),
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(flash());
app.use(express.json());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findByPk(req.session.user[0].id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use(cookbookRoutes);
app.use(authRoutes);

app.use(errorController.get404);

Recipe.belongsTo(Cookbook, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Cookbook, { constraints: true, onDelete: "CASCADE" });
Cookbook.hasMany(Recipe);
Cookbook.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasOne(Saving, { constraints: true, onDelete: "CASCADE" });
Saving.belongsTo(User);
Saving.belongsToMany(Recipe, { through: SavingItem });
Recipe.belongsToMany(Saving, { through: SavingItem });

const PORT = process.env.PORT || 3000;
sequelize
  .sync()
  .then((saving) => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
