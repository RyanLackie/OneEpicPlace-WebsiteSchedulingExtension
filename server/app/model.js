//Required Modules
const mysql = require('mysql');
var conn = mysql.createPool({
    
    host: '134.209.119.199', //ip of server
    port: '3306',

    database: 'OEP',
    user: 'outsideConnection',
    password: 'outsideConn_OEP-server',
    /*
    host: 'localhost',
    port: '3306',

    database: 'oep',
    user: 'root',
    password: '',
    */
    connectionLimit: 30
});

const ADMIN_PRIVILEGE = 6, MIN_MEMBER_PRIVILEGE = 1;

class Model {
    constructor() {}

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////          User Methods         //////////////////////////////////////////
    */////////////////////////////////////////////////////////////////////////////////////////////////////////
    checkForEmail(email, emailCheckResponse) {
        conn.query('SELECT * FROM users WHERE email = ' + mysql.escape(email), (err, result) => {
            if (err) throw err;
            if (result.length > 0)
                return emailCheckResponse(result[0]);
            else
                return emailCheckResponse('409');           
        });
    }
    checkForUsername(username, usernameCheckResponse) {
        conn.query('SELECT * FROM users WHERE username = ' + mysql.escape(username), (err, result) => {
            if (err) throw err;
            if (result.length > 0)
                return usernameCheckResponse(result[0]);
            else
                return usernameCheckResponse('409');
        });
    }

    getAccount(identity, password, call_back) {
        console.log('#################getAccount()#################');
        
        //Find user by email
        this.checkForEmail(identity, emailCheckResponse => {
            if (emailCheckResponse != '409' && password == emailCheckResponse.password) {
                console.log(emailCheckResponse.username + ' has logged in with email');
                return call_back(emailCheckResponse);
            }

            //Find user by username
            this.checkForUsername(identity, usernameCheckResponse => {
                if (usernameCheckResponse != '409' && password == usernameCheckResponse.password) {
                    console.log(usernameCheckResponse.username + ' has logged in with username');
                    return call_back(usernameCheckResponse);
                }
                console.log(identity + ' not found');
                return call_back('409');
            });
        });
    }
    
