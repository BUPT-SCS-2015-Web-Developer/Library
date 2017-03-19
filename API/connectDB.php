<?php
    include_once('config.php');
    try {
        $dbh = new PDO("mysql:host={$cfg['host']};dbname={$cfg['dbName']}", $cfg['user'], $cfg['pwd'], [PDO::ATTR_PERSISTENT => true, PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"]);
    } catch (PDOExveption $e) {
        print('{"result":"Database Fatal"');
        die();
    }
?>