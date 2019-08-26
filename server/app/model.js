//Required Modules
const mysql = require('mysql');
var conn = mysql.createPool({
    /*
    host: '159.89.238.244', //ip of server
    port: '3306',

    database: 'OEP',
    user: 'outsideConnection',
    password: 'outsideConn_OEP-server',
    */
    host: 'localhost',
    port: '3306',

    database: 'oep_dev',
    user: 'root',
    password: '',
    
    connectionLimit: 30
});

const ADMIN_PRIVILEGE = 6, MIN_MEMBER_PRIVILEGE = 1;

/*
    100 => Method was sucessful
    404 => Method search results in an element not being found / Admin method being called without finding matching credentials
    405 => Username is already taken
    406 => Name is already taken
*/

class Model {
    constructor() {}

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////        Account Methods        //////////////////////////////////////////
    */////////////////////////////////////////////////////////////////////////////////////////////////////////
    //User Methods
    getAccount(identity, password, call_back) {
        this.checkForUsername(identity, usernameCheckResponse => {
            if (usernameCheckResponse != '404' && password == usernameCheckResponse.password) {
                var account = this.stripAccount(usernameCheckResponse);
                console.log(account.picture);
                return call_back(account);
            }
            return call_back('404');
        });
    }
    
    updateAccount(user_username, user_password, picture, firstName, lastName, companyName, bio, email, phoneNumber, username, password, call_back) {
        console.log(picture);
        this.getAccount(user_username, user_password, fetchedUser => {
            if (fetchedUser == '404')
                return call_back('404');
            // eslint-disable-next-line
            this.updateUsername(fetchedUser.id, fetchedUser.username, username, usernameUpdateResult => {
                //Change other user info
                this.updateAccountInfo(fetchedUser.id, picture, firstName, lastName, companyName, bio, email, phoneNumber, password, infoUpdateResult => {
                    var account = this.stripAccount(infoUpdateResult);
                    return call_back(account);
                });                    
            });
        });
    }

    //Admin Methods
    admin_GetAllUsers(user_username, user_password, call_back) {
        this.admin_CheckAdminPrivilege(user_username, user_password, fetchedUser => {
            if (fetchedUser == '404')
                return call_back('404');
            conn.query('SELECT * FROM users', (err, result) => {
                if (err) throw err;
                return call_back(result);
            });
        });
    }

    admin_CreateAccount(user_username, user_password, memberLevel, username, password, points, notes, picture, firstName, lastName, companyName, bio, email, phoneNumber, call_back) {
        this.admin_CheckAdminPrivilege(user_username, user_password, fetchedUser => {
            if (fetchedUser == '404')
                return call_back('404');
            this.checkForUsername(username, usernameCheckResponse => {
                if (usernameCheckResponse != '404')
                    return call_back('405');
                conn.query("INSERT INTO users (memberLevel, username, password, points, notes, picture, firstName, lastName, companyName, bio, email, phoneNumber) VALUES " +
                "('"+memberLevel+"', '"+username+"', '"+password+"', '"+points+"', '"+notes+"', '"+picture+"', '"+firstName+"', '"+lastName+"', '"+companyName+"', '"+bio+"', '"+email+"', '"+phoneNumber+"')", (err) => {
                    if (err) throw err;
                    return call_back('100');
                });
            });
        });
    }

    admin_UpdateAccount(user_username, user_password, id, memberLevel, previousUsername, username, password, points, notes, picture, firstName, lastName, companyName, bio, email, phoneNumber, call_back) {
        this.admin_CheckAdminPrivilege(user_username, user_password, fetchedUser => {
            if (fetchedUser == '404')
                return call_back('404');
            // eslint-disable-next-line
            this.updateUsername(id, previousUsername, username, usernameUpdateResult => {
                // eslint-disable-next-line
                this.updateAccountInfo(id, picture, firstName, lastName, companyName, bio, email, phoneNumber, password, infoUpdateResult => {
                    this.admin_UpdateAccountInfo(id, memberLevel, points, notes, adminInfoUpdateResult => {
                        return call_back(adminInfoUpdateResult);
                    });  
                });             
            });
        });
    }

    admin_RemoveAccount(user_username, user_password, id, call_back) {
        this.admin_CheckAdminPrivilege(user_username, user_password, fetchedUser => {
            if (fetchedUser == '404')
                return call_back('404');
            conn.query('DELETE FROM users WHERE id = ' + mysql.escape(id), (err) => {
                if (err) throw err;
                return call_back('100');
            });
        });
    }

