<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        
        <!-- Title And URL Icon -->
        <link rel="icon" type="image/png" href="assets/logo.png"/>
		<title>One Epic Place - Register</title>

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
            if ($login_session == null)
                include('components/nonuser-navbar.php');
            else
                include('components/user-navbar.php');
            
            if ($_SESSION['email_error'] == true)
                include('components/email-alert.php');
        ?>

        <!-- Register Form -->
        <div class="half-row-centered">
            <h3>Sign Up</h3>

            <!-- Choose what the submit button will do by the form "action" -->
            <form method="post" action="php_methods/register.php" method="POST" enctype="multipart/form-data">

                <div class="form-group">
                    <label for="emailInputSection" class="register-section-label">Email</label>
                    <input type="email" id="emailInputSection" name="email" class="form-control" placeholder="Enter Your Email" required autofocus>
                </div>
                
                <div class="form-group">
                    <label for="passwordInputSection" class="register-section-label">Password</label>
                    <input type="password" id="passwordInputSection" name="password" class="form-control" placeholder="Enter Your Password" required>
                </div>
                
                <div class="form-group">
                    <label for="firstNameInputSection" class="register-section-label">First Name</label>
                    <input id="firstNameInputSection" name="firstname" class="form-control" placeholder="Enter Your First Name" required>
                </div>

                <div class="form-group">
                    <label for="lastNameInputSection" class="register-section-label">Last Name</label>
                    <input id="lastNameInputSection" name="lastname" class="form-control" placeholder="Enter Your Last Name" required>
                </div>

                <div class="form-group">
                    <label for="occupationInputSection" class="register-section-label">Occupation</label>
                    <input id="occupationInputSection" name="occupation" class="form-control" placeholder="Enter What You Do">
                </div>

                <div class="form-group">
                    <label for="descriptionInputSection" class="register-section-label">Description</label>
                    <textarea id="descriptionInputSection" name="description" class="form-control" placeholder="Tell Us About Yourself"></textarea>
                </div>

                <button class="btn btn-lg btn-outline-primary" type="submit" value="Submit" name="RegisterButton">Sign Up</button>
            </form>
        </div>

        <!-- Scripts -->
        <?php include('components/scripts.php'); ?>
        
    </body>

</html>