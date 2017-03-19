<?php
    include_once('connectDB.php');
    
    $dbh->exec("INSERT INTO `static` (`date`, `amount`) VALUES (CURRENT_DATE, '0')");
?>