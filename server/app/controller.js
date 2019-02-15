const express = require('express');
const Model = require('./model');

var model = new Model();

const app = express.Router();

//User Methods
app.post('/signUpUser', (req, res) => {
    model.signUpUser(
        req.body.email, req.body.password, req.body.firstName, 
        req.body.lastName, req.body.occupation, req.body.description,
        fetchedUser => res.send(fetchedUser)
    );
})
app.post('/loginUser', (req, res) => {
    model.loginUser(
        req.body.email, req.body.password,
        fetchedUser => res.send(fetchedUser)
    );
})
app.post('/checkUser', (req, res) => {
    model.checkUser(
        req.body.email, req.body.password,
        userCheck => res.send(userCheck)
    );
})
app.post('/updateProfile', (req, res) => {
    model.updateProfile(
        req.body.oldEmail, req.body.oldPassword,
        req.body.newEmail, req.body.newPassword, req.body.firstName, 
        req.body.lastName, req.body.occupation, req.body.description,
        updateResult => res.send(updateResult)
    );
})

//Booking Methods
app.post('/insertBooking', (req, res) => {
    model.insertBooking(
        //email, password,     firstName, lastName, locationID, title, description, date, startTime, endTime, bookingColor, noiseLevel
        req.body.email, req.body.password, req.body.firstName, 
        req.body.lastName, req.body.title, req.body.description, 
        req.body.locationID, req.body.date, req.body.startTime, req.body.endTime, 
        bookingResult => res.send(bookingResult)
    );
})
app.post('/getBookings', (req, res) => {
    model.getBookings(
        //req.body.date, 
        bookingResult => res.send(bookingResult)
    );
})


module.exports = app;