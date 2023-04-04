const bcrypt = require("bcryptjs");

const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Saving = require("../models/saving");

const User = require("../models/user");

User.prototype.createSaving = async function () {
  const saving = await Saving.create();
  await this.setSaving(saving); // set the saving association for the user
  return saving;
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.json({
    pageTitle: "Reset password",
    errorMessage: message,
  });
};

exports.postReset = async (req, res, next) => {
  const email = req.body.email;
  try {
    const buffer = await crypto.randomBytes(32);
    const token = buffer.toString("hex");
    const user = await User.findAll({ where: { email: email } });
    if (!user[0]) {
      req.flash("error", "no account with that email found");
      res.redirect("/reset-account");
    }
    user[0].resetToken = token;
    user[0].resetTokenExpiration = Date.now() + 3600000;
    await user[0].save();
    res.redirect("/");
    transporter.sendMail({
      to: email,
      from: "dia.ahmadou23@gmail.com",
      subject: "Password reset",
      html: `<p> You requested a password reset </p> <p> Click this <a href="http://localhost:3000/reset/${token}">link </a> to set a new password. </p> `,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      pageTitle: "Login Page",
      errorMessage: errors.array()[0].msg,
      oldInput: { email: email, password: password },
      validationErrors: errors.array(),
    });
  }

  try {
    const user = await User.findAll({ where: { email: email } });
    if (!user[0]) {
      return res.status(422).json({
        pageTitle: "Login Page",
        errorMessage: "Invalid email or password",
        oldInput: { email: email, password: password },
        validationErrors: errors.array(),
      });
    }
    const doMatch = await bcrypt.compare(password, user[0].password);
    if (doMatch) {
      const token = jwt.sign(
        { email: email, userId: user[0].id },
        "somesupersecret",
        { expiresIn: "1h" }
      );
      return res.status(200).json({ token: token, userId: user[0].id });
    } else {
      return res.status(422).json({
        pageTitle: "Login Page",
        errorMessage: "Invalid email or password",
        oldInput: { email: email, password: password },
        validationErrors: errors.array(),
      });
    }
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmedPassword = req.body.confirmedPassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      pageTitle: "Signup Page",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmedPassword: confirmedPassword,
      },
      validationErrors: errors.array(),
    });
  }

  try {
    const [userRec] = await User.findAll({ where: { email: email } });
    if (userRec) {
      return res.status(422).json({
        errorMessage: "email already been chosen, please pick another one !",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
    });
    await user.save();
    await user.createSaving({ userId: user.id });
    const saving = await user.getSaving();
    console.log(saving);
    req.flash("success", "Signup succeeded, Please login");
    res.json({
      message: "successfully signed up",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: err });
  }
};

exports.postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  console.log(req.body);
  const token = req.body.token;
  let resetUser;
  try {
    const user = await User.findByPk(userId);
    if (user[0].password === newPassword) {
      req.flash("error", "Choose a different password than the previous one!");
      res.redirect(`reset-account/${token}`);
    }
    resetUser = user[0];
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const results = await resetUser.update({
      password: hashedPassword,
      resetToken: undefined,
      resetTokenExpiration: undefined,
    });
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
};
