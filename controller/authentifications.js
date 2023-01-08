const User = require("../models/user");
const bcrypt = require('bcryptjs');


exports.getLogin =  (req,res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render("../views/authentification/login", {
    pageTitle: "Login Page",
    isAuthenticated: isLoggedIn
  });
}

exports.getSignup =  (req,res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render("../views/authentification/signup", {
    pageTitle: "Login Page",
    isAuthenticated: isLoggedIn
  });
}

exports.postLogin =  (req,res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findAll({where: {email: email}})
    .then((user) => {
      if(!user){
        res.redirect("/login");
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
          res.redirect("/login");
        })
        .catch(err => {
          console.log(err);
          res.redirect("/login")
        })
    })
    .catch(err => console.log(err));
}

exports.postSignup =  (req,res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmedPassword = req.body.confirmedPassword;
  User.findAll({where: {email: email}})
  .then(([userRec]) => {
    if (userRec){
      console.log("pooost siiignup");
      return res.redirect("/login");
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
    });
  })
    .then((results) => {
      res.redirect("/login");
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
