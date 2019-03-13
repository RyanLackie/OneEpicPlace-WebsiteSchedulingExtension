const mysql = require('mysql');
              require('dotenv').config();

const conn = mysql.createPool({
    host: process.env.MySQL_HOST,
    port: process.env.MySQL_PORT,
    
    database: process.env.MySQL_DB,
    user: process.env.MySQL_USER,
    password: process.env.MySQL_PASS,
    
    insecureAuth: true,
    connectionLimit: 30
});

module.exports = conn;