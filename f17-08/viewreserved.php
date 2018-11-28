<!DOCTYPE html>
<html>
<head>
 <title>Table with database</title>
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
 </tr>
 <?php
  $sql = "SELECT bookedroom, starttime, endtime FROM booking";
  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
   // output data of each row
   while($row = $result->fetch_assoc()) {
    echo "<tr><td>" . $row["bookedroom"]. "</td><td>" . $row["starttime"] . "</td><td>"
. $row["endtime"]. "</td></tr>";
}
echo "</table>";
} else { echo "0 results"; }
$conn->close();
?>
</table>
</body>
</html>