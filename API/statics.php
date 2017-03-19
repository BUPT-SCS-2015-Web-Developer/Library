<?php
    include_once('config.php');

    session_start();
	
    function notAuthorized() {
        print('{"result": "forbidden"}');
        die();
    }

	if (empty($_SESSION['token']))
	{
		notAuthorized();
	}

    include_once('connectDB.php');

    $data = array();
    $data['result'] = "succeed";

    try {
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $dbh->beginTransaction();

        $stmt = $dbh->prepare("SELECT * FROM `static` WHERE DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY) <= `date`");
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $data['data'] = $rows;

        $stmt = $dbh->prepare("SELECT amount FROM `static` WHERE `date` = CURRENT_DATE");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $data['today'] = $row['amount'];

        $dbh->commit();
        print(json_encode($data, JSON_UNESCAPED_UNICODE));
    } catch (Exception $e) {
        $dbh->rollBack();
        print('{"result":"fail"}');
    }
?>