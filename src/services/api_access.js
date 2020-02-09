//Local Production
const api_root = "http://localhost:81";

//Server Deployment
// const api_root = "http://165.227.84.63:81";

var user = null;

export function getLocalUser() {return user;}
export function logoutUser() {user = null;}

/*////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////        Account Methods        //////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////
//User Methods
export function getAccount_local() {
    var identity = null, password = null;
    if (user != null)
        identity = user.username, password = user.password;
    return myFetch(api_root + "/app/getAccount", {
        identity, password
    }).then(fetchedUser => user = fetchedUser);
}
export function getAccount(identity, password) {
    return myFetch(api_root + "/app/getAccount", {
        identity, password
    }).then(fetchedUser => user = fetchedUser);
}

export function updateAccount(picture, firstName, lastName, companyName, bio, email, phoneNumber, username, password) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/updateAccount", {
        user_username, user_password, picture, firstName, lastName, companyName, bio, email, phoneNumber, username, password
    }).then(fetchedUser => user = fetchedUser);
}
//Admin User Methods
export function admin_GetAllUsers() {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_GetAllUsers", {
        user_username, user_password
    });
}

export function admin_CreateAccount(memberLevel, username, password, points_1, points_2, points_3, pointsLastUpdated, notes, picture, firstName, lastName, companyName, bio, email, phoneNumber) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_CreateAccount", {
        user_username, user_password, memberLevel, username, password, points_1, points_2, points_3, pointsLastUpdated, notes, picture, firstName, lastName, companyName, bio, email, phoneNumber
    });
}
export function admin_UpdateAccount(id, memberLevel, previousUsername, username, password, points_1, points_2, points_3, pointsLastUpdated, notes, picture, firstName, lastName, companyName, bio, email, phoneNumber) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_UpdateAccount", {
        user_username, user_password, id, memberLevel, previousUsername, username, password, points_1, points_2, points_3, pointsLastUpdated, notes, picture, firstName, lastName, companyName, bio, email, phoneNumber
    });
}
export function admin_RemoveAccount(id) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_RemoveAccount", {
        user_username, user_password, id
    });
}
/*////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////

/*////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////        Location Methods       //////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////
export function getLocations() {
    return myFetch(api_root + "/app/getLocations", {});
}

export function admin_CreateLocation(name, lowerCost, higherCost, type, color) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_CreateLocation", {
        user_username, user_password, name, lowerCost, higherCost, type, color
    });
}
export function admin_UpdateLocation(id, previousName, name, lowerCost, higherCost, type, color) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_UpdateLocation", {
        user_username, user_password, id, previousName, name, lowerCost, higherCost, type, color
    });
}
export function admin_RemoveLocation(id) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_RemoveLocation", {
        user_username, user_password, id
    });
}
/*////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////

/*////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////        Resource Methods       //////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////
export function getResources() {
    return myFetch(api_root + "/app/getResources", {});
}

export function admin_CreateResource(name, cost, quantity) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_CreateResource", {
        user_username, user_password, name, cost, quantity
    });
}
export function admin_UpdateResource(id, previousName, name, cost, quantity) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_UpdateResource", {
        user_username, user_password, id, previousName, name, cost, quantity
    });
}
export function admin_RemoveResource(id) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_RemoveResource", {
        user_username, user_password, id
    });
}
/*////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////

/*////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////         Booking Methods       //////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////
export function getBookingsDate(startDate, endDate) {
    var username = user.username, password = user.password;
    return myFetch(api_root + "/app/getBookingsDate", {
        username, password, startDate, endDate
    });
}
export function insertBooking(locationID, resourceID, date, startTime, endTime, meetingType, title, description, noiseLevel, privacy) {
    var username = user.username, password = user.password;
    return myFetch(api_root + "/app/insertBooking", {
        username, password, locationID, resourceID, date, startTime, endTime, meetingType, title, description, noiseLevel, privacy
    });
}
export function updateBooking(bookingID, userID, locationID, resourceID, date, startTime, endTime, meetingType, title, description, noiseLevel, privacy, canceled) {
    var username = user.username, password = user.password;
    return myFetch(api_root + "/app/updateBooking", {
        username, password, bookingID, userID, locationID, resourceID, date, startTime, endTime, meetingType, title, description, noiseLevel, privacy, canceled
    });
}
export function removeBooking(bookingID, userID, date, startTime) {
    var username = user.username, password = user.password;
    return myFetch(api_root + "/app/removeBooking", {
        username, password, bookingID
    });
}
/*////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////

/*////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////           Admin Methods          //////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////
export function admin_GetData() {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_GetData", {
        user_username, user_password
    });
}
export function admin_RunReport(users, locations, resources, startDate, endDate) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_RunReport", {
        user_username, user_password, users, locations, resources, startDate, endDate
    });
}
/*////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////////////////////



export function getCalendarData() {
    return myFetch(api_root + "/app/getCalendarData", {});
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function myFetch(url = ``, data = null) {
    let options = {
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
    };
    if (data) {
        options = { 
            ...options,
            method:  "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        };
    }
    return fetch(url, options)
    .then(response => {
        return response.json()
    }); // parses response to JSON
}