    updateProfile(user_username, user_password, email, username, password, firstName, lastName, occupation, description, call_back) {
        console.log("#################updateProfile()#################");

        //Get user's current information
        this.getAccount(user_username, user_password, fetchedUser => {
            if (fetchedUser == '409')
                return call_back('409');
            
            // eslint-disable-next-line
            this.updateUserEmail(fetchedUser.id, fetchedUser.email, email, emailUpdateResult => {
                // eslint-disable-next-line
                this.updateUserUsername(fetchedUser.id, fetchedUser.username, username, usernameUpdateResult => {
                    //Change other user info
                    this.updateUserInfo(fetchedUser.id, password, firstName, lastName, occupation, description, infoUpdateResult => {
                        return call_back(infoUpdateResult);
                    });                    
                });
            });
        });
    }
    updateUserEmail(id, oldEmail, newEmail, emailUpdateResult) {
        if (oldEmail != newEmail) {
            //Check if new email is in use
            this.checkForEmail(newEmail, emailCheckResponse => {
                if (emailCheckResponse != '409') {
                    console.log('email ' + newEmail + ' is taken');
                    return emailUpdateResult('409');
                }
                //Update email
                conn.query('Update users SET email = ' + mysql.escape(newEmail) + ' WHERE id = ' + mysql.escape(id), (err) => {
                    if (err) throw err;
                    console.log('Email ' + oldEmail + ' changed to ' + newEmail + ' at id: ' + id);
                    return emailUpdateResult('100');
                });
            });
        }
        else
            return emailUpdateResult('100');
    }
    updateUserUsername(id, oldUsername, newUsername, usernameUpdateResult) {
        if (oldUsername != newUsername) {
            //Check if new username is in use
            this.checkForUsername(newUsername, usernameCheckResponse => {
                if (usernameCheckResponse != '409') {
                    console.log('Username ' + newUsername + ' is taken');
                    return usernameUpdateResult(usernameCheckResponse);
                }
                //Update username
                conn.query('Update users SET username = ' + mysql.escape(newUsername) + ' WHERE id = ' + mysql.escape(id), (err) => {
                    if (err) throw err;
                    console.log('Username ' + oldUsername + ' changed to ' + newUsername + ' at id: ' + id);
                    return usernameUpdateResult('100');
                });
            });
        }
        else
            return usernameUpdateResult('100');
    }
    updateUserInfo(id, password, firstName, lastName, occupation, description, infoUpdateResult) {
        //Update profile info
        conn.query('Update users SET password = ' + mysql.escape(password) +
                                ', firstName = ' + mysql.escape(firstName) +
                                ', lastName = ' + mysql.escape(lastName) +
                                ', occupation = ' + mysql.escape(occupation) +
                                ', description = ' + mysql.escape(description) +
                                ' WHERE id = ' + mysql.escape(id), (err) => {
            if (err) throw err;
            console.log('Info changed at id: ' + id);
            //Get new profile info
            conn.query('SELECT * FROM users WHERE id = ' + mysql.escape(id), (err, result) => {
                if (err) throw err;
                infoUpdateResult(result[0]);
            });
        });
    }

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////           Booking Methods          /////////////////////////////////////
    */////////////////////////////////////////////////////////////////////////////////////////////////////////
    getLocations(fetchedLocations) {
        conn.query('SELECT * FROM locations', (err, result) => {
            if (err) throw err;
            fetchedLocations(result);
        });
    }
    getResources(fetchedResources) {
        conn.query('SELECT * FROM resources', (err, result) => {
            if (err) throw err;
            fetchedResources(result);
        });
    }
    getCalendarData(call_back) {
        this.getLocations(fetchedLocations => {
            this.getResources(fetchedResources => {
                return call_back([fetchedLocations, fetchedResources]);
            });
        });
    }

