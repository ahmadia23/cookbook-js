const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Category = sequelize.define("category", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  theme: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
});

module.exports = Category;
