const {Sequelize, DataTypes} = require('sequelize');


const sequelize = require('../util/database');

const SavingItem = sequelize.define('savingItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
})

module.exports = SavingItem;
