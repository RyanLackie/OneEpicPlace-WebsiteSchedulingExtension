//Required Modules
const mysql = require('mysql');

class Model {
    constructor() {
        
    }

    getConnection() {
        var conn = mysql.createConnection({
            //Laptop Environment
            host: '206.189.167.65',
            port: '3306',
            user: 'outsideConnection',
            database: 'OEP',
            password: 'adminACC-EPIC-79282'
        });
        
        conn.connect();
        return conn;
    }

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////          User Methods         //////////////////////////////////////////
    */////////////////////////////////////////////////////////////////////////////////////////////////////////
    signUpUser(email, password, firstName, lastName, occupation, description, call_back) {
        // eslint-disable-next-line
        console.log("#################signUpUser()#################");

        //Connect to database
        var conn = this.getConnection();

        //Check if email is already in use
        conn.query('SELECT * FROM users WHERE email = ' + mysql.escape(email), (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                // eslint-disable-next-line
                console.log("Email is taken: " + result[0].email);
                call_back('409');
            }
            //Sign up user
            else {
                //conn.query('INSERT INTO users (email, password, firstName, lastName, occupation, description) VALUES ('+email+', '+password+', '+firstName+', '+lastName+', '+occupation+', '+description+')'), (err, result);
                var sql = "INSERT INTO users (email, password, firstName, lastName, occupation, description) VALUES ('"+email+"', '"+password+"', '"+firstName+"', '"+lastName+"', '"+occupation+"', '"+description+"')";
                conn.query(sql, function(err, result) {
                    if (err) throw err;
                    // eslint-disable-next-line
                    console.log("User inserted: " + result.insertId);

                    //Get data for passing back to user
                    conn.query('SELECT * FROM users WHERE id = ' + mysql.escape(result.insertId), (err, result) => {
                        if (err) throw err;
                        call_back(result[0]);
                    });
                });
            }
        });

