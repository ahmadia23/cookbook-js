exports.get404 = (req, res, next) => {
  res.status(404).status("error404", {
    pageTitle: "Page Not Found",
    message: "Page not found",
    path: "/404",
  });
};
