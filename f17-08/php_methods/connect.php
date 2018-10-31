<?php
    //CHANGE FOR EACH DATABASE BEING USED!!!
    $dbServername = "cs.newpaltz.edu";
    $dbUsername = "p_f17_8";
    $dbPassword = "aj5qyk";
    $dbName = "p_f17_8_db";

    // Create connection
    $conn = mysqli_connect($dbServername, $dbUsername, $dbPassword, $dbName);

    // Check connection
    if ($conn->connect_error) {
        header("Location: index.php?connection=failed");
        die("Connection failed: " . $conn->connect_error);
    }
?>