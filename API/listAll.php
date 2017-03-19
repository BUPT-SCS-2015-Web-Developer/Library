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

    if (!$_SESSION['isAdmin']) {
        notAuthorized();
    }

    include_once('connectDB.php');

    $data = array();
    $data['result'] = "succeed";

    try {
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $dbh->beginTransaction();

        $stmt = $dbh->prepare("SELECT bookUID, title, name AS borrower, date AS borrowDate, DATE_ADD(date,INTERVAL 30 DAY) AS dueDate FROM `borrow`, `book` WHERE `returnDate` = 0 AND `book`.`isbn` = `borrow`.`isbn`");
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $data['data'] = array();
        foreach ($rows as $row) {
            $data['data'][] = $row;
        }
        
        $dbh->commit();
        print(json_encode($data, JSON_UNESCAPED_UNICODE));
    } catch (Exception $e) {
        $dbh->rollBack();
        print('{"result":"fail"}');
    }
?>