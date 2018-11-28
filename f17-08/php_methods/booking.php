<?php
    if (isset($_POST['BookingButton'])) {
        include_once 'connect.php';
        session_start();

        //Remove warnings
        error_reporting(0);

        //Current fields being inserted into for current table
        $bookedroom = mysqli_real_escape_string($conn, $_POST['bookedroom']);
        $starttime = mysqli_real_escape_string($conn, $_POST['starttime']);
        $endtime = mysqli_real_escape_string($conn, $_POST['endtime']);
        $date = mysqli_real_escape_string($conn, $_POST['date']);
       
        //Error handelers - Check for empty fields
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

            //Must be "INSERT INTO..." then the name of the table being inserted into
            $sql = "INSERT INTO booking (bookedroom, starttime, endtime, thedate)
            VALUES ('{$bookedroom}', '{$starttime}', '{$endtime}', '{$date}');";

            $result = mysqli_query($conn, $sql);
            $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
            
            header("Location: ../scheduler.php");

            exit();
        }
    }
    
    else {
        header("Location: ../scheduler.php?BookingButton=notPressed");
        exit();
    }
?>