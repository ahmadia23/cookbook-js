const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult} = require('express-validator/check');

const User = require("../models/user");

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: "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"
  }
}));
const crypto = require('crypto');

exports.getLogin =  (req,res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  }
  else {
    message = null;
  }
  const isLoggedIn = req.session.isLoggedIn;
  res.render("../views/authentification/login", {
    pageTitle: "Login Page",
    errorMessage: message,
    isAuthenticated: isLoggedIn,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
}
exports.getReset =  (req,res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  }
  else {
    message = null;
  }
  const isLoggedIn = req.session.isLoggedIn;
  res.render("../views/authentification/reset", {
    pageTitle: "Reset password",
    errorMessage: message,
    isAuthenticated: isLoggedIn
  });
}

exports.postReset =  (req,res, next) => {
  const email = req.body.email
 crypto.randomBytes(32, (err, buffer) => {
  if (err) {
    console.log(err);
    return res.redirect('/reset-account');
  }
  const token = buffer.toString('hex');
  User.findAll({where: {email: email}})
    .then(user => {
      if (!user[0]) {
        req.flash('error', 'no account with that email found');
        res.redirect('/reset-account');
      }
      user[0].resetToken = token;
      user[0].resetTokenExpiration = Date.now() + 3600000;
      return user[0].save();
    })
    .then(result => {
      res.redirect("/");
      transporter.sendMail({
        to: email,
        from: "dia.ahmadou23@gmail.com",
        subject: "Password reset",
        html: `
          <p> You requested a password reset </p>
          <p> Click this <a href="http://localhost:3000/reset/${token}">link </a> to set a new password. </p>
        `
      });
    })
    .catch(err => console.log(err))
 })
}

exports.getSignup =  (req,res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  }
  else {
    message = null;
  }
  res.render("../views/authentification/signup", {
    pageTitle: "Login Page",
    errorMessage: message,
    isAuthenticated: isLoggedIn,
    oldInput: {email: '', password: '', confirmedPassword: ''},
    validationErrors: []
  });
}

exports.postLogin =  (req,res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const isLoggedIn = req.session.isLoggedIn

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render("../views/authentification/login", {
      pageTitle: "Login Page",
      errorMessage: errors.array()[0].msg,
      isAuthenticated: isLoggedIn,
      oldInput: {email: email, password: password},
      validationErrors: errors.array()
    });
  }
  User.findAll({where: {email: email}})
    .then(user => {
      if (!user[0]) {
        return res.status(422).render("../views/authentification/login", {
          pageTitle: "Login Page",
          errorMessage: 'Invalid email or password',
          isAuthenticated: isLoggedIn,
          oldInput: {email: email, password: password},
          validationErrors: errors.array()
        });
      }
      bcrypt
        .compare(password, user[0].password)
        .then((doMatch) => {
          if (doMatch){
            req.session.isLoggedIn = true;
            req.session.user = user
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.status(422).render("../views/authentification/login", {
            pageTitle: "Login Page",
            errorMessage: 'Invalid email or password',
            isAuthenticated: isLoggedIn,
            oldInput: {email: email, password: password},
            validationErrors: errors.array()
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect("/login");
        })
    })
    .catch(err => console.log(err));
}

exports.postSignup =  (req,res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmedPassword = req.body.confirmedPassword;
    const isLoggedIn = req.session.isLoggedIn;
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(422).render("../views/authentification/signup", {
      pageTitle: "Login Page",
      errorMessage: errors.array()[0].msg,
      isAuthenticated: isLoggedIn,
      oldInput: {email: email, password: password, confirmedPassword: confirmedPassword},
      validationErrors: errors.array()
    });
  }
  User.findAll({where: {email: email}})
  .then(([userRec]) => {
    if (userRec){
      console.log("pooost siiignup");
      req.flash('error', 'email already exists, please pick another one !');
      return res.redirect("/sign-up");
    }
    return bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
      });
      user.createSaving();
      console.log(user);
      return user.save();
    })
    .then((results) => {
        res.redirect("/login");
        return transporter.sendMail({
          to: email,
          from: "contact@my-cookbook.com",
          subject: "Signup succeeded !",
          html: "<h1> You successfully signe up ! </h1>"
        });
    })
    .catch(err => {
      console.log(err);
    });
  })
  .catch(err => {
    console.log(err);
  })
}

exports.postLogout =  (req,res, next) => {
  console.log("log ouuuuut");
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
}


exports.getNewPassword = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const token = req.params.token;
  User.findByPk(1)
    .then(user => {
      console.log(user[0])
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      }
      else {
        message = null;
      }
        res.render("../views/authentification/new-password", {
        pageTitle: "New password",
        errorMessage: message,
        isAuthenticated: isLoggedIn,
        userId: user[0].id,
        token: token
      });
    })
    .catch(err => console.log(err))
}

exports.postNewPassword = (req, res, next) => {
  console.log("hello from new password")
  const newPassword = req.body.password;
  const userId = req.body.userId;
  console.log(req.body);
  const token = req.body.token;
  let resetUser;
  User.findByPk(userId)
    .then(user => {
      if (user[0].password === newPassword){
        req.flash('error', 'Choose a different password than the previous one!');
        res.redirect(`reset-account/${token}`);
      }
      resetUser = user[0];
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      return resetUser.update({
        password: hashedPassword,
        resetToken: undefined,
        resetTokenExpiration: undefined
      });
    })
    .then(results => {
      res.redirect("/login");
    })
    .catch(err => console.log(err));
}
