<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        
      <!-- Title And URL Icon -->
      <link rel="icon" type="image/png" href="../assets/logo.png"/>
		<title>One Epic Place - View Booked Rooms</title>

      <!-- CSS Sheets -->
      <!-- Bootstrap -->
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
      <!-- Home Made CSS Sheets -->
      <link rel="stylesheet" href="css/stylesheet.css">

      <!-- Fonts -->
      <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
		<link href="https://fonts.googleapis.com/css?family=Playfair+Display" rel="stylesheet"> 
		<link href="https://fonts.googleapis.com/css?family=Quicksand" rel="stylesheet"> 
 <style>
  table {
   border-collapse: collapse;
   width: 100%;
   color: #588c7e;
   font-family: monospace;
   font-size: 25px;
   text-align: left;
     } 
  th {
   background-color: #588c7e;
   color: white;
    }
  tr:nth-child(even) {background-color: #f2f2f2}
 </style>
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
 <table>
 <tr>
  <th>Room</th> 
  <th>Start Time</th> 
  <th>End Time</th>
  <th>Date</th>
 </tr>
 <?php
  $sql = "SELECT bookedroom, starttime, endtime, thedate FROM booking";
  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
   // output data of each row
   while($row = $result->fetch_assoc()) {
    echo "<tr><td>" . $row["bookedroom"]. "</td><td>" . $row["starttime"] . "</td><td>"
. $row["endtime"]. "</td><td>" . $row["thedate"] . "</td></tr>";
}
echo "</table>";
} else { echo "0 results"; }
$conn->close();
?>
</table>
</body>
</html>