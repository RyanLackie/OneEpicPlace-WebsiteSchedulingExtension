<?php
    include_once 'connect.php';
    session_start();

    //Remove warnings
    error_reporting(0);

    //If connection sucessfull
    if ($conn) {
        //Checks if feilds are coming from the form or from global session variables (Register)
        if ($_SESSION['login_email'] != null && $_SESSION['login_password'] != null) {
            $email = $_SESSION['login_email'];
            $password = $_SESSION['login_password'];
        }
        else {
            $email = mysqli_real_escape_string($conn, $_POST['email']);
            $password = mysqli_real_escape_string($conn, $_POST['password']);
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
        $sql = "SELECT user_id FROM users WHERE user_email = '$email' and user_password = '$password'";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
        $count = mysqli_num_rows($result);

        //If result matched $email and $password, table row must be 1 row	
        if ($count == 1) {
            $_SESSION['login_id'] = $row['user_id'];

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