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
            <div>
               Date: <input type="date" name="date">
            </div>
            <div class="form-group">
                    <label for="bookedroom" class="booking-section-label">Select a room:</label>
                    <select class="form-control" name ="bookedroom" id="bookedroom" placeholder="Select a room...">
                    <option>The Green Room</option>     <!--    <option value="The Green Room">The Green Room</option>   May need to add "value" option as well... seems to work without it though-->
                    <option>The DaVinci Room</option>   <!--    <option value="The DaVinci Room">The DaVinci Room</option>  -->
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
                    <label for="starttime" class="booking-section-label">Select start time:</label>
                    <select class="form-control" name="starttime" id="starttime" placeholder="Choose start time...">
                    <option>00:00</option>  <!--    <option value="00:00">00:00</option>    -->
                    <option>00:05</option>
                    <option>00:10</option>
                    <option>00:15</option>
                    <option>00:20</option>
                    <option>00:25</option>
                    <option>00:30</option>
                    <option>00:35</option>
                    <option>00:40</option>
                    <option>00:45</option>
                    <option>00:50</option>
                    <option>00:55</option>
                    <option>01:00</option>
                    <option>01:05</option>
                    <option>01:10</option>
                    <option>01:15</option>
                    <option>01:20</option>
                    <option>01:25</option>
                    <option>01:30</option>
                    <option>01:35</option>
                    <option>01:40</option>
                    <option>01:45</option>
                    <option>01:50</option>
                    <option>01:55</option>
                    <option>02:00</option>
                    <option>02:05</option>
                    <option>02:10</option>
                    <option>02:15</option>
                    <option>02:20</option>
                    <option>02:25</option>
                    <option>02:30</option>
                    <option>02:35</option>
                    <option>02:40</option>
                    <option>02:45</option>
                    <option>02:50</option>
                    <option>02:55</option>
                    <option>03:00</option>
                    <option>03:05</option>
                    <option>03:10</option>
                    <option>03:15</option>
                    <option>03:20</option>
                    <option>03:25</option>
                    <option>03:30</option>
                    <option>03:35</option>
                    <option>03:40</option>
                    <option>03:45</option>
                    <option>03:50</option>
                    <option>03:55</option>
                    <option>04:00</option>
                    <option>04:05</option>
                    <option>04:10</option>
                    <option>04:15</option>
                    <option>04:20</option>
                    <option>04:25</option>
                    <option>04:30</option>
                    <option>04:35</option>
                    <option>04:40</option>
                    <option>04:45</option>
                    <option>04:50</option>
                    <option>04:55</option>
                    <option>05:00</option>
                    <option>05:05</option>
                    <option>05:10</option>
                    <option>05:15</option>
                    <option>05:20</option>
                    <option>05:25</option>
                    <option>05:30</option>
                    <option>05:35</option>
                    <option>05:40</option>
                    <option>05:45</option>
                    <option>05:50</option>
                    <option>05:55</option>
                    <option>06:00</option>
                    <option>06:05</option>
                    <option>06:10</option>
                    <option>06:15</option>
                    <option>06:20</option>
                    <option>06:25</option>
                    <option>06:30</option>
                    <option>06:35</option>
                    <option>06:40</option>
                    <option>06:45</option>
                    <option>06:50</option>
                    <option>06:55</option>
                    <option>07:00</option>
                    <option>07:05</option>
                    <option>07:10</option>
                    <option>07:15</option>
                    <option>07:20</option>
                    <option>07:25</option>
                    <option>07:30</option>
                    <option>07:35</option>
                    <option>07:40</option>
                    <option>07:45</option>
                    <option>07:50</option>
                    <option>07:55</option>
                    <option>08:00</option>
                    <option>08:05</option>
                    <option>08:10</option>
                    <option>08:15</option>
                    <option>08:20</option>
                    <option>08:25</option>
                    <option>08:30</option>
                    <option>08:35</option>
                    <option>08:40</option>
                    <option>08:45</option>
                    <option>08:50</option>
                    <option>08:55</option>
                    <option>09:00</option>
                    <option>09:05</option>
                    <option>09:10</option>
                    <option>09:15</option>
                    <option>09:20</option>
                    <option>09:25</option>
                    <option>09:30</option>
                    <option>09:35</option>
                    <option>09:40</option>
                    <option>09:45</option>
                    <option>09:50</option>
                    <option>09:55</option>
                    <option>10:00</option>
                    <option>10:05</option>
                    <option>10:10</option>
                    <option>10:15</option>
                    <option>10:20</option>
                    <option>10:25</option>
                    <option>10:30</option>
                    <option>10:35</option>
                    <option>10:40</option>
                    <option>10:45</option>
                    <option>10:50</option>
                    <option>10:55</option>
                    <option>11:00</option>
                    <option>11:05</option>
                    <option>11:10</option>
                    <option>11:15</option>
                    <option>11:20</option>
                    <option>11:25</option>
                    <option>11:30</option>
                    <option>11:35</option>
                    <option>11:40</option>
                    <option>11:45</option>
                    <option>11:50</option>
                    <option>11:55</option>
                    <option>12:00</option>
                    <option>12:05</option>
                    <option>12:10</option>
                    <option>12:15</option>
                    <option>12:20</option>
                    <option>12:25</option>
                    <option>12:30</option>
                    <option>12:35</option>
                    <option>12:40</option>
                    <option>12:45</option>
                    <option>12:50</option>
                    <option>12:55</option>
                    <option>13:00</option>
                    <option>13:05</option>
                    <option>13:10</option>
                    <option>13:15</option>
                    <option>13:20</option>
                    <option>13:25</option>
                    <option>13:30</option>
                    <option>13:35</option>
                    <option>13:40</option>
                    <option>13:45</option>
                    <option>13:50</option>
                    <option>13:55</option>
                    <option>14:00</option>
                    <option>14:05</option>
                    <option>14:10</option>
                    <option>14:15</option>
                    <option>14:20</option>
                    <option>14:25</option>
                    <option>14:30</option>
                    <option>14:35</option>
                    <option>14:40</option>
                    <option>14:45</option>
                    <option>14:50</option>
                    <option>14:55</option>
                    <option>15:00</option>
                    <option>15:05</option>
                    <option>15:10</option>
                    <option>15:15</option>
                    <option>15:20</option>
                    <option>15:25</option>
                    <option>15:30</option>
                    <option>15:35</option>
                    <option>15:40</option>
                    <option>15:45</option>
                    <option>15:50</option>
                    <option>15:55</option>
                    <option>16:00</option>
                    <option>16:05</option>
                    <option>16:10</option>
                    <option>16:15</option>
                    <option>16:20</option>
                    <option>16:25</option>
                    <option>16:30</option>
                    <option>16:35</option>
                    <option>16:40</option>
                    <option>16:45</option>
                    <option>16:50</option>
                    <option>16:55</option>
                    <option>17:00</option>
                    <option>17:05</option>
                    <option>17:10</option>
                    <option>17:15</option>
                    <option>17:20</option>
                    <option>17:25</option>
                    <option>17:30</option>
                    <option>17:35</option>
                    <option>17:40</option>
                    <option>17:45</option>
                    <option>17:50</option>
                    <option>17:55</option>
                    <option>18:00</option>
                    <option>18:05</option>
                    <option>18:10</option>
                    <option>18:15</option>
                    <option>18:20</option>
                    <option>18:25</option>
                    <option>18:30</option>
                    <option>18:35</option>
                    <option>18:40</option>
                    <option>18:45</option>
                    <option>18:50</option>
                    <option>18:55</option>
                    <option>19:00</option>
                    <option>19:05</option>
                    <option>19:10</option>
                    <option>19:15</option>
                    <option>19:20</option>
                    <option>19:25</option>
                    <option>19:30</option>
                    <option>19:35</option>
                    <option>19:40</option>
                    <option>19:45</option>
                    <option>19:50</option>
                    <option>19:55</option>
                    <option>20:00</option>
                    <option>20:05</option>
                    <option>20:10</option>
                    <option>20:15</option>
                    <option>20:20</option>
                    <option>20:25</option>
                    <option>20:30</option>
                    <option>20:35</option>
                    <option>20:40</option>
                    <option>20:45</option>
                    <option>20:50</option>
                    <option>20:55</option>
                    <option>21:00</option>
                    <option>21:05</option>
                    <option>21:10</option>
                    <option>21:15</option>
                    <option>21:20</option>
                    <option>21:25</option>
                    <option>21:30</option>
                    <option>21:35</option>
                    <option>21:40</option>
                    <option>21:45</option>
                    <option>21:50</option>
                    <option>21:55</option>
                    <option>22:00</option>
                    <option>22:05</option>
                    <option>22:10</option>
                    <option>22:15</option>
                    <option>22:20</option>
                    <option>22:25</option>
                    <option>22:30</option>
                    <option>22:35</option>
                    <option>22:40</option>
                    <option>22:45</option>
                    <option>22:50</option>
                    <option>22:55</option>
                    <option>23:00</option>
                    <option>23:05</option>
                    <option>23:10</option>
                    <option>23:15</option>
                    <option>23:20</option>
                    <option>23:25</option>
                    <option>23:30</option>
                    <option>23:35</option>
                    <option>23:40</option>
                    <option>23:45</option>
                    <option>23:50</option>
                    <option>23:55</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="endtime" class="booking-section-label">Select end time:</label>
                    <select class="form-control" name="endtime" id="endtime" placeholder="Choose end time...">
                    <option>00:00</option>  <!--    <option value="00:00">00:00</option>    -->
                    <option>00:05</option>
                    <option>00:10</option>
                    <option>00:15</option>
                    <option>00:20</option>
                    <option>00:25</option>
                    <option>00:30</option>
                    <option>00:35</option>
                    <option>00:40</option>
                    <option>00:45</option>
                    <option>00:50</option>
                    <option>00:55</option>
                    <option>01:00</option>
                    <option>01:05</option>
                    <option>01:10</option>
                    <option>01:15</option>
                    <option>01:20</option>
                    <option>01:25</option>
                    <option>01:30</option>
                    <option>01:35</option>
                    <option>01:40</option>
                    <option>01:45</option>
                    <option>01:50</option>
                    <option>01:55</option>
                    <option>02:00</option>
                    <option>02:05</option>
                    <option>02:10</option>
                    <option>02:15</option>
                    <option>02:20</option>
                    <option>02:25</option>
                    <option>02:30</option>
                    <option>02:35</option>
                    <option>02:40</option>
                    <option>02:45</option>
                    <option>02:50</option>
                    <option>02:55</option>
                    <option>03:00</option>
                    <option>03:05</option>
                    <option>03:10</option>
                    <option>03:15</option>
                    <option>03:20</option>
                    <option>03:25</option>
                    <option>03:30</option>
                    <option>03:35</option>
                    <option>03:40</option>
                    <option>03:45</option>
                    <option>03:50</option>
                    <option>03:55</option>
                    <option>04:00</option>
                    <option>04:05</option>
                    <option>04:10</option>
                    <option>04:15</option>
                    <option>04:20</option>
                    <option>04:25</option>
                    <option>04:30</option>
                    <option>04:35</option>
                    <option>04:40</option>
                    <option>04:45</option>
                    <option>04:50</option>
                    <option>04:55</option>
                    <option>05:00</option>
                    <option>05:05</option>
                    <option>05:10</option>
                    <option>05:15</option>
                    <option>05:20</option>
                    <option>05:25</option>
                    <option>05:30</option>
                    <option>05:35</option>
                    <option>05:40</option>
                    <option>05:45</option>
                    <option>05:50</option>
                    <option>05:55</option>
                    <option>06:00</option>
                    <option>06:05</option>
                    <option>06:10</option>
                    <option>06:15</option>
                    <option>06:20</option>
                    <option>06:25</option>
                    <option>06:30</option>
                    <option>06:35</option>
                    <option>06:40</option>
                    <option>06:45</option>
                    <option>06:50</option>
                    <option>06:55</option>
                    <option>07:00</option>
                    <option>07:05</option>
                    <option>07:10</option>
                    <option>07:15</option>
                    <option>07:20</option>
                    <option>07:25</option>
                    <option>07:30</option>
                    <option>07:35</option>
                    <option>07:40</option>
                    <option>07:45</option>
                    <option>07:50</option>
                    <option>07:55</option>
                    <option>08:00</option>
                    <option>08:05</option>
                    <option>08:10</option>
                    <option>08:15</option>
                    <option>08:20</option>
                    <option>08:25</option>
                    <option>08:30</option>
                    <option>08:35</option>
                    <option>08:40</option>
                    <option>08:45</option>
                    <option>08:50</option>
                    <option>08:55</option>
                    <option>09:00</option>
                    <option>09:05</option>
                    <option>09:10</option>
                    <option>09:15</option>
                    <option>09:20</option>
                    <option>09:25</option>
                    <option>09:30</option>
                    <option>09:35</option>
                    <option>09:40</option>
                    <option>09:45</option>
                    <option>09:50</option>
                    <option>09:55</option>
                    <option>10:00</option>
                    <option>10:05</option>
                    <option>10:10</option>
                    <option>10:15</option>
                    <option>10:20</option>
                    <option>10:25</option>
                    <option>10:30</option>
                    <option>10:35</option>
                    <option>10:40</option>
                    <option>10:45</option>
                    <option>10:50</option>
                    <option>10:55</option>
                    <option>11:00</option>
                    <option>11:05</option>
                    <option>11:10</option>
                    <option>11:15</option>
                    <option>11:20</option>
                    <option>11:25</option>
                    <option>11:30</option>
                    <option>11:35</option>
                    <option>11:40</option>
                    <option>11:45</option>
                    <option>11:50</option>
                    <option>11:55</option>
                    <option>12:00</option>
                    <option>12:05</option>
                    <option>12:10</option>
                    <option>12:15</option>
                    <option>12:20</option>
                    <option>12:25</option>
                    <option>12:30</option>
                    <option>12:35</option>
                    <option>12:40</option>
                    <option>12:45</option>
                    <option>12:50</option>
                    <option>12:55</option>
                    <option>13:00</option>
                    <option>13:05</option>
                    <option>13:10</option>
                    <option>13:15</option>
                    <option>13:20</option>
                    <option>13:25</option>
                    <option>13:30</option>
                    <option>13:35</option>
                    <option>13:40</option>
                    <option>13:45</option>
                    <option>13:50</option>
                    <option>13:55</option>
                    <option>14:00</option>
                    <option>14:05</option>
                    <option>14:10</option>
                    <option>14:15</option>
                    <option>14:20</option>
                    <option>14:25</option>
                    <option>14:30</option>
                    <option>14:35</option>
                    <option>14:40</option>
                    <option>14:45</option>
                    <option>14:50</option>
                    <option>14:55</option>
                    <option>15:00</option>
                    <option>15:05</option>
                    <option>15:10</option>
                    <option>15:15</option>
                    <option>15:20</option>
                    <option>15:25</option>
                    <option>15:30</option>
                    <option>15:35</option>
                    <option>15:40</option>
                    <option>15:45</option>
                    <option>15:50</option>
                    <option>15:55</option>
                    <option>16:00</option>
                    <option>16:05</option>
                    <option>16:10</option>
                    <option>16:15</option>
                    <option>16:20</option>
                    <option>16:25</option>
                    <option>16:30</option>
                    <option>16:35</option>
                    <option>16:40</option>
                    <option>16:45</option>
                    <option>16:50</option>
                    <option>16:55</option>
                    <option>17:00</option>
                    <option>17:05</option>
                    <option>17:10</option>
                    <option>17:15</option>
                    <option>17:20</option>
                    <option>17:25</option>
                    <option>17:30</option>
                    <option>17:35</option>
                    <option>17:40</option>
                    <option>17:45</option>
                    <option>17:50</option>
                    <option>17:55</option>
                    <option>18:00</option>
                    <option>18:05</option>
                    <option>18:10</option>
                    <option>18:15</option>
                    <option>18:20</option>
                    <option>18:25</option>
                    <option>18:30</option>
                    <option>18:35</option>
                    <option>18:40</option>
                    <option>18:45</option>
                    <option>18:50</option>
                    <option>18:55</option>
                    <option>19:00</option>
                    <option>19:05</option>
                    <option>19:10</option>
                    <option>19:15</option>
                    <option>19:20</option>
                    <option>19:25</option>
                    <option>19:30</option>
                    <option>19:35</option>
                    <option>19:40</option>
                    <option>19:45</option>
                    <option>19:50</option>
                    <option>19:55</option>
                    <option>20:00</option>
                    <option>20:05</option>
                    <option>20:10</option>
                    <option>20:15</option>
                    <option>20:20</option>
                    <option>20:25</option>
                    <option>20:30</option>
                    <option>20:35</option>
                    <option>20:40</option>
                    <option>20:45</option>
                    <option>20:50</option>
                    <option>20:55</option>
                    <option>21:00</option>
                    <option>21:05</option>
                    <option>21:10</option>
                    <option>21:15</option>
                    <option>21:20</option>
                    <option>21:25</option>
                    <option>21:30</option>
                    <option>21:35</option>
                    <option>21:40</option>
                    <option>21:45</option>
                    <option>21:50</option>
                    <option>21:55</option>
                    <option>22:00</option>
                    <option>22:05</option>
                    <option>22:10</option>
                    <option>22:15</option>
                    <option>22:20</option>
                    <option>22:25</option>
                    <option>22:30</option>
                    <option>22:35</option>
                    <option>22:40</option>
                    <option>22:45</option>
                    <option>22:50</option>
                    <option>22:55</option>
                    <option>23:00</option>
                    <option>23:05</option>
                    <option>23:10</option>
                    <option>23:15</option>
                    <option>23:20</option>
                    <option>23:25</option>
                    <option>23:30</option>
                    <option>23:35</option>
                    <option>23:40</option>
                    <option>23:45</option>
                    <option>23:50</option>
                    <option>23:55</option>
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