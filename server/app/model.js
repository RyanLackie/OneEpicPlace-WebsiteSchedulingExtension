//Required Modules
const mysql = require('mysql');

class Model {
    constructor() {
        //Date for calender
        this.date = new Date();

        //rooms include: id, name, type, style
        this.rooms = [
            {id: 0, name: '',                               type: 'room', style: ''},
            {id: 1, name: 'DaVinci Room',                   type: 'room', style: ''},
            {id: 2, name: 'Green Room',                     type: 'room', style: ''},
            {id: 3, name: 'Sunshine Room',                  type: 'room', style: ''},
            {id: 4, name: 'Zen Room',                       type: 'room', style: ''},
            {id: 5, name: 'Studio',                         type: 'room', style: ''},
            {id: 6, name: 'EPIC Room',                      type: 'room', style: ''},
            {id: 7, name: 'Carriage House Treatment Room',  type: 'room', style: ''},
            {id: 8, name: 'Buissness Hub',                  type: 'room', style: ''},
            {id: 9, name: 'Loft',                           type: 'room', style: ''},
            {id: 10, name: 'Porch',                         type: 'room', style: ''},
            {id: 11, name: 'Lawn',                          type: 'room', style: ''},

            {id: 12, name: 'Hot Desk', type: 'desk', style: ''},
            {id: 13, name: 'Hot Desk', type: 'desk', style: ''},
            {id: 14, name: 'Hot Desk', type: 'desk', style: ''},
            {id: 15, name: 'Hot Desk', type: 'desk', style: ''},
            {id: 16, name: 'Hot Desk', type: 'desk', style: ''},
            {id: 17, name: 'Hot Desk', type: 'desk', style: ''},
            {id: 18, name: 'Hot Desk', type: 'desk', style: ''},
            {id: 19, name: 'Hot Desk', type: 'desk', style: ''},
            {id: 20, name: 'Hot Desk', type: 'desk', style: ''},
            {id: 21, name: 'Hot Desk', type: 'desk', style: ''},
            {id: 22, name: 'Hot Desk', type: 'desk', style: ''},
            {id: 23, name: 'Hot Desk', type: 'desk', style: ''},
            {id: 24, name: 'Hot Desk', type: 'desk', style: ''},
            {id: 25, name: 'Hot Desk', type: 'desk', style: ''},
            {id: 26, name: 'Hot Desk', type: 'desk', style: ''}
        ];

        //hour include: id, time
        this.hours = [
            {id: 0, time: '7AM'},
            {id: 1, time: '8AM'},
            {id: 2, time: '9AM'},
            {id: 3, time: '10AM'},
            {id: 4, time: '11AM'},
            {id: 5, time: '12PM'},
            {id: 6, time: '1PM'},
            {id: 7, time: '2PM'},
            {id: 8, time: '3PM'},
            {id: 9, time: '4PM'},
            {id: 10, time: '5PM'},
            {id: 11, time: '6PM'},
            {id: 12, time: '7PM'},
            {id: 13, time: '8PM'},
            {id: 14, time: '9PM'}
        ];
    }

    /*////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////             Get Data          //////////////////////////////////////////
    */////////////////////////////////////////////////////////////////////////////////////////////////////////
    getDate() {
        return this.date;
    }

    getRooms() {
        return this.rooms;
    }

    getHours() {
        return this.hours;
    }


    /*////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////            Connection         //////////////////////////////////////////
    */////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    insertBooking(email, password, firstName, lastName, date, locationID, title, description, startTime, endTime, bookingColor, noiseLevel, call_back) {
        // eslint-disable-next-line
        console.log("#################insertBooking()#################");

