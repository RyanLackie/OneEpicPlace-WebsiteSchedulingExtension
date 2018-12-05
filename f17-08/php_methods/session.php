<?php
    include('connect.php');
    session_start();

    //Remove warnings
    error_reporting(0);

    $user_check = $_SESSION['login_id'];
    $ses_sql = mysqli_query($conn, "select * from users where user_id = '$user_check' ");
    $row = mysqli_fetch_array($ses_sql, MYSQLI_ASSOC);

    //Global Session Variables
    //User information
    $login_id = $row['user_id'];
    $login_email = $row['user_email'];
    $login_password = $row['user_password'];
    $login_firstname = $row['user_firstname'];
    $login_lastname = $row['user_lastname'];
    $login_occupation = $row['user_occupation'];
    $login_description = $row['user_description'];
    $login_regdate = $row['sign_up_date'];

    //Scheduling information
    $login_dateSelected = null;

    if (!isset($_SESSION['login_user'])) {
        header("../index.php?unknownUser");
    }
?>