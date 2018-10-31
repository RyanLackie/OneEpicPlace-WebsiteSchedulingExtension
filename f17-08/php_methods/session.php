<?php
    include('connect.php');
    session_start();

    //Remove warnings
    error_reporting(0);

    $user_check = $_SESSION['login_user'];

    $ses_sql = mysqli_query($conn, "select user_email from user where user_email = '$user_check' ");

    $row = mysqli_fetch_array($ses_sql, MYSQLI_ASSOC);

    $login_session = $row['user_email'];

    if (!isset($_SESSION['login_user'])) {
        header("../index.php?unknownUser");
    }
?>