const Sequelize = require("sequelize")

const sequelize = require('../util/database');

const Cookbook = sequelize.define('cookbook', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  theme: {
    type: Sequelize.STRING,
    allowNull: false
  },
});


module.exports = Cookbook;
