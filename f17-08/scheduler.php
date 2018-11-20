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
            <form method="post" action="php_methods/register.php" method="POST" enctype="multipart/form-data"><div class="form-group">
                    <label for="exampleFormControlSelect1">Select a room:</label>
                    <select class="form-control" id="exampleFormControlSelect1">
                    <input type="room" id="roomInputSection" name="room" class="form-control" placeholder="Choose a room..." required>
                    <option>The Green Room</option>
                    <option>The DaVinci Room</option>
                    <option>The Studio</option>
                    <option>The Zen Room</option>
                    <option>The Sunshine Room</option>
                    <option>The EPIC Room</option>
                    <option>The Loft</option>
                    <option>Kitchen</option>
                    <option>Hatchery</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="exampleFormControlSelect1">Select start time:</label>
                    <select class="form-control" id="exampleFormControlSelect1">
                    <option>12:00am</option>
                    <option>12:30am</option>
                    <option>1:00am</option>
                    <option>1:30am</option>
                    <option>2:00am</option>
                    <option>2:30am</option>
                    <option>3:00am</option>
                    <option>3:30am</option>
                    <option>4:00am</option>
                    <option>4:30am</option>
                    <option>5:00am</option>
                    <option>5:30am</option>
                    <option>6:00am</option>
                    <option>6:30am</option>
                    <option>7:00am</option>
                    <option>7:30am</option>
                    <option>8:00am</option>
                    <option>8:30am</option>
                    <option>9:00am</option>
                    <option>9:30am</option>
                    <option>10:00am</option>
                    <option>10:30am</option>
                    <option>11:00am</option>
                    <option>11:30am</option>
                    <option>12:00pm</option>
                    <option>12:30pm</option>
                    <option>1:00pm</option>
                    <option>1:30pm</option>
                    <option>2:00pm</option>
                    <option>2:30pm</option>
                    <option>3:00pm</option>
                    <option>3:30pm</option>
                    <option>4:00pm</option>
                    <option>4:30pm</option>
                    <option>5:00pm</option>
                    <option>5:30pm</option>
                    <option>6:00pm</option>
                    <option>6:30pm</option>
                    <option>7:00pm</option>
                    <option>7:30pm</option>
                    <option>8:00pm</option>
                    <option>8:30pm</option>
                    <option>9:00pm</option>
                    <option>9:30pm</option>
                    <option>10:00pm</option>
                    <option>10:30pm</option>
                    <option>11:00pm</option>
                    <option>11:30pm</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="exampleFormControlSelect1">Select end time:</label>
                    <select class="form-control" id="exampleFormControlSelect1">
                    <option>12:00am</option>
                    <option>12:30am</option>
                    <option>1:00am</option>
                    <option>1:30am</option>
                    <option>2:00am</option>
                    <option>2:30am</option>
                    <option>3:00am</option>
                    <option>3:30am</option>
                    <option>4:00am</option>
                    <option>4:30am</option>
                    <option>5:00am</option>
                    <option>5:30am</option>
                    <option>6:00am</option>
                    <option>6:30am</option>
                    <option>7:00am</option>
                    <option>7:30am</option>
                    <option>8:00am</option>
                    <option>8:30am</option>
                    <option>9:00am</option>
                    <option>9:30am</option>
                    <option>10:00am</option>
                    <option>10:30am</option>
                    <option>11:00am</option>
                    <option>11:30am</option>
                    <option>12:00pm</option>
                    <option>12:30pm</option>
                    <option>1:00pm</option>
                    <option>1:30pm</option>
                    <option>2:00pm</option>
                    <option>2:30pm</option>
                    <option>3:00pm</option>
                    <option>3:30pm</option>
                    <option>4:00pm</option>
                    <option>4:30pm</option>
                    <option>5:00pm</option>
                    <option>5:30pm</option>
                    <option>6:00pm</option>
                    <option>6:30pm</option>
                    <option>7:00pm</option>
                    <option>7:30pm</option>
                    <option>8:00pm</option>
                    <option>8:30pm</option>
                    <option>9:00pm</option>
                    <option>9:30pm</option>
                    <option>10:00pm</option>
                    <option>10:30pm</option>
                    <option>11:00pm</option>
                    <option>11:30pm</option>
                    </select>
                </div>
                <button class="btn btn-lg btn-outline-primary" type="submit" value="Submit" name="BookButton">Book Room</button>
            </form>
        </div>

        <!-- Scripts -->
        <?php include('components/scripts.php'); ?>
        <script src="js/calendar.js"></script>
    </body>

</html>