const cookbooks = []


exports.getAddCookbook = (req,res, next) => {
  res.render("../views/new-cookbook", {
    pageTitle: "new cookbook",
  });
}
exports.postAddCookbook =  (req,res, next) => {
  cookbooks.push({
    title: req.body.recipe,
    image: req.body.url
  })
  console.log(cookbooks)
  res.redirect("/home");
}

exports.getHome = (req,res, next) => {
  res.render("../views/home", {
    pageTitle: "home",
    cookbooks: cookbooks
  });
}
