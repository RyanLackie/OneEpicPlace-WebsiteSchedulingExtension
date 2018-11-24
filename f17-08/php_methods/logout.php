<?php
    //Remove warnings
    error_reporting(0);

    session_start();

    if (session_destroy()) {
        header("Location: ../index.php?logout");
    }
?>