    insertBooking(date, userID, username, password, locationID, locationName, resourceID, title, description, startTime, endTime, bookingColor, noiseLevel, call_back) {
        console.log("#################insertBooking()#################");

        //Check if user is valid
        this.getAccount(username, password, fetchedUser => {
            if (fetchedUser == '409' || fetchedUser.privilege < MIN_MEMBER_PRIVILEGE)
                return call_back('403');

            //Booking time must be between 7AM and 10PM and endTime must be larger than startTime
            var insertStartTime = new Date();
            insertStartTime.setHours(parseInt(startTime.split(":")[0]), parseInt(startTime.split(":")[1]), 0, 0);
            var insertEndTime = new Date();
            insertEndTime.setHours(parseInt(endTime.split(":")[0]), parseInt(endTime.split(":")[1]), 0, 0);

            //Booking time must be between 7AM and 10PM (used to be dates with set hours)
            if (insertStartTime.getHours() < 7 || insertEndTime.getHours() > 22)
                return call_back('404');
            //endTime must be larger than startTime
            if (insertStartTime > insertEndTime)
                return call_back('405')
            //Booking time not in a multiple of 5
            if (parseInt(startTime.split(":")[1]) % 5 != 0 || parseInt(endTime.split(":")[1]) % 5 != 0)
                return call_back('406')

            //Check for booking overlaps
            conn.query('SELECT * FROM bookings WHERE date = ' + mysql.escape(date), (err, result) => {
                if (err) throw err;
                
                for (var index = 0; index < result.length; index++) {
                    var checkStartTime = new Date();
                    checkStartTime.setHours(result[index].startTime.split(":")[0], result[index].startTime.split(":")[1], 0, 0)
                    
                    var checkEndTime = new Date();
                    checkEndTime.setHours(result[index].endTime.split(":")[0], result[index].endTime.split(":")[1], 0, 0);
                    
                    //.getTime() is used so that there is numarical data to compair
                    var check1 = checkStartTime.getTime() < insertStartTime.getTime() && checkEndTime.getTime() > insertStartTime.getTime();
                    var check2 = insertStartTime.getTime() < checkEndTime.getTime() && insertEndTime.getTime() > checkEndTime.getTime();
                    var check3 = insertStartTime.getTime() < checkStartTime.getTime() && insertEndTime.getTime() > checkStartTime.getTime();
                    var check4 = checkStartTime.getTime() < insertEndTime.getTime() && checkEndTime.getTime() > insertEndTime.getTime();
                    var check5 = checkStartTime.getTime() == insertStartTime.getTime() && checkEndTime.getTime() < insertEndTime.getTime();
                    var check6 = checkStartTime.getTime() == insertStartTime.getTime() && insertEndTime.getTime() < checkEndTime.getTime();
                    var check7 = checkStartTime.getTime() < insertStartTime.getTime() && checkEndTime.getTime() == insertEndTime.getTime();
                    var check8 = insertStartTime.getTime() < checkStartTime.getTime() && checkEndTime.getTime() == insertEndTime.getTime();
                    var check9 = insertStartTime.getTime() == checkStartTime.getTime() && checkEndTime.getTime() == insertEndTime.getTime();
                    
                    if (check1 || check2 || check3 || check4 || check5 || check6 || check7 || check8 || check9) {
                        if (result.locationID == locationID)
                            return call_back('407');
                        else if (result.noiseLevel == -1 && noiseLevel == 1)
                            return call_back('408');
                        else if (result.noiseLevel == 1 && noiseLevel == -1)
                            return call_back('409');
                    }
                }

                //Insert booking
                var sql = "INSERT INTO bookings (date, userID, username, locationID, locationName, resourceID, title, description, startTime, endTime, bookingColor, noiseLevel) VALUES ('"+date+"', '"+userID+"', '"+username+"', '"+locationID+"', '"+locationName+"', '"+resourceID+"', '"+title+"', '"+description+"', '"+startTime+"', '"+endTime+"', '"+bookingColor+"', '"+noiseLevel+"')";
                conn.query(sql, function(err, result) {
                    if (err) throw err;
                    console.log("Booking " + result.insertId + " inserted: " + locationName + " at " + startTime + " to " + endTime);
                    return call_back('100');
                });            
            });
        });    
    }
    removeBooking(id, call_back) {
        console.log(id);
        conn.query('DELETE FROM bookings WHERE id = ' + mysql.escape(id), (err) => {
            if (err) throw err;
            return call_back('100');
        });
    }
    getBookingsDate(startDate, endDate, call_back) {
        console.log("#################getBookingsDate()#################");

        conn.query('SELECT * FROM bookings WHERE date >= ' + mysql.escape(startDate) + ' and  date <= ' + mysql.escape(endDate), (err, result) => {
            if (err) throw err;
            console.log(result.length + " Bookings found");
            return call_back(result);
        });
    }

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////           Admin Methods          //////////////////////////////////////
    */////////////////////////////////////////////////////////////////////////////////////////////////////////
    admin_GetData(user_username, user_password, call_back) {
        this.getAccount(user_username, user_password, fetchedUser => {
            if (fetchedUser == '409' || fetchedUser.privilege != ADMIN_PRIVILEGE)
                return call_back('409');

            conn.query('SELECT * FROM users', (err, users) => {
                if (err) throw err;
                this.getLocations(locations => {
                    this.getResources(resources => {
                        return call_back([users, locations, resources]);
                    });
                });
            });
        });
    }
    admin_GetUsers(user_username, user_password, call_back) {
        this.getAccount(user_username, user_password, fetchedUser => {
            if (fetchedUser == '409' || fetchedUser.privilege != ADMIN_PRIVILEGE)
                return call_back('409');

            conn.query('SELECT * FROM users', (err, result) => {
                if (err) throw err;
                return call_back(result);
            });
        });
    }

