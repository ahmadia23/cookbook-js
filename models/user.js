const {Sequelize, DataTypes} = require('sequelize');


const sequelize = require('../util/database');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  email: DataTypes.STRING,
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = User;
