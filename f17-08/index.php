<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        
        <!-- Title And URL Icon -->
        <link rel="icon" type="image/png" href="assets/logo.png"/>
		<title>One Epic Place</title>

        <!-- CSS Sheets -->
        <!-- Bootstrap -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
        <!-- Home Made CSS Sheets -->
        <link rel="stylesheet" href="css/stylesheet.css">

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
		<link href="https://fonts.googleapis.com/css?family=Playfair+Display" rel="stylesheet"> 
		<link href="https://fonts.googleapis.com/css?family=Quicksand" rel="stylesheet"> 

    </head>

    <?php
        //Remove warnings
        error_reporting(0);

        session_start();
        include('php_methods/session.php');
    ?>

    <body>
        <!-- Header -->
        <?php include('components/header.php'); ?>

        <!-- Nav Bar -->
        <?php
            if ($login_id == null)
                include('components/nonuser-navbar.php');
            else
                include('components/user-navbar.php');
        ?>

        <!-- Welcome User -->
        <?php
            if ($login_id != null)
                include('components/welcome-user.php');
        ?>

        <!-- Bottom Image -->
        <div class="full-row-centered">
            <img class="index-bottom-image" src="assets/ONEEPICPLACE-LOGO-TAGLINE.png"/>
        </div>

        <!-- Bottom Text -->
        <div class="full-row-centered">
            <h3>This is the home page for One Epic Place!</h3>
        </div>
        
        <!-- Scripts -->
        <?php include('components/scripts.php'); ?>

    </body>

</html>