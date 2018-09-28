<?php

include_once 'connect-to-database.php';

$email = "test_email";
$password = "test_password";
$username = "test_username";
$firstname = "test_firstname";
$lastname = "test_lastname";
$occupation = "test_occupation";
$description = "test_description";

//Error handelers - Check for empty fields
if (empty($email)) {
    header("Location: ../register.html?emailfield=empty");
    exit();
}
if (empty($password)) {
    header("Location: ../register.html?passwordfield=empty");
    exit();
}
if (empty($username)) {
    header("Location: ../register.html?usernamefield=empty");
    exit();
}
if (empty($firstname)) {
    header("Location: ../register.html?firstnamefield=empty");
    exit();
}
if (empty($lastname)) {
    header("Location: ../register.html?lastnamefield=empty");
    exit();
}

//If no problems insert the post into the database
else {
    $sql = "INSERT INTO posts (user_email, user_password, user_username, user_firstname, user_lastname, user_occupation, user_description) 
    VALUES ('{$email}', '{$password}', '{$username}', '{$firstname}', '{$lastname}', '{$occupation}', '{$description}');";

    $result = mysqli_query($conn, $sql);

    header("Location: ../register.html?post=success");
    exit();
}

?>