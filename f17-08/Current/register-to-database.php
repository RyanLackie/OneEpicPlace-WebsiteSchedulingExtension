<?php

if (isset($_POST['RegisterButton'])) {
    include_once 'connect-to-database.php';

    //Current fields being inserted into for current table
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $firstname = mysqli_real_escape_string($conn, $_POST['firstname']);
    $lastname = mysqli_real_escape_string($conn, $_POST['lastname']);
    $occupation = mysqli_real_escape_string($conn, $_POST['occupation']);
    $description = mysqli_real_escape_string($conn, $_POST['description']);

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

        header("Location: index.html?insert=success");
        exit();
    }
}
else {
    header("Location: index.html?RegisterButton=notPressed");
    exit();
}

?>