    //Utility Methods
    stripAccount(account) {
        delete account.points;
        delete account.notes;
        return account;
    }

    checkForUsername(username, usernameCheckResponse) {
        conn.query('SELECT * FROM users WHERE username = ' + mysql.escape(username), (err, result) => {
            if (err) throw err;
            if (result.length > 0)
                return usernameCheckResponse(result[0]);
            else
                return usernameCheckResponse('404');
        });
    }

    updateUsername(id, previousUsername, username, usernameUpdateResult) {
        if (previousUsername != username) {
            this.checkForUsername(username, usernameCheckResponse => {
                if (usernameCheckResponse != '404')
                    return usernameUpdateResult(usernameCheckResponse);
                conn.query('Update users SET username = ' + mysql.escape(username) + ' WHERE id = ' + mysql.escape(id), (err) => {
                    if (err) throw err;
                    return usernameUpdateResult('100');
                });
            });
        }
        else
            return usernameUpdateResult('100');
    }

    updateAccountInfo(id, picture, firstName, lastName, companyName, bio, email, phoneNumber, password, infoUpdateResult) {
        conn.query('Update users SET picture = ' + mysql.escape(picture) +
                                ', firstName = ' + mysql.escape(firstName) +
                                ', lastName = ' + mysql.escape(lastName) +
                                ', companyName = ' + mysql.escape(companyName) +
                                ', bio = ' + mysql.escape(bio) +
                                ', email = ' + mysql.escape(email) +
                                ', phoneNumber = ' + mysql.escape(phoneNumber) +
                                ', password = ' + mysql.escape(password) +
                                ' WHERE id = ' + mysql.escape(id), (err) => {
            if (err) throw err;
            conn.query('SELECT * FROM users WHERE id = ' + mysql.escape(id), (err, result) => {
                if (err) throw err;
                infoUpdateResult(result[0]);
            });
        });
    }
    admin_UpdateAccountInfo(id, memberLevel, points, notes, adminInfoUpdateResult) {
        
        conn.query('Update users SET memberLevel = ' + mysql.escape(memberLevel) +
                                ', points = ' + mysql.escape(points) +
                                ', notes = ' + mysql.escape(notes) +
                                ' WHERE id = ' + mysql.escape(id), (err) => {
            if (err) throw err;
            conn.query('SELECT * FROM users WHERE id = ' + mysql.escape(id), (err, result) => {
                if (err) throw err;
                adminInfoUpdateResult(result[0]);
            });
        });
    }
    /*////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    */////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////           Location Methods         /////////////////////////////////////
    */////////////////////////////////////////////////////////////////////////////////////////////////////////
    getLocations(fetchedLocations) {
        conn.query('SELECT * FROM locations', (err, result) => {
            if (err) throw err;
            fetchedLocations(result);
        });
    }
    //Admin Methods
    admin_CreateLocation(user_username, user_password, name, cost, type, color, call_back) {
        this.admin_CheckAdminPrivilege(user_username, user_password, fetchedUser => {
            if (fetchedUser == '404')
                return call_back('404');
            this.getLocations(locations => {
                for (var i = 0; i < locations.length; i++) {
                    if (locations[i].name == name)
                        return call_back('406');
                }
                conn.query("INSERT INTO locations (name, cost, type, color) VALUES ('"+name+"', '"+cost+"', '"+type+"', '"+color+"')", (err) => {
                    if (err) throw err;
                    return call_back('100');
                });
            });
        });
    }

    admin_UpdateLocation(user_username, user_password, id, previousName, name, cost, type, color, call_back) {
        this.admin_CheckAdminPrivilege(user_username, user_password, fetchedUser => {
            if (fetchedUser == '404')
                return call_back('404');
            // eslint-disable-next-line
            this.admin_UpdateLocationName(id, previousName, name, nameUpdateResult => {
                this.admin_UpdateLocationInfo(id, cost, type, color, infoUpdateResult => {
                    return call_back(infoUpdateResult);
                });                    
            });
        });
    }
    admin_UpdateLocationName(id, previousName, name, nameUpdateResult) {
        if (previousName != name) {
            this.getLocations(locations => {
                for (var i = 0; i < locations.length; i++) {
                    if (locations[i].name == name)
                        return nameUpdateResult('406');
                }
                conn.query('Update locations SET name = ' + mysql.escape(name) + ' WHERE id = ' + mysql.escape(id), (err) => {
                    if (err) throw err;
                    return nameUpdateResult('100');
                });
            });
        }
        else
            return nameUpdateResult('100');
    }
    admin_UpdateLocationInfo(id, cost, type, color, infoUpdateResult) {
        conn.query('Update locations SET cost = ' + mysql.escape(cost) +
                                        ', type = ' + mysql.escape(type) +
                                        ', color = ' + mysql.escape(color) +
                                        ' WHERE id = ' + mysql.escape(id), (err) => {
            if (err) throw err;
            conn.query('SELECT * FROM locations WHERE id = ' + mysql.escape(id), (err, result) => {
                if (err) throw err;
                infoUpdateResult(result[0]);
            });
        });
    }

