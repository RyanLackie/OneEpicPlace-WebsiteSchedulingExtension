const express = require('express');
const Model = require('./model');

var model = new Model();

const app = express.Router();

//User Methods
app.post('/createAccount', (req, res) => {
    model.createAccount(
        req.body.email, req.body.username, req.body.password,
        req.body.firstName, req.body.lastName, req.body.occupation,
        req.body.description,
        fetchedUser => res.send(fetchedUser)
    );
})
app.post('/getAccount', (req, res) => {
    model.getAccount(
        req.body.identity, req.body.password,
        fetchedUser => res.send(fetchedUser)
    );
})
app.post('/updateProfile', (req, res) => {
    model.updateProfile(
        req.body.user_username, req.body.user_password,
        req.body.email, req.body.username, req.body.password,
        req.body.firstName, req.body.lastName, req.body.occupation,
        req.body.description,
        updateResult => res.send(updateResult)
    );
})

//Booking Methods
app.post('/getLocations', (req, res) => {
    model.getLocations(
        locations => res.send(locations)
    );
})
app.post('/insertBooking', (req, res) => {
    model.insertBooking(
        req.body.date, req.body.userID, req.body.username, req.body.password,
        req.body.locationID, req.body.locationName, req.body.title, 
        req.body.description, req.body.startTime, req.body.endTime,
        req.body.bookingColor, req.body.noiseLevel,
        bookingResult => res.send(bookingResult)
    );
})
app.post('/getBookingsDate', (req, res) => {
    model.getBookingsDate(
        req.body.startDate, req.body.endDate,
        bookingsResult => res.send(bookingsResult)
    );
})


module.exports = app;