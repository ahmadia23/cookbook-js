const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin");
const recipesController = require("../controller/recipes");
const authController = require("../controller/authentifications");


router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/reset-account", authController.getReset);
router.post("/reset-password", authController.postReset);


router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);


router.get("/sign-up", authController.getSignup);
router.post("/sign-up", authController.postSignup);

router.post("/logout", authController.postLogout);

module.exports = router;