    admin_RemoveLocation(user_username, user_password, id, call_back) {
        this.admin_CheckAdminPrivilege(user_username, user_password, fetchedUser => {
            if (fetchedUser == '404')
                return call_back('404');
            conn.query('DELETE FROM locations WHERE id = ' + mysql.escape(id), (err) => {
                if (err) throw err;
                return call_back('100');
            });
        });
    }
    /*////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    */////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////          Resource Methods          /////////////////////////////////////
    */////////////////////////////////////////////////////////////////////////////////////////////////////////
    getResources(fetchedResources) {
        conn.query('SELECT * FROM resources', (err, result) => {
            if (err) throw err;
            fetchedResources(result);
        });
    }

    admin_CreateResource(user_username, user_password, name, cost, quantity, call_back) {
        this.admin_CheckAdminPrivilege(user_username, user_password, fetchedUser => {
            if (fetchedUser == '404')
                return call_back('404');
            this.getResources(resources => {
                for (var i = 0; i < resources.length; i++) {
                    if (resources[i].name == name)
                        return call_back('408');
                }
                //Create resource
                conn.query("INSERT INTO resources (name, cost, quantity) VALUES ('"+name+"', '"+cost+"', '"+quantity+"')", (err) => {
                    if (err) throw err;
                    return call_back('100');
                });
            });
        });
    }

    admin_UpdateResource(user_username, user_password, id, previousName, name, cost, quantity, call_back) {
        this.admin_CheckAdminPrivilege(user_username, user_password, fetchedUser => {
            if (fetchedUser == '404')
                return call_back('404');
            // eslint-disable-next-line
            this.admin_UpdateResourceName(id, previousName, name, nameUpdateResult => {
                this.admin_UpdateResourceInfo(id, cost, quantity, infoUpdateResult => {
                    return call_back(infoUpdateResult);
                });                  
            });
        });
    }
    admin_UpdateResourceName(id, previousName, name, nameUpdateResult) {
        if (previousName != name) {
            this.getResources(resources => {
                for (var i = 0; i < resources.length; i++) {
                    if (resources[i].name == name)
                        return nameUpdateResult('406');
                }
                conn.query('Update resources SET name = ' + mysql.escape(name) + ' WHERE id = ' + mysql.escape(id), (err) => {
                    if (err) throw err;
                    return nameUpdateResult('100');
                });
            });
        }
        else
            return nameUpdateResult('100');
    }
    admin_UpdateResourceInfo(id, cost, quantity, infoUpdateResult) {
        conn.query('Update resources SET cost = ' + mysql.escape(cost) +
                                        ', quantity = ' + mysql.escape(quantity) +
                                        ' WHERE id = ' + mysql.escape(id), (err) => {
            if (err) throw err;
            conn.query('SELECT * FROM resources WHERE id = ' + mysql.escape(id), (err, result) => {
                if (err) throw err;
                infoUpdateResult(result[0]);
            });
        });
    }

