const express = require('express');
//const lobby = require('./lobby/controller');
//const lobby = require('./database/controller');

const app = express();

const port = 3000;
const server = "localhost";

//Code used in class
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/", express.static(__dirname + "/../client/"));

//Code used for the communication between users
//app.use('/lobby', lobby);

//Code used for the communication between users
//app.use('/database', database);

//Port
app.listen(port);
console.log(`listening on: http://${server}:${port}`);