        conn.end();
    }

    loginUser(email, password, call_back) {
        // eslint-disable-next-line
        console.log("#################loginUser()#################");

        //Connect to database
        var conn = this.getConnection();

        //Find user by email
        conn.query('SELECT * FROM users WHERE email = ' + mysql.escape(email), (err, result) => {
            if (err) throw err;
            if (result.length >= 2) {
                // eslint-disable-next-line
                console.log("Two of the same emails exist: " + result[0].email);
            }

            if (result.length == 0) {
                // eslint-disable-next-line
                console.log("Email does not exist");
                call_back('409');
            }
            else if (result.length == 1) {
                if (password == result[0].password) {
                    // eslint-disable-next-line
                    console.log(result[0].email + " has logged in");
                    call_back(result[0]);
                }
                else {
                    // eslint-disable-next-line
                    console.log("Incorect password for: " + result[0].email);
                    call_back('409');
                }
            }
        });

        conn.end();
    }

    checkUser(email, password, call_back) {
        // eslint-disable-next-line
        console.log("#################checkUser()#################");

        //Connect to database
        var conn = this.getConnection();

        if (email == null || password == null) {
            // eslint-disable-next-line
            console.log("Null user login information");
            call_back('408');
        }
        
        else {
            //Find user by email
            conn.query('SELECT * FROM users WHERE email = ' + mysql.escape(email), (err, result) => {
                if (err) throw err;
                if (result.length >= 2) {
                    // eslint-disable-next-line
                    console.log("Two of the same emails exist: " + result[0].email);
                }

                if (result.length == 0) {
                    // eslint-disable-next-line
                    console.log("User check failed: incorrect email");
                    call_back('409');
                }
                else if (result.length == 1) {
                    if (password == result[0].password) {
                        // eslint-disable-next-line
                        console.log("User check passed for: " + result[0].email);
                        call_back('true');
                    }
                    else {
                        // eslint-disable-next-line
                        console.log("User check failed for: " + result[0].email + " incorrect password");
                        call_back('409');
                    }
                }
            });
        }

        conn.end();
    }
    
    updateProfile(oldEmail, oldPassword, newEmail, newPassword, firstName, lastName, occupation, description, call_back) {
        // eslint-disable-next-line
        console.log("#################updateProfile()#################");

        if (oldEmail == null || oldPassword == null)
            call_back('408');
        
        else {
            //Connect to database
            var conn = this.getConnection();

            //Find user by email
            conn.query('SELECT * FROM users WHERE email = ' + mysql.escape(oldEmail), (err, result) => {
                if (err) throw err;
                if (result.length >= 2) {
                    // eslint-disable-next-line
                    console.log("Two of the same emails exist: " + result[0].email);
                }

                if (result.length == 0) {
                    // eslint-disable-next-line
                    console.log("User check failed: incorrect email");
                }
                else if (result.length == 1) {
                    if (oldPassword == result[0].password) {
                        // eslint-disable-next-line
                        console.log("User check passed for: " + result[0].email);
                        //Handle profile changes
                        var id = result[0].id;
                        console.log(id);
                        conn.query('SELECT * FROM users WHERE email = ' + mysql.escape(newEmail), (err, result) => {
                            if (err) throw err;
                            
                            if ((result.length == 0) || (result.length == 1 && result[0].id == id)) {
                                // eslint-disable-next-line
                                console.log("Email is usable (unused or not changed): " + newEmail);
                                conn.query('Update users SET email = ' + mysql.escape(newEmail) + 
                                            ', password = ' + mysql.escape(newPassword) +
                                            ', firstName = ' + mysql.escape(firstName) +
                                            ', lastName = ' + mysql.escape(lastName) +
                                            ', occupation = ' + mysql.escape(occupation) +
                                            ', description = ' + mysql.escape(description) +
                                            ' WHERE id = ' + mysql.escape(id), (err) => {
                                    if (err) throw err;
                                    // eslint-disable-next-line
                                    console.log("User changed at id: " + id);

                                    //Get new profile info
                                    conn.query('SELECT * FROM users WHERE id = ' + mysql.escape(id), (err, result) => {
                                        if (err) throw err;
                                        call_back(result[0]);
                                    });
                                });
                            }
                            else {
                                // eslint-disable-next-line
                                console.log("Email already exists: " + newEmail);
                                call_back('410');
                            }
                        });
                    }
                    else {
                        // eslint-disable-next-line
                        console.log("User check failed for: " + result[0].email + " incorrect password");
                        call_back('409');
                    }
                }
            });
        }
    }

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////           Booking Methods          /////////////////////////////////////
    */////////////////////////////////////////////////////////////////////////////////////////////////////////
    insertBooking(email, password, firstName, lastName, date, locationID, locationType, title, description, startTime, endTime, bookingColor, noiseLevel, call_back) {
        // eslint-disable-next-line
        console.log("#################insertBooking()#################");

        //Check if user is valid
        this.checkUser(email, password, userCheck => {
            if (userCheck != 'true')
                call_back('403');
            else {
                //Booking time must be between 7AM and 10PM and endTime must be larger than startTime
                var insertStartTime = new Date();
                insertStartTime.setHours(parseInt(startTime.split(":")[0]));
                insertStartTime.setMinutes(parseInt(startTime.split(":")[1]));
                insertStartTime.setSeconds(0);

                var insertEndTime = new Date();
                insertEndTime.setHours(parseInt(endTime.split(":")[0]));
                insertEndTime.setMinutes(parseInt(endTime.split(":")[1]));
                insertEndTime.setSeconds(0);

                var minTime = new Date();
                minTime.setHours(7);
                minTime.setMinutes(0);
                minTime.setMinutes(0);
                minTime.setSeconds(0);

                var maxTime = new Date();
                maxTime.setHours(22);
                maxTime.setMinutes(0);
                maxTime.setMinutes(0);
                maxTime.setSeconds(0);

                //Booking time must be between 7AM and 10PM
                console.log(insertStartTime<minTime);
                console.log(insertEndTime > maxTime);
                if (insertStartTime < minTime || insertEndTime > maxTime)
                    call_back('404');
                else {
                    //endTime must be larger than startTime
                    if (insertStartTime > insertEndTime)
                        call_back('405')
                    else {
                        //Booking time not in a multiple of 5
                        if (parseInt(startTime.split(":")[1]) % 5 != 0 || parseInt(endTime.split(":")[1]) % 5 != 0)
                            call_back('406')
                        else {
                            //Connect to database
                            var conn = this.getConnection();
                            //Booking overlap
                            conn.query('SELECT * FROM booking WHERE date = ' + mysql.escape(date), (err, result) => {
                                if (err) throw err;

                                for (var index1 = 0; index1 < result.length; index1++) {
                                    if (result[index1].locationID != locationID)
                                        result.splice(index1, 1);
                                }
                                
                                var pass = true;
                                for (var index2 = 0; index2 < result.length; index2++) {
                                    var checkStartTime = new Date();
                                    checkStartTime.setHours(result[index2].startTime.split(":")[0]);
                                    checkStartTime.setMinutes(result[index2].startTime.split(":")[1]);
                                    checkStartTime.setSeconds(0);

                                    var checkEndTime = new Date();
                                    checkEndTime.setHours(result[index2].endTime.split(":")[0]);
                                    checkEndTime.setMinutes(result[index2].endTime.split(":")[1]);
                                    checkEndTime.setSeconds(0);
                                    
                                    var checkOne = insertStartTime > checkStartTime && insertStartTime < checkEndTime;
                                    var checkTwo = insertEndTime > checkStartTime && insertEndTime < checkEndTime;
                                    var checkThree = checkStartTime > insertStartTime && checkEndTime < insertStartTime;
                                    var checkFour = checkStartTime > insertEndTime && checkEndTime < insertEndTime;
                                    console.log(checkStartTime + " > " + insertStartTime + " && " + checkEndTime + " < " + insertStartTime);
                                    console.log(checkOne + " + " + checkTwo + " + " + checkThree + " + " + checkFour);
                                    if (checkOne || checkTwo || checkThree || checkFour)
                                        pass = false;
                                }
                                if (!pass) {
                                    call_back('407');
                                    conn.end();
                                }
                                else {
                                    //Insert booking
                                    var sql = "INSERT INTO booking (email, firstName, lastName, date, locationID, locationType, title, description, startTime, endTime, bookingColor, noiseLevel) VALUES ('"+email+"' ,'"+firstName+"', '"+lastName+"', '"+date+"', '"+locationID+"', '"+locationType+"', '"+title+"', '"+description+"', '"+startTime+"', '"+endTime+"', '"+bookingColor+"', '"+noiseLevel+"')";
                                    conn.query(sql, function(err, result) {
                                        if (err) throw err;
                                        // eslint-disable-next-line
                                        console.log("Booking " + result.insertId + " inserted: " + locationID + " at " + startTime + " to " + endTime);
                                        
                                        call_back(true);
                                    });
                                    conn.end();
                                }
                            });
                        }
                    }
                }
            }
        });    
    }
    getBookings(date, call_back) {
        // eslint-disable-next-line
        console.log("#################getBooking()#################");

        //Connect to database
        var conn = this.getConnection();

        //Get booking
        conn.query('SELECT * FROM booking WHERE date = ' + mysql.escape(date), (err, result) => {
            if (err) throw err;
            console.log(result.length + " Bookings found");
            call_back(result);
        });

        conn.end();
    }

}

module.exports = Model;