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

        if (isset($_GET['bookUID'])) {
            $stmt = $dbh->prepare("SELECT name AS borrower, date AS borrowDate, DATE_ADD(date,INTERVAL 30 DAY) AS dueDate FROM `borrow` WHERE `bookUID` = :bookUID");
            $stmt->bindParam(":bookUID", $_GET['bookUID']);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $data['data'] = array();
            foreach ($rows as $row) {
                $data['data'][] = $row;
            }
        } else if (isset($_GET['isbn'])) {
            $stmt = $dbh->prepare("SELECT name AS borrower, date AS borrowDate, DATE_ADD(date,INTERVAL 30 DAY) AS dueDate FROM `borrow` WHERE `isbn` = :isbn");
            $stmt->bindParam(":isbn", $_GET['isbn']);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $data['data'] = array();
            foreach ($rows as $row) {
                $data['data'][] = $row;
            }
        }
        
        $dbh->commit();
        print(json_encode($data, JSON_UNESCAPED_UNICODE));
    } catch (Exception $e) {
        $dbh->rollBack();
        print('{"result":"fail"}');
    }
?>