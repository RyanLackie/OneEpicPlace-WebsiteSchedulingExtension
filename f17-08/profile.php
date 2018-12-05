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

      //include to access the session variables
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
      
      <h1 class="text-center">
         First Name: 
         <?php
            echo $login_firstname;
         ?>
         <br>
         Last Name:
         <?php
            echo $login_lastname;
         ?>
         <br>
         Occupation:
         <?php
            echo $login_occupation;
         ?>
         <br>
         Description:
         <?php
            echo $login_description;
         ?>
         <br>
         Account Registration Date:
         <?php
            echo $login_regdate;
         ?>
      </h1>
   <!-- Scripts -->
   <?php include('components/scripts.php'); ?>
        
   </body>
</html>