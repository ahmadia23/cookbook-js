const Sequelize = require("sequelize");

const sequelize = new Sequelize('cookbook-node', 'root', ')w3x9KN@', {
  dialect: 'mysql',
  host: 'localhost'
});


module.exports = sequelize;
