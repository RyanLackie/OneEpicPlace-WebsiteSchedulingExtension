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
        
        session_start();
        include('php_methods/session.php');
    ?>

    <body>
        <!-- Header -->
        <?php include('components/header.php'); ?>

        <!-- Nav Bar -->
        <?php
            if ($login_id == null) {
                include('components/nonuser-navbar.php');
            }
            else {
                include('components/user-navbar.php');
            }
        ?>

        <!-- About Section -->
        <div class="half-row-centered">
        <table class="coolTable">
  	<tr>
    <th colspan="2">Click Start and End Times</th>
   </tr>   
   <tr>
   <!--First row First cell -->
   <td onClick="document.location.href='#r1c1;">      
   <a href='#r1c1' class="parent1">Room 1</a>
   <!--Displayed when clicked-->
   <div id="r1c1"><h3>Room 1</h3>
   <p> Information about Room 1</p>
   </div>
   </td>
   <td>  
   <!--First row Second cell-->
   <a href='#r1c2' class="parent2">10:30am</a>
   <!--Displayed when clicked-->
   <div id="r1c2"><h3>Time Chosen!</h3>
   <p> You have selected 10:30am</p>
   </div>
   </td>
   <td>  
   <!--First row Third cell-->
   <a href='#r1c3' class="parent2">10:35am</a>
   <!--Displayed when clicked-->
   <div id="r1c3"><h3>Time Chosen!</h3>
   <p> You have selected 10:35am</p>
   </div>
   </td>
   <td>  
   <!--First row Fourth cell-->
   <a href='#r1c4' class="parent2">10:40am</a>
   <!--Displayed when clicked-->
   <div id="r1c4"><h3>Time Chosen!</h3>
   <p> You have selected 10:40am</p>
   </div>
   </td>
   </tr>
    <tr>
   <td>      
   <!--Second row first cell-->
   <a href='#r2c1' class="parent3">Room 2</a>
   <!--Displayed when clicked-->
   <div id="r2c1"><h3>Room 2</h3>  
   <p> Information about Room 2</p>
   </div>
   </td>
   <!--Second row second cell-->
   <td onClick="document.location.href='#child4">      
   <a href='#r2c2' class="parent4">10:30am</a>
   <!--Displayed when clicked-->
   <div id="r2c2"><h3>Time Chosen!</h3>
   <p> You have selected 10:30am</p>
   </div>
   </td>
   <td>  
   <!--Second row Third cell-->
   <a href='#r2c3' class="parent2">10:35am</a>
   <!--Displayed when clicked-->
   <div id="r2c3"><h3>Time Chosen!</h3>
   <p> You have selected 10:35am</p>
   </div>
   </td>
   <td>  
   <!--Second row Fourth cell-->
   <a href='#r2c4' class="parent2">10:40am</a>
   <!--Displayed when clicked-->
   <div id="r2c4"><h3>Time Chosen!</h3>
   <p> You have selected 10:40am</p>
   </div>
   </td>
   </tr>
</table>
        </div>
<style>
a {
    color:white;
    text-decoration:none;
} 

#r1c1, #r1c2, #r1c3, #r1c4, #r2c1, #r2c2, #r2c3, #r2c4{
	position:absolute;
	display:none;
    bottom:200px;
	z-index:9;
	color:black;
}

#r1c1:target, #r1c2:target, #r1c3:target, #r1c4:target, #r2c1:target, #r2c2:target, #r2c3:target, #r2c4:target {

display:block;
}

table.coolTable td {
    background-color:blue;
    color:green;
}

table.coolTable td:hover {
    background-color:green;
    color:green;
}

td a {
    display:block;
    width:100%;
}
</style>
        <!-- Scripts -->
        <?php include('components/scripts.php'); ?>
        
    </body>

</html>