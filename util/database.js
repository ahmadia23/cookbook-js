const fs = require("fs");
const env = require("dotenv").config().parsed;

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE_NAME || env.DATABASE_NAME,
  process.env.DATABASE_USERNAME || env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD || env.DATABASE_PASSWORD,
  {
    dialect: "mysql",
    protocol: "mysql",
    host: process.env.DATABASE_HOST || env.DATABASE_HOST,
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }
);
// const sequelize = new Sequelize(
//   process.env.MYSQL_DATABASE,
//   process.env.MYSQL_USERNAME,
//   process.env.MYSQL_PASSWORD,
//   {
//     dialect: "mysql",
//     protocol: "mysql",
//     logging: false,
//     dialectOptions: {
//       ssl: {
//         rejectUnauthorized: false,
//       },
//     },
//   }
// );

module.exports = sequelize;
