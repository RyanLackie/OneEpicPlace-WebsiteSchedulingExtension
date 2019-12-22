const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const conn = mysql.createPool({
    host: process.env.MySQL_HOST,
    port: process.env.MySQL_PORT,
    
    database: process.env.MySQL_DB,
    user: process.env.MySQL_USER,
    password: process.env.MySQL_PASS,
    
    connectionLimit: process.env.CONNECTION_LIMIT
});

console.log(conn);

module.exports = conn;