<?php
    include_once 'connect.php';
    session_start();

    //Remove warnings
    error_reporting(0);

    //If connection sucessfull
    if ($conn) {
        //Checks if feilds are coming from the form or from a resent register
        if ($_SESSION['login_email'] == null) {
            $email = mysqli_real_escape_string($conn, $_POST['email']);
        }
        else {
            $email = $_SESSION['login_email'];
        }

        if ($_SESSION['login_password'] == null) {
            $password = mysqli_real_escape_string($conn, $_POST['password']);
        }
        else {
            $password = $_SESSION['login_password'];
        }

        //Error handelers - Check for empty fields
        if (empty($email)) {
            header("Location: ../login.php?emailfield=empty");
            exit();
        }
        if (empty($password)) {
            header("Location: ../login.php?passwordfield=empty");
            exit();
        }
        
        //Try and find user in table "user"
        $sql = "SELECT user_id FROM user WHERE user_email = '$email' and user_password = '$password'";
        $result = mysqli_query($conn, $sql);
        //Don't know why this is needed
        /*
        $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
        $active = $row['active'];
        */
        $count = mysqli_num_rows($result);

        //If result matched $email and $password, table row must be 1 row	
        if ($count == 1) {
            $_SESSION['login_user'] = $email;
            header("location: ../index.php?login=successful");
        }
        else if ($count == 0) { 
            $error = "Your Login Name or Password is invalid";
            header("Location: ../login.php?email+password=incorect");

        }
        else if ($count > 1) { 
            header("Location: ../login.php?login=failed:result>1");
        }
    }
    //If Connection Failed
    else {
        header("Location: ../login.php?connection=failed");
        die("Connection Failed. Reason: ".mysqli_connect_error());
    }
?>