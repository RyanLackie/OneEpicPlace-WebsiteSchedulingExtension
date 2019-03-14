//Local Production
const api_root = "http://localhost:81";

//Server Deployment
//const api_root = "http://206.189.167.65:81";

var user = null;

export function getLocalUser() {
    return user;
}
export function logoutUser() {
    user = null;
}

//User Methods
export function createAccount(email, username, password, firstName, lastName, occupation, description) {
    return myFetch(api_root + "/app/createAccount", {
        email, username, password, firstName, lastName, occupation, description
    }).then(fetchedUser => user = fetchedUser);
}
export function getAccount(identity, password) {
    return myFetch(api_root + "/app/getAccount", {
        identity, password
    }).then(fetchedUser => user = fetchedUser);
}
export function updateProfile(email, username, password, firstName, lastName, occupation, description) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/updateProfile", {
        user_username, user_password, email, username, password, firstName, lastName, occupation, description
    }).then(fetchedUser => user = fetchedUser);
}

//Booking Methods
export function getCalendarData() {
    return myFetch(api_root + "/app/getCalendarData", {});
}
export function insertBooking(date, locationID, locationName, title, description, startTime, endTime, bookingColor, noiseLevel) {
    var userID = user.id, username = user.username, password = user.password;
    return myFetch(api_root + "/app/insertBooking", {
        date, userID, username, password, locationID, locationName, title, description, startTime, endTime, bookingColor, noiseLevel
    });
}
export function getBookingsDate(startDate, endDate) {
    return myFetch(api_root + "/app/getBookingsDate", {
        startDate, endDate
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function myFetch(url = ``, data = null) {
    let options = {
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
    };
    if(data) {
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