const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Recipe = sequelize.define("recipe", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT("long"),
    allowNull: false,
  },
  steps: {
    type: DataTypes.TEXT("long"),
    allowNull: false,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ingredients: {
    type: DataTypes.STRING,
  },
});

module.exports = Recipe;