    admin_CreateAccount(user_username, user_password, privilege, email, username, password, firstName, lastName, occupation, description, call_back) {
        console.log('#################admin_CreateAccount()#################');

        this.getAccount(user_username, user_password, fetchedUser => {
            if (fetchedUser == '409' || fetchedUser.privilege != ADMIN_PRIVILEGE)
                return call_back('408');
            //Find user by email
            this.checkForEmail(email, emailCheckResponse => {
                if (emailCheckResponse != '409') {
                    return call_back('409');
                }
                //Find user by username
                this.checkForUsername(username, usernameCheckResponse => {
                    if (usernameCheckResponse != '409') {
                        return call_back('410');
                    }
                    //Create User
                    conn.query("INSERT INTO users (privilege, email, username, password, firstName, lastName, occupation, description) VALUES ('"+privilege+"', '"+email+"', '"+username+"', '"+password+"', '"+firstName+"', '"+lastName+"', '"+occupation+"', '"+description+"')", (err) => {
                        if (err) throw err;
                        return call_back('100');
                    });
                });
            });
        });
    }

    admin_UpdateAccount(user_username, user_password, id, privilege, previousEmail, email, previousUsername, username, password, firstName, lastName, occupation, description, call_back) {
        //Check for admin privilege
        this.getAccount(user_username, user_password, fetchedUser => {
            if (fetchedUser == '409' || fetchedUser.privilege != ADMIN_PRIVILEGE)
                return call_back('409');
            // eslint-disable-next-line
            this.admin_UpdateUserEmail(id, previousEmail, email, emailUpdateResult => {
                // eslint-disable-next-line
                this.admin_UpdateUserUsername(id, previousUsername, username, usernameUpdateResult => {
                    this.admin_UpdateUserInfo(id, privilege, password, firstName, lastName, occupation, description, infoUpdateResult => {
                        return call_back(infoUpdateResult);
                    });                    
                });
            });
        });
    }
    admin_UpdateUserEmail(id, previousEmail, email, emailUpdateResult) {
        if (previousEmail != email) {
            //Check if new email is in use
            this.checkForEmail(email, emailCheckResponse => {
                if (emailCheckResponse != '409')
                    return emailUpdateResult('408');
                //Update Email
                conn.query('Update users SET email = ' + mysql.escape(email) + ' WHERE id = ' + mysql.escape(id), (err) => {
                    if (err) throw err;
                    return emailUpdateResult('100');
                });
            });
        }
        else
            return emailUpdateResult('100');
    }
    admin_UpdateUserUsername(id, previousUsername, username, usernameUpdateResult) {
        if (previousUsername != username) {
            //Check if new username is in use
            this.checkForUsername(username, usernameCheckResponse => {
                if (usernameCheckResponse != '409')
                    return usernameUpdateResult('408');
                conn.query('Update users SET username = ' + mysql.escape(username) + ' WHERE id = ' + mysql.escape(id), (err) => {
                    if (err) throw err;
                    return usernameUpdateResult('100');
                });
            });
        }
        else
            return usernameUpdateResult('100');
    }
    admin_UpdateUserInfo(id, privilege, password, firstName, lastName, occupation, description, infoUpdateResult) {
        //Update profile info
        conn.query('Update users SET privilege = ' + mysql.escape(privilege) +
                                ', password = ' + mysql.escape(password) +
                                ', firstName = ' + mysql.escape(firstName) +
                                ', lastName = ' + mysql.escape(lastName) +
                                ', occupation = ' + mysql.escape(occupation) +
                                ', description = ' + mysql.escape(description) +
                                ' WHERE id = ' + mysql.escape(id), (err) => {
            if (err) throw err;
            conn.query('SELECT * FROM users WHERE id = ' + mysql.escape(id), (err, result) => {
                if (err) throw err;
                infoUpdateResult(result[0]);
            });
        });
    }

