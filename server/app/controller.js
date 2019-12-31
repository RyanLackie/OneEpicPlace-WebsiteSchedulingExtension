const express = require('express');
const Model = require('./model');

var model = new Model();

const app = express.Router();

/*////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////        Account Methods        //////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////
//User Methods
app.post('/getAccount', (req, res) => {
    model.getAccount(
        req.body.identity, req.body.password,
        fetchedUser => res.send(fetchedUser)
    );
})
app.post('/updateAccount', (req, res) => {
    model.updateAccount(
        req.body.user_username, req.body.user_password,
        req.body.picture, req.body.firstName, req.body.lastName,
        req.body.companyName, req.body.bio, req.body.email,
        req.body.phoneNumber, req.body.username, req.body.password,
        updateResult => res.send(updateResult)
    );
})
//Admin User Methods
app.post('/admin_GetAllUsers', (req, res) => {
    model.admin_GetAllUsers(
        req.body.user_username, req.body.user_password,
        fetchedUsers => res.send(fetchedUsers)
    );
})

app.post('/admin_CreateAccount', (req, res) => {
    model.admin_CreateAccount(
        req.body.user_username, req.body.user_password,
        req.body.memberLevel, req.body.username, req.body.password,
        req.body.points_1, req.body.points_2, req.body.points_3, req.body.pointsLastUpdated, req.body.notes, req.body.picture,
        req.body.firstName, req.body.lastName, req.body.companyName,
        req.body.bio, req.body.email, req.body.phoneNumber,
        createResult => res.send(createResult)
    );
})
app.post('/admin_UpdateAccount', (req, res) => {
    model.admin_UpdateAccount(
        req.body.user_username, req.body.user_password, req.body.id,
        req.body.memberLevel, req.body.previousUsername, req.body.username, req.body.password,
        req.body.points_1, req.body.points_2, req.body.points_3, req.body.pointsLastUpdated, req.body.notes, req.body.picture,
        req.body.firstName, req.body.lastName, req.body.companyName,
        req.body.bio, req.body.email, req.body.phoneNumber,
        updateResult => res.send(updateResult)
    );
})
app.post('/admin_RemoveAccount', (req, res) => {
    model.admin_RemoveAccount(
        req.body.user_username, req.body.user_password, req.body.id,
        removeResult => res.send(removeResult)
    );
})
/*////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////

/*////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////        Location Methods       //////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/getLocations', (req, res) => {
    model.getLocations(
        fetchedLocations => res.send(fetchedLocations)
    );
})

app.post('/admin_CreateLocation', (req, res) => {
    model.admin_CreateLocation(
        req.body.user_username, req.body.user_password,
        req.body.name, req.body.lowerCost, req.body.higherCost, req.body.type, req.body.color,
        updateResult => res.send(updateResult)
    );
})
app.post('/admin_UpdateLocation', (req, res) => {
    model.admin_UpdateLocation(
        req.body.user_username, req.body.user_password,
        req.body.id, req.body.previousName, req.body.name,
        req.body.lowerCost, req.body.higherCost, req.body.type, req.body.color,
        updateResult => res.send(updateResult)
    );
})
app.post('/admin_RemoveLocation', (req, res) => {
    model.admin_RemoveLocation(
        req.body.user_username, req.body.user_password, req.body.id,
        removeResult => res.send(removeResult)
    );
})
/*////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////

/*////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////        Resource Methods       //////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/getResources', (req, res) => {
    model.getResources(
        fetchedResources => res.send(fetchedResources)
    );
})

app.post('/admin_CreateResource', (req, res) => {
    model.admin_CreateResource(
        req.body.user_username, req.body.user_password,
        req.body.name, req.body.cost, req.body.quantity,
        updateResult => res.send(updateResult)
    );
})
app.post('/admin_UpdateResource', (req, res) => {
    model.admin_UpdateResource(
        req.body.user_username, req.body.user_password,
        req.body.id, req.body.previousName, req.body.name,
        req.body.cost, req.body.quantity,
        updateResult => res.send(updateResult)
    );
})
app.post('/admin_RemoveResource', (req, res) => {
    model.admin_RemoveResource(
        req.body.user_username, req.body.user_password, req.body.id,
        removeResult => res.send(removeResult)
    );
})
/*////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////

/*////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////         Booking Methods       //////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/getBookingsDate', (req, res) => {
    model.getBookingsDate(
        req.body.username, req.body.password,
        req.body.startDate, req.body.endDate,
        bookingsResult => res.send(bookingsResult)
    );
})
app.post('/insertBooking', (req, res) => {
    model.insertBooking(
        req.body.username, req.body.password,
        req.body.locationID, req.body.resourceID, req.body.date,
        req.body.startTime, req.body.endTime, req.body.meetingType,
        req.body.title, req.body.description, req.body.noiseLevel, req.body.privacy,
        bookingResult => res.send(bookingResult)
    );
})
app.post('/updateBooking', (req, res) => {
    model.updateBooking(
        req.body.username, req.body.password, req.body.bookingID,
        req.body.userID, req.body.locationID, req.body.resourceID, req.body.date,
        req.body.startTime, req.body.endTime, req.body.meetingType,
        req.body.title, req.body.description, req.body.noiseLevel, req.body.privacy,
        updateResult => res.send(updateResult)
    );
})
app.post('/removeBooking', (req, res) => {
    model.removeBooking(
        req.body.username, req.body.password, req.body.bookingID,
        req.body.userID, req.body.date, req.body.startTime,
        removeResult => res.send(removeResult)
    );
})
/*////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////

/*////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////           Admin Methods          //////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/admin_GetData', (req, res) => {
    model.admin_GetData(
        req.body.user_username, req.body.user_password,
        fetchedData => res.send(fetchedData)
    );
})
app.post('/admin_RunReport', (req, res) => {
    model.admin_RunReport(
        req.body.user_username, req.body.user_password,
        req.body.users, req.body.locations, req.body.resources,
        req.body.startDate, req.body.endDate,
        reportResoult => res.send(reportResoult)
    );
})
/*////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////


//Booking Methods
app.post('/getCalendarData', (req, res) => {
    model.getCalendarData(
        fetchedCalendarData => res.send(fetchedCalendarData)
    );
})

//Admin Methods



module.exports = app;