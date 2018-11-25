<?php
    if (isset($_POST['BookingButton'])) {
        include_once 'connect.php';
        session_start();

        //Remove warnings
        error_reporting(0);

        //Current fields being inserted into for current table
        //$email = mysqli_real_escape_string($conn, $_POST['email']);
        $bookedroom = mysqli_real_escape_string($conn, $_POST['bookedroom']);
        $starttime = mysqli_real_escape_string($conn, $_POST['starttime']);
        $endtime = mysqli_real_escape_string($conn, $_POST['endtime']);
       
        //Error handelers - Check for empty fields
        //if (empty($email)) {
        //    header("Location: ../register.php?emailfield=empty");
        //    exit();
        //}
        if (empty($bookedroom)) {
            header("Location: ../scheduler.php?bookedroomfield=empty");
            exit();
        }
        if (empty($starttime)) {
            header("Location: ../scheduler.php?starttimefield=empty");
            exit();
        }
        if (empty($endtime)) {
            header("Location: ../scheduler.php?endtimefield=empty");
            exit();
        }

        //If no problems insert the user into the database
        else {
            //Try and findif the email is already in use
        //    $sql = "SELECT user_id FROM booking WHERE user_email = '$email'";
        //    $result = mysqli_query($conn, $sql);
        //    $count = mysqli_num_rows($result);
        //    if ($count > 0) {
        //        $_SESSION['email_error'] = true;
        //        header("Location: ../register.php?email=used");
        //        exit();
        //    }

            //Must be "INSERT INTO..." then the name of the table being inserted into
            $sql = "INSERT INTO booking (user_bookedroom, user_starttime, user_endtime, register_time)
            VALUES ({$bookedroom}', '{$starttime}', '{$endtime}', NOW());";

            $result = mysqli_query($conn, $sql);
            $row = mysqli_fetch_array($result, MYSQLI_ASSOC);

            $_SESSION['login_email'] = $email;
            $_SESSION['login_bookedroom'] = $bookedroom;

            header("Location: login.php");

            exit();
        }
    }
    
    else {
        header("Location: ../scheduler.php?BookingButton=notPressed");
        exit();
    }
?>