        //Check if user is valid
        this.checkUser(email, password, userCheck => {
            if (userCheck != 'true')
                call_back('403');
            else {
                //Booking time must be between 7AM and 10PM and endTime must be larger than startTime
                var insertStartTime = new Date();
                insertStartTime.setHours(parseInt(startTime.split(":")[0]), parseInt(startTime.split(":")[1]), 0, 0);

                var insertEndTime = new Date();
                insertEndTime.setHours(parseInt(endTime.split(":")[0]), parseInt(endTime.split(":")[1]), 0, 0);

                var minTime = new Date();
                minTime.setHours(7, 0, 0, 0);

                var maxTime = new Date();
                maxTime.setHours(22, 0, 0, 0);

                //Booking time must be between 7AM and 10PM
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
                                
                                result = result.filter(function(value) {
                                    return value.locationID == locationID;
                                });
                                
                                var pass = true;
                                for (var index2 = 0; index2 < result.length; index2++) {
                                    var checkStartTime = new Date();
                                    checkStartTime.setHours(result[index2].startTime.split(":")[0], result[index2].startTime.split(":")[1], 0, 0)
                                    
                                    var checkEndTime = new Date();
                                    checkEndTime.setHours(result[index2].endTime.split(":")[0], result[index2].endTime.split(":")[1], 0, 0);
                                    
                                    //getTime() is used so that there is real numarical data to compair
                                    var check1 = checkStartTime.getTime() < insertStartTime.getTime() && checkEndTime.getTime() > insertStartTime.getTime();
                                    var check2 = insertStartTime.getTime() < checkEndTime.getTime() && insertEndTime.getTime() > checkEndTime.getTime();
                                    var check3 = insertStartTime.getTime() < checkStartTime.getTime() && insertEndTime.getTime() > checkStartTime.getTime();
                                    var check4 = checkStartTime.getTime() < insertEndTime.getTime() && checkEndTime.getTime() > insertEndTime.getTime();
                                    var check5 = checkStartTime.getTime() == insertStartTime.getTime() && checkEndTime.getTime() < insertEndTime.getTime();
                                    var check6 = checkStartTime.getTime() == insertStartTime.getTime() && insertEndTime.getTime() < checkEndTime.getTime();
                                    var check7 = checkStartTime.getTime() < insertStartTime.getTime() && checkEndTime.getTime() == insertEndTime.getTime();
                                    var check8 = insertStartTime.getTime() < checkStartTime.getTime() && checkEndTime.getTime() == insertEndTime.getTime();
                                    var check9 = insertStartTime.getTime() == checkStartTime.getTime() && checkEndTime.getTime() == insertEndTime.getTime();
                                    
                                    //console.log(check1 + " + " + check2 + " + " + check3 + " + " + check4 + " + " + check5 + " + " + check6 + " + " + check7 + " + " + check8 + " + " + check9);
                                    if (check1 || check2 || check3 || check4 || check5 || check6 || check7 || check8 || check9)
                                        pass = false;
                                }
                                if (!pass) {
                                    call_back('407');
                                    conn.end();
                                }
                                else {
                                    //Insert booking
                                    var sql = "INSERT INTO booking (email, firstName, lastName, date, locationID, title, description, startTime, endTime, bookingColor, noiseLevel) VALUES ('"+email+"' ,'"+firstName+"', '"+lastName+"', '"+date+"', '"+locationID+"', '"+title+"', '"+description+"', '"+startTime+"', '"+endTime+"', '"+bookingColor+"', '"+noiseLevel+"')";
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
    getBookingsDay(date, call_back) {
        // eslint-disable-next-line
        console.log("#################getBookingsDay()#################");

        //Connect to database
        var conn = this.getConnection();

        //Get bookings
        conn.query('SELECT * FROM booking WHERE date = ' + mysql.escape(date), (err, result) => {
            if (err) throw err;
            console.log(result.length + " Bookings found");
            call_back(result);
        });

        conn.end();
    }
    getBookingsRange(startDate, endDate, call_back) {
        // eslint-disable-next-line
        console.log("#################getBookingsRange()#################");

        //Connect to database
        var conn = this.getConnection();
        
        //Get bookings
        conn.query('SELECT * FROM booking WHERE date >= ' + mysql.escape(startDate) + ' and  date <= ' + mysql.escape(endDate), (err, result) => {
            if (err) throw err;
            console.log(result.length + " Bookings found");
            call_back(result);
        });

        conn.end();
    }

}

module.exports = Model;