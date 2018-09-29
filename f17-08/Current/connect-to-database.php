<?php

echo "connecting";

//CHANGE FOR EACH DATABASE BEING USED!!!
$dbServername = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbName = "oneepicplace_database";

// Create connection
$conn = mysqli_connect($dbServername, $dbUsername, $dbPassword, $dbName);

// Check connection
if ($conn->connect_error) {
    echo "Connect failed";
    die("Connection failed: " . $conn->connect_error);
}
else {
    echo "Connected successfully";
}

?>