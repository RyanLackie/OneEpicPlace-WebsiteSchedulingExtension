function insertUserIntoTable(conn, email, password, username, firstName, lastName, occupation, description) {
    //Starting message
    console.log('Insertion has started');

    //SQL Injection
    conn.connect((err) => {
        if (err) {
            //Databse connection failure message
            console.log('Database connection failed \n Error: ' + JSON.stringify(err, undefined, 2));
        }
        else {
            //Databse connection success message
            console.log('Database connection successful');
            //Received variables printed out
            console.log('You sent the email "' + email +'".\n');
            console.log('You sent the username "' + password +'".\n');
            console.log('You sent the password "' + username +'".\n');
            console.log('You sent the gender "' + firstName +'".\n');
            console.log('You sent the height "' + lastName +'".\n');
            console.log('You sent the weight "' + occupation +'".\n');
            console.log('You sent the activityLevel "' + description +'".\n');
            //Insert variables into table "User Database"
            var sql = "INSERT INTO User Database (email, password, username, firstName, lastName, occupation, description) VALUES ('"+email+"', '"+password+"', '"+username+"', '"+firstName+"', '"+lastName+"', '"+occupation+"', '"+description+"')";
            conn.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
        }
    });

    //Ending message
    console.log('Insertion has ended');
}
