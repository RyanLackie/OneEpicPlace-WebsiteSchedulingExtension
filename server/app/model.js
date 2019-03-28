//Required Modules
const mysql = require('mysql');
var conn = mysql.createPool({
    host: '206.189.167.65',
    port: '3306',

    database: 'OEP',
    user: 'outsideConnection',
    password: 'adminACC-EPIC-79282',

    connectionLimit: 30
});

class Model {
    constructor() {}

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////          User Methods         //////////////////////////////////////////
    */////////////////////////////////////////////////////////////////////////////////////////////////////////
    checkForEmail(email, emailCheckResponse) {
        conn.query('SELECT * FROM users WHERE email = ' + mysql.escape(email), (err, result) => {
            if (err) throw err;
            if (result.length == 1)
                return emailCheckResponse(result[0]);
            else
                return emailCheckResponse('409');           
        });
    }
    checkForUsername(username, usernameCheckResponse) {
        conn.query('SELECT * FROM users WHERE username = ' + mysql.escape(username), (err, result) => {
            if (err) throw err;
            if (result.length == 1)
                return usernameCheckResponse(result[0]);
            else
                return usernameCheckResponse('409');
        });
    }
    insertUser(email, username, password, firstName, lastName, occupation, description, insertUserResponce) {
        conn.query("INSERT INTO users (privilege, email, username, password, firstName, lastName, occupation, description) VALUES ('"+1+"', '"+email+"', '"+username+"', '"+password+"', '"+firstName+"', '"+lastName+"', '"+occupation+"', '"+description+"')", (err, result) => {
            if (err) throw err;
            conn.query('SELECT * FROM users WHERE id = ' + mysql.escape(result.insertId), (err, result) => {
                if (err) throw err;
                return insertUserResponce(result[0]);
            });
        });
    }

    createAccount(email, username, password, firstName, lastName, occupation, description, call_back) {
        console.log('#################createAccount()#################');

        //Find user by email
         this.checkForEmail(email, emailCheckResponse => {
            if (emailCheckResponse != '409') {
                console.log(email + ' is taken');
                return call_back('409');
            }

            //Find user by username
            this.checkForUsername(username, usernameCheckResponse => {
                if (usernameCheckResponse != '409') {
                    console.log(username + ' is taken');
                    return call_back('410');
                }
                
                this.insertUser(email, username, password, firstName, lastName, occupation, description, insertUserResponce => {
                    console.log(insertUserResponce.username + ' account has been created');
                    return call_back(insertUserResponce);
                });
            });
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
            this.checkForEmail(conn, newEmail, emailCheckResponse => {
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
            this.checkForUsername(conn, newUsername, usernameCheckResponse => {
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

    insertBooking(date, userID, username, password, locationID, locationName, title, description, startTime, endTime, bookingColor, noiseLevel, call_back) {
        console.log("#################insertBooking()#################");

        //Check if user is valid
        this.getAccount(username, password, fetchedUser => {
            if (fetchedUser == '409')
                return call_back('403');

            if (fetchedUser.privilege < 1)
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
                
                for (var index2 = 0; index2 < result.length; index2++) {
                    var checkStartTime = new Date();
                    checkStartTime.setHours(result[index2].startTime.split(":")[0], result[index2].startTime.split(":")[1], 0, 0)
                    
                    var checkEndTime = new Date();
                    checkEndTime.setHours(result[index2].endTime.split(":")[0], result[index2].endTime.split(":")[1], 0, 0);
                    
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
                var sql = "INSERT INTO bookings (date, userID, username, locationID, locationName, title, description, startTime, endTime, bookingColor, noiseLevel) VALUES ('"+date+"', '"+userID+"', '"+username+"', '"+locationID+"', '"+locationName+"', '"+title+"', '"+description+"', '"+startTime+"', '"+endTime+"', '"+bookingColor+"', '"+noiseLevel+"')";
                conn.query(sql, function(err, result) {
                    if (err) throw err;
                    console.log("Booking " + result.insertId + " inserted: " + locationName + " at " + startTime + " to " + endTime);
                    return call_back('100');
                });            
            });
        });    
    }
    getBookingsDate(startDate, endDate, call_back) {
        console.log("#################getBookingsDate()#################");

        //Get bookings
        conn.query('SELECT * FROM bookings WHERE date >= ' + mysql.escape(startDate) + ' and  date <= ' + mysql.escape(endDate), (err, result) => {
            if (err) throw err;
            console.log(result.length + " Bookings found");
            return call_back(result);
        });
    }

}

module.exports = Model;