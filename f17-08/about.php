<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        
        <!-- Title And URL Icon -->
        <link rel="icon" type="image/png" href="../assets/logo.png"/>
		<title>One Epic Place - About</title>

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

        <!-- About Section -->
        <div class="half-row-centered">
            <h3>Welcome to One Epic Place!</h3>
            <h3>Schedule a room today!</h3>
            <a class="btn btn-outline-primary" href="https://oneepicplace.com" role="button">Go To Main Site</a>
        </div>

        <!-- Scripts -->
        <?php include('components/scripts.php'); ?>
        
    </body>

</html>