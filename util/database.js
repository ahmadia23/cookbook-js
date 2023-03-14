// const Sequelize = require("sequelize");

// const sequelize = new Sequelize('cookbook-node', 'root', ')w3x9KN@@', {
//   dialect: 'mysql',
//   host: 'localhost'
// });

// module.exports = sequelize;

const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
  dialect: "mysql",
  protocol: "mysql",
  logging: false,
  dialectOptions: {
    ssl: "Amazon RDS",
  },
});

module.exports = sequelize;