    admin_RemoveResource(user_username, user_password, id, call_back) {
        this.admin_CheckAdminPrivilege(user_username, user_password, fetchedUser => {
            if (fetchedUser == '404')
                return call_back('404');
            conn.query('DELETE FROM resources WHERE id = ' + mysql.escape(id), (err) => {
                if (err) throw err;
                return call_back('100');
            });
        });
    }
    /*////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    */////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////           Booking Methods          /////////////////////////////////////
    */////////////////////////////////////////////////////////////////////////////////////////////////////////
    getBookingsDate(username, password, startDate, endDate, call_back) {
        this.getAccount(username, password, fetchedUser => {
            if (fetchedUser == '404' || fetchedUser.memberLevel < MIN_MEMBER_PRIVILEGE)
                return call_back('404');
            
            conn.query('SELECT * FROM bookings WHERE date >= ' + mysql.escape(startDate) + ' and  date <= ' + mysql.escape(endDate), (err, result) => {
                if (err) throw err;
                var bookings = result;
                conn.query('SELECT * FROM users', (err, result) => {
                    if (err) throw err;
                    var users = result;
                    for (var i = 0; i < bookings.length; i++) {
                        if (fetchedUser.id != bookings[i].userID && bookings[i].private)
                            bookings[i].username = 'Private Booking';
                        else {
                            for (var j = 0; j < users.length; j++) {
                                if (bookings[i].userID == users[j].id) {
                                    bookings[i].username = users[j].username;
                                    break;
                                }
                            }
                        }
                    }
                    return call_back(bookings);
                });
            });
        });
    }
    insertBooking(username, password, locationID, resourceID, date, startTime, endTime, meetingType, title, description, noiseLevel, privacy, call_back) {
        this.getAccount(username, password, fetchedUser => {
            if (fetchedUser == '404' || fetchedUser.memberLevel < MIN_MEMBER_PRIVILEGE)
                return call_back(['404', null]);

            var insertStartTime = new Date();
            insertStartTime.setHours(parseInt(startTime.split(":")[0]), parseInt(startTime.split(":")[1]), 0, 0);
            var insertEndTime = new Date();
            insertEndTime.setHours(parseInt(endTime.split(":")[0]), parseInt(endTime.split(":")[1]), 0, 0);

            var error = this.checkTimeFormating(startTime, endTime, insertStartTime, insertEndTime);
            if (error == '405' || error == '406' || error == '407')
                return call_back([error, null]);

            //Check For Booking Overlaps
            this.checkForOverlap(null, insertStartTime, insertEndTime, date, locationID, noiseLevel, checkCallBack => {
                if (checkCallBack[0] == '408' || checkCallBack[0] == '409' || checkCallBack[0] == '410')
                    return call_back(checkCallBack);

                //Insert Bookings If No Overlaps
                for (var i = 0; i < date.length; i++) {
                    var sql = "INSERT INTO bookings (userID, locationID, resourceID, date, startTime, endTime, meetingType, title, description, noiseLevel, private)"+
                    "VALUES ('"+fetchedUser.id+"', '"+locationID+"', '"+resourceID+"', '"+date[i]+"', '"+startTime+"', '"+endTime+"', '"+meetingType+"', '"+title+"', '"+description+"', '"+noiseLevel+"', '"+privacy+"')";
                    conn.query(sql, function(err, result) {
                        if (err) throw err;
                    });
                }
                return call_back(['100', null]);
            });
        });
    }
    updateBooking(username, password, bookingID, userID, locationID, resourceID, date, startTime, endTime, meetingType, title, description, noiseLevel, privacy, call_back) {
        this.getAccount(username, password, fetchedUser => {
            if (fetchedUser == '404' || fetchedUser.memberLevel < MIN_MEMBER_PRIVILEGE)
                return call_back(['404', null]);

            //Ensure Creator or Admin is Editing
            this.checkForCapability(bookingID, fetchedUser.id, fetchedUser.memberLevel, capabilityResult => {
                if (capabilityResult == '404')
                    call_back(['404', null]);
            
                var insertStartTime = new Date();
                insertStartTime.setHours(parseInt(startTime.split(":")[0]), parseInt(startTime.split(":")[1]), 0, 0);
                var insertEndTime = new Date();
                insertEndTime.setHours(parseInt(endTime.split(":")[0]), parseInt(endTime.split(":")[1]), 0, 0);

                var error = this.checkTimeFormating(startTime, endTime, insertStartTime, insertEndTime);
                if (error == '405' || error == '406' || error == '407')
                    return call_back([error, null]);

                //Check For Booking Overlaps
                this.checkForOverlap(bookingID, insertStartTime, insertEndTime, date, locationID, noiseLevel, checkCallBack => {
                    if (checkCallBack[0] == '408' || checkCallBack[0] == '409' || checkCallBack[0] == '410')
                        return call_back(checkCallBack);

                    conn.query('Update bookings SET userID = ' + mysql.escape(userID) +
                                    ', locationID = ' + mysql.escape(locationID) +
                                    ', resourceID = ' + mysql.escape(resourceID) +
                                    ', date = ' + mysql.escape(date) +
                                    ', startTime = ' + mysql.escape(startTime) +
                                    ', endTime = ' + mysql.escape(endTime) +
                                    ', meetingType = ' + mysql.escape(meetingType) +
                                    ', title = ' + mysql.escape(title) +
                                    ', description = ' + mysql.escape(description) +
                                    ', noiseLevel = ' + mysql.escape(noiseLevel) +
                                    ', private = ' + mysql.escape(privacy) +
                                    ' WHERE id = ' + mysql.escape(bookingID), (err) => {
                        if (err) throw err;
                            return call_back(['100', null]);
                    });
                });
            });
        });
    }
    checkForCapability(bookingID, userID, memberLevel, capabilityResult) {
        if (memberLevel == ADMIN_PRIVILEGE)
            return capabilityResult('100');
        conn.query('SELECT * FROM bookings WHERE id = ' + mysql.escape(bookingID), (err, result) => {
            if (result.userID != userID)
                return capabilityResult('404');
            return capabilityResult('100');
        });
    }
    checkTimeFormating(startTime, endTime, insertStartTime, insertEndTime) {
        //Booking time must be between 7AM and 10PM (used to be dates with set hours)
        if (insertStartTime.getHours() < 7 || insertEndTime.getHours() > 22)
            return '405';
        //endTime must be larger than startTime
        if (insertStartTime > insertEndTime)
            return '406';
        //Booking time not in a multiple of 5
        if (parseInt(startTime.split(":")[1]) % 5 != 0 || parseInt(endTime.split(":")[1]) % 5 != 0)
            return '407';
    }
    checkForOverlap(bookingID, insertStartTime, insertEndTime, date, locationID, noiseLevel, checkCallBack) {
        var j = 0;
        for (var i = 0; i < date.length; i++) {
            conn.query('SELECT * FROM bookings WHERE date = ' + mysql.escape(date[i]), (err, result) => {
                if (err) throw err;

                for (var index = 0; index < result.length; index++) {
                    if (bookingID == result[index].id)
                        continue;

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
                        if (result[index].locationID == locationID)
                            return checkCallBack(['408', date[j]]);
                        else if (result[index].noiseLevel == -1 && noiseLevel == 1)
                            return checkCallBack(['409', date[j]]);
                        else if (result[index].noiseLevel == 1 && noiseLevel == -1)
                            return checkCallBack(['410', date[j]]);
                    }
                }

                j++;
                if (i == j)
                    return checkCallBack('100');
            });
        }
    }

    removeBooking(username, password, bookingID, userID, date, startTime, call_back) {
        this.getAccount(username, password, fetchedUser => {
            if (fetchedUser == '404' || fetchedUser.memberLevel < MIN_MEMBER_PRIVILEGE)
                return call_back('404');
            
            var bookingDate = new Date(date);
            bookingDate.setHours(startTime.split(':')[0], startTime.split(':')[1]);
            if (fetchedUser.memberLevel == ADMIN_PRIVILEGE || (userID == fetchedUser.id && (bookingDate - new Date()) / (1000*60*60) > 22)) {
                conn.query('DELETE FROM bookings WHERE id = ' + mysql.escape(bookingID), (err) => {
                    if (err) throw err;
                    return call_back('100');
                });
            }
        });
    }
    /*////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    */////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////           Admin Methods          //////////////////////////////////////
    */////////////////////////////////////////////////////////////////////////////////////////////////////////
    admin_CheckAdminPrivilege(user_username, user_password, call_back) {
        this.getAccount(user_username, user_password, fetchedUser => {
            if (fetchedUser == '404' || fetchedUser.memberLevel != ADMIN_PRIVILEGE)
                return call_back('404');
            else
                return call_back(fetchedUser);
        });
    }

    admin_GetData(user_username, user_password, call_back) {
        this.admin_CheckAdminPrivilege(user_username, user_password, fetchedUser => {
            if (fetchedUser == '404')
                return call_back('404');
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

    admin_RunReport(user_username, user_password, users, locations, resources, startDate, endDate, call_back) {
        this.admin_CheckAdminPrivilege(user_username, user_password, fetchedUser => {
            if (fetchedUser == '404') 
                return call_back('404');
            
            this.getBookingsDate(user_username, user_password, startDate, endDate, bookings => {
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
    /*////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    */////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
    getCalendarData(call_back) {
        this.getLocations(fetchedLocations => {
            this.getResources(fetchedResources => {
                return call_back([fetchedLocations, fetchedResources]);
            });
        });
    }

}

module.exports = Model;