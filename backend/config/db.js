const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Cyber&123",
    database: "secure_file_vault"
});

module.exports = db;