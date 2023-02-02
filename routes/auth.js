const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin");
const recipesController = require("../controller/recipes");
const authController = require("../controller/authentifications");
const {check, body} = require("express-validator");
const User = require("../models/user");


router.get("/login", authController.getLogin);
router.post(
  "/login",
  [ body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
);

router.get("/reset-account", authController.getReset);
router.post("/reset-password", authController.postReset);


router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);


router.get("/signup", authController.getSignup);
router.post(
      "/signup",
      [ check('email')
      .isEmail()
      .withMessage("Please add a valid email. ")
      .normalizeEmail(),
      // .custom((value, {req}) => {
      //   if (value === 'test@test.com'){
      //     throw new Error("This email adress is forbidden");
      //   }
      //   return true;
      // })
        body(
          'password',
          "Please enter a password with only numbers and text and at least 5 characters"
        )
        .isLength({min: 5})
        .isAlphanumeric()
        .trim(),
        body(
          'confirmedPassword'
        )
        .trim()
        .custom((value, {req}) => {
          if (value !== req.body.password){
            throw new Error("Please passwords have to match !");
          }
        return true;
        })
      ],
      authController.postSignup
    );

router.post("/logout", authController.postLogout);

module.exports = router;
