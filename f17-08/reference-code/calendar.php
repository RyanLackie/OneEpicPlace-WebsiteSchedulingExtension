<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        
        <!-- Title And URL Icon -->
        <link rel="icon" type="image/png" href="assets/logo.png"/>
		<title>One Epic Place - Calendar</title>

        <!-- CSS Sheets -->
        <!-- Bootstrap -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
        <!-- Home Made CSS Sheets -->
        <link rel="stylesheet" href="css/stylesheet.css">
        <link rel="stylesheet" href="css/calendar-stylesheet.css">

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
            if ($login_session == null) {
                include('components/nonuser-navbar.php');
            }
            else {
                include('components/user-navbar.php');
            }
            
            if ($_SESSION['email_error'] == true) {
                include('components/email-alert.php');
            }
        ?>

        <!-- Clock -->
        <canvas id="canvas" width="200" height="200"></canvas>
        <script src="javascript/clock.js"></script>

        <!-- Calendar -->
        <div class="calendar-container">

            <div class="calendar-month-header">January</div>

            <div class="row">
                <div class="calendar-week">Mo</div>
                <div class="calendar-week">Tu</div>
                <div class="calendar-week">We</div>
                <div class="calendar-week">Th</div>
                <div class="calendar-week">Fr</div>
                <div class="calendar-week">Sa</div>
                <div class="calendar-week">Su</div>
            </div>

            <div class="row">
                <div class="calendar-day">1</div>
                <div class="calendar-day">2</div>
                <div class="calendar-day">3</div>
                <div class="calendar-day">4</div>
                <div class="calendar-day">5</div>
                <div class="calendar-day">6</div>
                <div class="calendar-day">7</div>
            </div>

            <div class="row">
                <div class="calendar-day">8</div>
                <div class="calendar-day">9</div>
                <div class="calendar-day">10</div>
                <div class="calendar-day">11</div>
                <div class="calendar-day">12</div>
                <div class="calendar-day">13</div>
                <div class="calendar-day">14</div>
            </div>

            <div class="row">
                <div class="calendar-day">15</div>
                <div class="calendar-day">16</div>
                <div class="calendar-day">17</div>
                <div class="calendar-day">18</div>
                <div class="calendar-day">19</div>
                <div class="calendar-day">20</div>
                <div class="calendar-day">21</div>
            </div>

            <div class="row">
                <div class="calendar-day">22</div>
                <div class="calendar-day">23</div>
                <div class="calendar-day">24</div>
                <div class="calendar-day">25</div>
                <div class="calendar-day">26</div>
                <div class="calendar-day">27</div>
                <div class="calendar-day">28</div>
            </div>

            <div class="row">
                <div class="calendar-day">29</div>
                <div class="calendar-day">30</div>
                <div class="calendar-next-month-day">1</div>
                <div class="calendar-next-month-day">2</div>
                <div class="calendar-next-month-day">3</div>
                <div class="calendar-next-month-day">4</div>
                <div class="calendar-next-month-day">5</div>
            </div>

        </div>

        <div class="Container" style="width:50%; margin:0px auto 0px auto;">
            <form method="post" action="#submit">
                <div class="form-group">
                    <label for="roomInputSection" class="register-section-label">Room</label>
                    <select id="roomInputSection" class="form-control" required>
                        <option>Room 1</option>
                        <option>Room 2</option>
                        <option>Room 3</option>
                        <option>Room 4</option>
                        <option>Room 5</option>
                    </select>

                    <label for="startTimeInputSection" class="register-section-label">Time (Start)</label>
                    <select id="startTimeInputSection" class="form-control" required>
                        <option>8am</option>
                        <option>9am</option>
                        <option>10am</option>
                        <option>11am</option>
                        <option>12am</option>
                        <option>1am</option>
                        <option>2am</option>
                        <option>3am</option>
                        <option>4am</option>
                        <option>5am</option>
                        <option>6am</option>
                        <option>7am</option>
                        <option>8am</option>
                    </select>

                    <label for="endTimeInputSection" class="register-section-label">Time (End)</label>
                    <select id="endTimeInputSection" class="form-control" required>
                        <option>8am</option>
                        <option>9am</option>
                        <option>10am</option>
                        <option>11am</option>
                        <option>12am</option>
                        <option>1am</option>
                        <option>2am</option>
                        <option>3am</option>
                        <option>4am</option>
                        <option>5am</option>
                        <option>6am</option>
                        <option>7am</option>
                        <option>8am</option>
                    </select>

                    <button class="btn btn-lg btn-outline-primary enter-button" type="submit" value="Submit" name="submitButton">Enter</button>
                </div>
            </form>
        </div>

        <!-- Day Calendar View -->
        <div class="calendar-container">
            <div class="calendar-day-daterow">
                <div class="calendar-day-date">
                    1
                </div>
            </div>

            <!-- Container for hour markers -->
            <div class="calendar-day-hoursrow" id="row-0">
                <div class="hours-space"></div>

                <div class="hours-group">
                    <div class="hours" id="0-1">8am</div>
                    <div class="hours" id="0-2">9am</div>
                    <div class="hours" id="0-3">10am</div>
                    <div class="hours" id="0-4">11am</div>
                    <div class="hours" id="0-5">12am</div>
                    <div class="hours" id="0-6">1pm</div>
                    <div class="hours" id="0-7">2pm</div>
                    <div class="hours" id="0-8">3pm</div>
                    <div class="hours" id="0-9">4pm</div>
                    <div class="hours" id="0-10">5pm</div>
                    <div class="hours" id="0-11">6pm</div>
                    <div class="hours" id="0-12">7pm</div>
                    <div class="hours" id="0-13">8pm</div>
                </div>
            </div>

            <div class="calendar-day-timerow" id="row-1">
                <div class="room-box">Room 1</div>

                <div class="timebox-group">
                    <div class="timebox" id="1-1"></div>
                    <div class="timebox" id="1-2"></div>
                    <div class="timebox" id="1-3"></div>
                    <div class="timebox" id="1-4"></div>
                    <div class="timebox" id="1-5"></div>
                    <div class="timebox" id="1-6"></div>
                    <div class="timebox" id="1-7"></div>
                    <div class="timebox" id="1-8"></div>
                    <div class="timebox" id="1-9"></div>
                    <div class="timebox" id="1-10"></div>
                    <div class="timebox" id="1-11"></div>
                    <div class="timebox" id="1-12"></div>
                    <div class="timebox" id="1-13"></div>
                </div>
            </div>

            <div class="calendar-day-timerow" id="row-2">
                <div class="room-box">Room 2</div>
                
                <div class="timebox-group">
                    <div class="timebox" id="2-1"></div>
                    <div class="timebox" id="2-2"></div>
                    <div class="timebox" id="2-3"></div>
                    <div class="timebox" id="2-4"></div>
                    <div class="timebox" id="2-5"></div>
                    <div class="timebox" id="2-6"></div>
                    <div class="timebox" id="2-7"></div>
                    <div class="timebox" id="2-8"></div>
                    <div class="timebox" id="2-9"></div>
                    <div class="timebox" id="2-10"></div>
                    <div class="timebox" id="2-11"></div>
                    <div class="timebox" id="2-12"></div>
                    <div class="timebox" id="2-13"></div>
                </div>
            </div>

            <div class="calendar-day-timerow" id="row-3">
                <div class="room-box">Room 3</div>
                
                <div class="timebox-group">
                    <div class="timebox" id="3-1"></div>
                    <div class="timebox" id="3-2"></div>
                    <div class="timebox" id="3-3"></div>
                    <div class="timebox" id="3-4"></div>
                    <div class="timebox" id="3-5"></div>
                    <div class="timebox" id="3-6"></div>
                    <div class="timebox" id="3-7"></div>
                    <div class="timebox" id="3-8"></div>
                    <div class="timebox" id="3-9"></div>
                    <div class="timebox" id="3-10"></div>
                    <div class="timebox" id="3-11"></div>
                    <div class="timebox" id="3-12"></div>
                    <div class="timebox" id="3-13"></div>
                </div>
            </div>

            <div class="calendar-day-timerow" id="row-4">
                <div class="room-box">Room 4</div>
                
                <div class="timebox-group">
                    <div class="timebox" id="4-1"></div>
                    <div class="timebox" id="4-2"></div>
                    <div class="timebox" id="4-3"></div>
                    <div class="timebox" id="4-4"></div>
                    <div class="timebox" id="4-5"></div>
                    <div class="timebox" id="4-6"></div>
                    <div class="timebox" id="4-7"></div>
                    <div class="timebox" id="4-8"></div>
                    <div class="timebox" id="4-9"></div>
                    <div class="timebox" id="4-10"></div>
                    <div class="timebox" id="4-11"></div>
                    <div class="timebox" id="4-12"></div>
                    <div class="timebox" id="4-13"></div>
                </div>
            </div>

            <div class="calendar-day-timerow" id="row-5">
                <div class="room-box">Room 5</div>
                
                <div class="timebox-group">
                    <div class="timebox" id="5-1"></div>
                    <div class="timebox" id="5-2"></div>
                    <div class="timebox" id="5-3"></div>
                    <div class="timebox" id="5-4"></div>
                    <div class="timebox" id="5-5"></div>
                    <div class="timebox" id="5-6"></div>
                    <div class="timebox" id="5-7"></div>
                    <div class="timebox" id="5-8"></div>
                    <div class="timebox" id="5-9"></div>
                    <div class="timebox" id="5-10"></div>
                    <div class="timebox" id="5-11"></div>
                    <div class="timebox" id="5-12"></div>
                    <div class="timebox" id="5-13"></div>
                </div>
            </div>
        </div>

        <!-- Scripts -->
        <?php include('html/scripts.php'); ?>

    </body>

</html>