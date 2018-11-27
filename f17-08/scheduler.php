<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        
        <!-- Title And URL Icon -->
        <link rel="icon" type="image/png" href="../assets/logo.png"/>
		<title>One Epic Place - Scheduler</title>

        <!-- CSS Sheets -->
        <!-- Bootstrap -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
        <!-- Home Made CSS Sheets -->
        <link rel="stylesheet" href="css/calendar.css">
        <link rel="stylesheet" href="css/day-view.css">
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

        <!-- Calendar -->
        <?php include('components/calendar.php'); ?>

        <!-- Day View -->
        <?php
            echo($login_dateSelected);
            if ($login_dateSelected != null) {
                include('components/day-view.php');
            }
        ?>

        <!-- Dropdown for time selection -->
        <div class="half-row-centered">
            <form method="post" action="php_methods/booking.php" method="POST" enctype="multipart/form-data">
            <div class="form-group">
                    <label for="bookedroom" class="booking-section-label">Select a room:</label>
                    <select class="form-control" id="bookedroom" placeholder="Select a room...">
                    <option value="The Green Room">The Green Room</option>
                    <option value="The DaVinci Room">The DaVinci Room</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="starttime" class="booking-section-label">Select start time:</label>
                    <select class="form-control" id="starttime" placeholder="Choose start time...">
                    <option value="00:00">00:00</option>
                    <option value="00:05">00:05</option>
                    <option value="00:10">00:10</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="endtime" class="booking-section-label">Select end time:</label>
                    <select class="form-control" id="endtime" placeholder="Choose end time...">
                    <option value="00:00">00:00</option>
                    <option value="00:05">00:05</option>
                    <option value="00:10">00:10</option>
                    </select>
                </div>
                <button class="btn btn-lg btn-outline-primary" type="submit" value="Submit" name="BookingButton">Book Room</button>
            </form>
        </div>

        <!-- Scripts -->
        <?php include('components/scripts.php'); ?>
        <script src="js/calendar.js"></script>
    </body>

</html>