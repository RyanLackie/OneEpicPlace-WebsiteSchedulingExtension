<!-- Alert -->
<div class="alert alert-danger alert-dismissible fade show alert-email" role="alert">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
    <strong>Error</strong> Email already in use.
</div>

<?php
    include('../php_methods/session.php');
    $_SESSION['email_error'] = false;
?>