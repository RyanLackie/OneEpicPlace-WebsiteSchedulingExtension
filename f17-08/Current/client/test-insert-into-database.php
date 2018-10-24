<?php

include_once 'connect-to-database.php';

$email = "test_email3";
$password = "test_password3";
$username = "test_username3";
$firstname = "test_firstname3";
$lastname = "test_lastname3";
$occupation = "test_occupation3";
$description = "test_description3";

//Error handelers - Check for empty fields
if (empty($email)) {
    header("Location: index.html?emailfield=empty");
    exit();
}
if (empty($password)) {
    header("Location: index.html?passwordfield=empty");
    exit();
}
if (empty($username)) {
    header("Location: index.html?usernamefield=empty");
    exit();
}
if (empty($firstname)) {
    header("Location: index.html?firstnamefield=empty");
    exit();
}
if (empty($lastname)) {
    header("Location: index.html?lastnamefield=empty");
    exit();
}

//If no problems insert the user into the database
else {
    echo "inserting"; 

    //Must be "INSERT INTO..." then the name of the table being inserted into
    $sql = "INSERT INTO users (user_email, user_password, user_username, user_firstname, user_lastname, user_occupation, user_description) 
    VALUES ('{$email}', '{$password}', '{$username}', '{$firstname}', '{$lastname}', '{$occupation}', '{$description}');";

    $result = mysqli_query($conn, $sql);

    header("Location: index.html?testInsert=success");
    exit();
}

?>