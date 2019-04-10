const express = require('express');
const Model = require('./model');

var model = new Model();

const app = express.Router();

//User Methods
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
        fetchedLocations => res.send(fetchedLocations)
    );
})
app.post('/getResources', (req, res) => {
    model.getResources(
        fetchedResources => res.send(fetchedResources)
    );
})
app.post('/getCalendarData', (req, res) => {
    model.getCalendarData(
        fetchedCalendarData => res.send(fetchedCalendarData)
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

//Admin Methods
app.post('/admin_GetData', (req, res) => {
    model.admin_GetData(
        req.body.user_username, req.body.user_password,
        fetchedData => res.send(fetchedData)
    );
})
app.post('/admin_GetUsers', (req, res) => {
    model.admin_GetUsers(
        req.body.user_username, req.body.user_password,
        fetchedUsers => res.send(fetchedUsers)
    );
})

app.post('/admin_CreateAccount', (req, res) => {
    model.admin_CreateAccount(
        req.body.user_username, req.body.user_password,
        req.body.privilege, req.body.email, req.body.username,
        req.body.password, req.body.firstName, req.body.lastName,
        req.body.occupation, req.body.description,
        createResult => res.send(createResult)
    );
})
app.post('/admin_UpdateAccount', (req, res) => {
    model.admin_UpdateAccount(
        req.body.user_username, req.body.user_password,
        req.body.id, req.body.privilege, req.body.previousEmail,
        req.body.email, req.body.previousUsername, req.body.username,
        req.body.password, req.body.firstName, req.body.lastName,
        req.body.occupation, req.body.description,
        updateResult => res.send(updateResult)
    );
})
app.post('/admin_RemoveAccount', (req, res) => {
    model.admin_RemoveAccount(
        req.body.user_username, req.body.user_password, req.body.id,
        removeResult => res.send(removeResult)
    );
})

app.post('/admin_CreateLocation', (req, res) => {
    model.admin_CreateLocation(
        req.body.user_username, req.body.user_password,
        req.body.name, req.body.pointCost, req.body.type,
        updateResult => res.send(updateResult)
    );
})
app.post('/admin_UpdateLocation', (req, res) => {
    model.admin_UpdateLocation(
        req.body.user_username, req.body.user_password,
        req.body.id, req.body.previousName, req.body.name,
        req.body.pointCost, req.body.type,
        updateResult => res.send(updateResult)
    );
})

app.post('/admin_RemoveLocation', (req, res) => {
    model.admin_RemoveLocation(
        req.body.user_username, req.body.user_password, req.body.id,
        removeResult => res.send(removeResult)
    );
})


module.exports = app;