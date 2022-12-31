const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "cookbook-node",
  password: ")w3x9KN@@"
});


module.exports = pool.promise();