    admin_RemoveAccount(user_username, user_password, id, call_back) {
        this.getAccount(user_username, user_password, fetchedUser => {
            if (fetchedUser == '409' || fetchedUser.privilege != ADMIN_PRIVILEGE)
                return call_back('409');
            conn.query('DELETE FROM users WHERE id = ' + mysql.escape(id), (err) => {
                if (err) throw err;
                return call_back('100');
            });
        });
    }

    /*
    Locations
    */
    admin_CreateLocation(user_username, user_password, name, pointCost, type, call_back) {
        //Check for admin privilege
        this.getAccount(user_username, user_password, fetchedUser => {
            if (fetchedUser == '409' || fetchedUser.privilege != ADMIN_PRIVILEGE)
                return call_back('409');
            //Check for location name repeat
            this.getLocations(locations => {
                for (var i = 0; i < locations.length; i++) {
                    if (locations[i].name == name)
                        return call_back('408');
                }
                //Create location
                conn.query("INSERT INTO locations (name, pointCost, type) VALUES ('"+name+"', '"+pointCost+"', '"+type+"')", (err) => {
                    if (err) throw err;
                    return call_back('100');
                });
            });
        });
    }

    admin_UpdateLocation(user_username, user_password, id, previousName, name, pointCost, type, call_back) {
        //Check for admin privilege
        this.getAccount(user_username, user_password, fetchedUser => {
            if (fetchedUser == '409' || fetchedUser.privilege != ADMIN_PRIVILEGE)
                return call_back('409');
            // eslint-disable-next-line
            this.admin_UpdateLocationName(id, previousName, name, nameUpdateResult => {
                this.admin_UpdateLocationInfo(id, pointCost, type, infoUpdateResult => {
                    return call_back(infoUpdateResult);
                });                    
            });
        });
    }
    admin_UpdateLocationName(id, previousName, name, nameUpdateResult) {
        if (previousName != name) {
            //Check if new name is in use
            this.getLocations(locations => {
                for (var i = 0; i < locations.length; i++) {
                    if (locations[i].name == name)
                        return nameUpdateResult('408');
                }
                //Update name
                conn.query('Update locations SET name = ' + mysql.escape(name) + ' WHERE id = ' + mysql.escape(id), (err) => {
                    if (err) throw err;
                    return nameUpdateResult('100');
                });
            });
        }
        else
            return nameUpdateResult('100');
    }
    admin_UpdateLocationInfo(id, pointCost, type, infoUpdateResult) {
        //Update profile info
        conn.query('Update locations SET pointCost = ' + mysql.escape(pointCost) +
                                        ', type = ' + mysql.escape(type) +
                                        ' WHERE id = ' + mysql.escape(id), (err) => {
            if (err) throw err;
            conn.query('SELECT * FROM locations WHERE id = ' + mysql.escape(id), (err, result) => {
                if (err) throw err;
                infoUpdateResult(result[0]);
            });
        });
    }

    admin_RemoveLocation(user_username, user_password, id, call_back) {
        this.getAccount(user_username, user_password, fetchedUser => {
            if (fetchedUser == '409' || fetchedUser.privilege != ADMIN_PRIVILEGE)
                return call_back('409');
            conn.query('DELETE FROM locations WHERE id = ' + mysql.escape(id), (err) => {
                if (err) throw err;
                return call_back('100');
            });
        });
    }


    /*
    Resources
    */
    admin_CreateResource(user_username, user_password, name, quantity, call_back) {
        //Check for admin privilege
        this.getAccount(user_username, user_password, fetchedUser => {
            if (fetchedUser == '409' || fetchedUser.privilege != ADMIN_PRIVILEGE)
                return call_back('409');
            //Check for resouce name repeat
            this.getResources(resources => {
                for (var i = 0; i < resources.length; i++) {
                    if (resources[i].name == name)
                        return call_back('408');
                }
                //Create resource
                conn.query("INSERT INTO resources (name, quantity) VALUES ('"+name+"', '"+quantity+"')", (err) => {
                    if (err) throw err;
                    return call_back('100');
                });
            });
        });
    }

