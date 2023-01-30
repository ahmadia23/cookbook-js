const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  login: async function ({ email, password }) {
    const user = User.findAll({ where: { email: email } });
    if (!user) {
      const error = new Error("user not found");
      error.code = 401;
      throw error;
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch){
      const error = new Error("Password is invalid");
      error.code = 401;
      throw error;
    };
    const token = jwt.sign({
      userId: user.id,
      email: user.email
    }, "somesupersecret", {
      expiresIn: '1h'
    });
    return {
      token: token,
      userId: user.id
    }
  }
};
