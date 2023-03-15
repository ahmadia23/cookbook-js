const fs = require("fs");

const Sequelize = require("sequelize");

console.log(process.env);

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    dialect: "mysql",
    protocol: "mysql",
    socketPath: "/var/run/mysqld/mysqld.sock",
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }
);

module.exports = sequelize;
