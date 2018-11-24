<?php
    if (isset($_POST['RegisterButton'])) {
        include_once 'connect.php';
        session_start();

        //Remove warnings
        error_reporting(0);

        //Current fields being inserted into for current table
        $email = mysqli_real_escape_string($conn, $_POST['email']);
        $password = mysqli_real_escape_string($conn, $_POST['password']);
        $firstname = mysqli_real_escape_string($conn, $_POST['firstname']);
        $lastname = mysqli_real_escape_string($conn, $_POST['lastname']);
        $occupation = mysqli_real_escape_string($conn, $_POST['occupation']);
        $description = mysqli_real_escape_string($conn, $_POST['description']);

        //Error handelers - Check for empty fields
        if (empty($email)) {
            header("Location: ../register.php?emailfield=empty");
            exit();
        }
        if (empty($password)) {
            header("Location: ../register.php?passwordfield=empty");
            exit();
        }
        if (empty($firstname)) {
            header("Location: ../register.php?firstnamefield=empty");
            exit();
        }
        if (empty($lastname)) {
            header("Location: ../register.php?lastnamefield=empty");
            exit();
        }

        //If no problems insert the user into the database
        else {
            //Try and findif the email is already in use
            $sql = "SELECT user_id FROM users WHERE user_email = '$email'";
            $result = mysqli_query($conn, $sql);
            $count = mysqli_num_rows($result);
            if ($count > 0) {
                $_SESSION['email_error'] = true;
                header("Location: ../register.php?email=used");
                exit();
            }

            //Must be "INSERT INTO..." then the name of the table being inserted into
            $sql = "INSERT INTO users (user_email, user_password, user_firstname, user_lastname, user_occupation, user_description, sign_up_date)
            VALUES ('{$email}', '{$password}', '{$firstname}', '{$lastname}', '{$occupation}', '{$description}', NOW());";

            $result = mysqli_query($conn, $sql);
            $row = mysqli_fetch_array($result, MYSQLI_ASSOC);

            $_SESSION['login_email'] = $email;
            $_SESSION['login_password'] = $password;

            header("Location: login.php");

            exit();
        }
    }
    
    else {
        header("Location: ../register.php?RegisterButton=notPressed");
        exit();
    }
?>