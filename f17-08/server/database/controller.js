const express = require('express');
const Database = require('./model');

var database = new Database();

const app = express.Router();

//Use for connecting to database
app.post('/connectToDatabase', (req, res) => {
    var conn = database.connectToDatabase();
    res.send(conn);
})

//Use for registering a new user
app.post('/insertUser', (req, res) => {
    database.insertUserIntoTable(req.body.conn, req.body.email, req.body.password, req.body.username, 
                                    req.body.firstName, req.body.lastName, req.body.occupation, req.body.description);
})

module.exports = app;