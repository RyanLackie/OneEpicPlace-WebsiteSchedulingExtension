<!-- Welcome a user -->
<?php
    session_start();
?>
<h1 class="text-center">
    Welcome: 
    <?php
        echo $login_firstname;
    ?>
</h1>