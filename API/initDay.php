<?php
    include_once('connectDB.php');
    
    $dbh->exec("INSERT INTO static SELECT (CURRENT_DATE) as date,  amount FROM static WHERE date = date_add(CURRENT_DATE, interval -1 day)");
?>