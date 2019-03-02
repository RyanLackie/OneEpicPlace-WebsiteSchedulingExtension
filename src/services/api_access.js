//Local Production
const api_root = "http://localhost:81";

//Server Deployment
//const api_root = "http://206.189.167.65:81";

let user = null;

//User Methods
export function signUpUser(email, password, firstName, lastName, occupation, description) {
    return myFetch(api_root + "/app/signUpUser", {
        email, password, firstName, lastName, occupation, description
    }).then(fetchedUser => user = fetchedUser);
}
export function loginUser(email, password) {
    return myFetch(api_root + "/app/loginUser", {
        email, password
    }).then(fetchedUser => user = fetchedUser);
}
export function checkUser() {
    var email = null, password = null;
    if (user != null) {
        email = user.email;
        password = user.password;
    }
    return myFetch(api_root + "/app/checkUser", {
        email, password
    });
}

export function getUser() {
    return user;
}
export function setUser(newUser) {
    console.log("user set: " + newUser);
    user = newUser;
}

export function updateProfile(newEmail, newPassword, firstName, lastName, occupation, description) {
    var oldEmail = null, oldPassword = null;
    if (user != null) {
        oldEmail = user.email;
        oldPassword = user.password;
    }
    return myFetch(api_root + "/app/updateProfile", {
        oldEmail, oldPassword, newEmail, newPassword, firstName, lastName, occupation, description
    });
}

//Booking Methods
export function insertBooking(date, locationID, locationName, title, description, startTime, endTime, bookingColor, noiseLevel) {
    var email = null, password = null, firstName = null, lastName = null;
    if (user != null) {
        email = user.email;
        password = user.password;
        firstName = user.firstName;
        lastName = user.lastName
    }
    return myFetch(api_root + "/app/insertBooking", {
        email, password, firstName, lastName, date, locationID, locationName, title, description, startTime, endTime, bookingColor, noiseLevel
    });
}
export function getBookingsDay(date) {
    return myFetch(api_root + "/app/getBookingsDay", {date});
}
export function getBookingsRange(startDate, endDate) {
    return myFetch(api_root + "/app/getBookingsRange", {startDate, endDate});
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