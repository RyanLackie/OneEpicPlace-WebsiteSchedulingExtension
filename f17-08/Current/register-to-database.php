<?php

if (isset($_POST['RegisterButton'])) {
    include_once 'connect-to-database.php';

    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $firstname = mysqli_real_escape_string($conn, $_POST['firstname']);
    $lastname = mysqli_real_escape_string($conn, $_POST['lastname']);
    $occupation = mysqli_real_escape_string($conn, $_POST['occupation']);
    $description = mysqli_real_escape_string($conn, $_POST['description']);

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
        $sql = "INSERT INTO user (Email, Password, Username, FirstName, LastName, Occupation, Description) VALUES 
        ('{$email}', '{$password}', '{$username}', '{$firstname}', '{$lastname}', '{$occupation}', '{$description}');";

        $result = mysqli_query($conn, $sql);

        header("Location: ../register.html?post=success");
        exit();
    }
}
else {
    header("Location: ../register.html");
    exit();
}

?>