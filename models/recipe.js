const Sequelize = require("sequelize")


const sequelize = require('../util/database');

const Recipe = sequelize.define('recipe', {
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
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
  time: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
});


module.exports = Recipe;
