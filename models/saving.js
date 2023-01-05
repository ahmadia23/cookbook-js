const {Sequelize, DataTypes} = require('sequelize');


const sequelize = require('../util/database');

const Saving = sequelize.define('saving', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
})

module.exports = Saving;
