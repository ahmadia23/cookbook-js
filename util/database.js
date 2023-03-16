const fs = require("fs");

const Sequelize = require("sequelize");

console.log(process.env);

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    dialect: "mysql",
    protocol: "mysql",
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
