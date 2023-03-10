const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeaders = req.get("Authorization");

  if (!authHeaders) {
    const error = new Error("Not Authenticated.");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeaders.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "somesupersecret");
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
  if (!decodedToken) {
    const error = new Error("Not Authenticated.");
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  next();
};
