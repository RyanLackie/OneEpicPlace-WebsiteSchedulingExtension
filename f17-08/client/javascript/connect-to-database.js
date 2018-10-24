var mysql = require('mysql');

function connectToDatabase() {
    //Starting message
    console.log('Connection has started');

    //SQL Connection Requirments
    var conn = mysql.createConnection({
        //CHANGE FOR EACH DATABASE BEING USED!!!
        host: "localhost",
        user: "root",
        database: "web_programing_database",
        password: ""
    });

    //Connection Test
    conn.connect((err) => {
        if (err) {
            //Databse connection failure message
            console.log('Database connection failed \n Error: ' + JSON.stringify(err, undefined, 2));
        }
        else {
            //Databse connection success message
            console.log('Database connection successful');
        }
    });

    //Ending message
    console.log('Insertion has ended');

    //Recturn conn
    return conn;
}
