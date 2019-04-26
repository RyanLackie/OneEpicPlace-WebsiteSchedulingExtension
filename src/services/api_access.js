//Local Production
//const api_root = "http://localhost:81";

//Server Deployment
const api_root = "http://134.209.119.199:81";

var user = null;

export function getLocalUser() {
    return user;
}
export function logoutUser() {
    user = null;
}

//User Methods
export function getAccount(identity, password) {
    return myFetch(api_root + "/app/getAccount", {
        identity, password
    }).then(fetchedUser => user = fetchedUser);
}
export function getThisAccount() {
    var identity = user.username, password = user.password;
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
export function getLocations() {
    return myFetch(api_root + "/app/getLocations", {});
}
export function getResources() {
    return myFetch(api_root + "/app/getResources", {});
}
export function getCalendarData() {
    return myFetch(api_root + "/app/getCalendarData", {});
}
export function insertBooking(date, locationID, locationName, resourceID, title, description, startTime, endTime, bookingColor, noiseLevel) {
    var userID = user.id, username = user.username, password = user.password;
    return myFetch(api_root + "/app/insertBooking", {
        date, userID, username, password, locationID, locationName, resourceID, title, description, startTime, endTime, bookingColor, noiseLevel
    });
}
//Must be updated to be secure (For presentation only)
export function removeBooking(id) {
    return myFetch(api_root + "/app/removeBooking", {
        id
    });
}
export function getBookingsDate(startDate, endDate) {
    return myFetch(api_root + "/app/getBookingsDate", {
        startDate, endDate
    });
}

//Admin Methods
export function admin_GetData() {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_GetData", {
        user_username, user_password
    });
}
export function admin_GetUsers() {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_GetUsers", {
        user_username, user_password
    });
}

export function admin_CreateAccount(privilege, email, username, password, firstName, lastName, occupation, description) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_CreateAccount", {
        user_username, user_password, privilege, email, username, password, firstName, lastName, occupation, description
    });
}
export function admin_UpdateAccount(id, privilege, previousEmail, email, previousUsername, username, password, firstName, lastName, occupation, description) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_UpdateAccount", {
        user_username, user_password, id, privilege, previousEmail, email, previousUsername, username, password, firstName, lastName, occupation, description
    });
}
export function admin_RemoveAccount(id) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_RemoveAccount", {
        user_username, user_password, id
    });
}

export function admin_CreateLocation(name, pointCost, type) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_CreateLocation", {
        user_username, user_password, name, pointCost, type
    });
}
export function admin_UpdateLocation(id, previousName, name, pointCost, type) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_UpdateLocation", {
        user_username, user_password, id, previousName, name, pointCost, type
    });
}
export function admin_RemoveLocation(id) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_RemoveLocation", {
        user_username, user_password, id
    });
}

export function admin_CreateResource(name, quantity) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_CreateResource", {
        user_username, user_password, name, quantity
    });
}
export function admin_UpdateResource(id, previousName, name, quantity) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_UpdateResource", {
        user_username, user_password, id, previousName, name, quantity
    });
}
export function admin_RemoveResource(id) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_RemoveResource", {
        user_username, user_password, id
    });
}
export function admin_RunReport(users, locations, resources, startDate, endDate) {
    var user_username = user.username, user_password = user.password;
    return myFetch(api_root + "/app/admin_RunReport", {
        user_username, user_password, users, locations, resources, startDate, endDate
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