    admin_UpdateResource(user_username, user_password, id, previousName, name, quantity, call_back) {
        //Check for admin privilege
        this.getAccount(user_username, user_password, fetchedUser => {
            if (fetchedUser == '409' || fetchedUser.privilege != ADMIN_PRIVILEGE)
                return call_back('409');
            // eslint-disable-next-line
            this.admin_UpdateResourceName(id, previousName, name, nameUpdateResult => {
                //Update profile info
                conn.query('Update resources SET quantity = ' + mysql.escape(quantity) + ' WHERE id = ' + mysql.escape(id), (err) => {
                    if (err) throw err;
                    conn.query('SELECT * FROM resources WHERE id = ' + mysql.escape(id), (err, result) => {
                        if (err) throw err;
                        call_back(result[0]);
                    });
                });                   
            });
        });
    }
    admin_UpdateResourceName(id, previousName, name, nameUpdateResult) {
        if (previousName != name) {
            //Check if new name is in use
            this.getResources(resources => {
                for (var i = 0; i < resources.length; i++) {
                    if (resources[i].name == name)
                        return nameUpdateResult('408');
                }
                //Update name
                conn.query('Update resources SET name = ' + mysql.escape(name) + ' WHERE id = ' + mysql.escape(id), (err) => {
                    if (err) throw err;
                    return nameUpdateResult('100');
                });
            });
        }
        else
            return nameUpdateResult('100');
    }

    admin_RemoveResource(user_username, user_password, id, call_back) {
        this.getAccount(user_username, user_password, fetchedUser => {
            if (fetchedUser == '409' || fetchedUser.privilege != ADMIN_PRIVILEGE)
                return call_back('409');
            conn.query('DELETE FROM resources WHERE id = ' + mysql.escape(id), (err) => {
                if (err) throw err;
                return call_back('100');
            });
        });
    }

    admin_RunReport(user_username, user_password, users, locations, resources, startDate, endDate, call_back) {
        this.getAccount(user_username, user_password, fetchedUser => {
            if (fetchedUser == '409' || fetchedUser.privilege != ADMIN_PRIVILEGE)
                return call_back('409');
            
            this.getBookingsDate(startDate, endDate, bookings => {

                for (var booking = 0; booking < bookings.length; booking++) {
                    //Users
                    var keep = false;
                    for (var user = 0; user < users.length; user++) {
                        if (bookings[booking].userID == users[user].id) {
                            keep = true;
                            break;
                        }
                    }
                    if (!keep) {
                        bookings.splice(booking, 1);
                        booking--;
                        continue;
                    }
                    //Locations
                    keep = false;
                    for (var loc = 0; loc < locations.length; loc++) {
                        if (bookings[booking].locationID == locations[loc].id) {
                            keep = true;
                            break;
                        }
                    }
                    if (!keep) {
                        bookings.splice(booking, 1);
                        booking--;
                        continue;
                    }
                    //Resources
                    keep = false;
                    bookings[booking].resourceID = bookings[booking].resourceID.split(',');             //put into array format
                    for (var res1 = 0; res1 < resources.length; res1++) {                               //filtered resources
                        for (var res2 = 0; res2 < bookings[booking].resourceID.length; res2++) {        //found resources
                            if (bookings[booking].resourceID[res2] == resources[res1].id) {             //if found resource is apart of the filtered condition
                                keep = true;
                                break;
                            }
                        }
                        if(keep)
                            break;
                    }
                    if (!keep) {
                        bookings.splice(booking, 1);
                        booking--;
                        continue;
                    }
                }

                call_back(bookings);
            });
        });
    }
}

module.exports = Model;