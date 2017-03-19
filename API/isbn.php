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

        $stmt = $dbh->prepare("SELECT * FROM `book` WHERE `isbn` = :isbn");
        $stmt->bindParam(":isbn", $_GET['isbn']);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row === false) {
            throw new Exception('No data.');
        }
        $data['books'][0] = $row;
        $data['books'][0]['images']['small'] = $row['smallimage'];
        $data['books'][0]['images']['large'] = $row['largeimage'];
        $data['books'][0]['images']['medium'] = $row['mediumimage'];

        $stmt = $dbh->prepare("SELECT `author` FROM `author` WHERE `isbn` = :isbn");
        $stmt->bindParam(":isbn", $_GET['isbn']);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach($rows as $row) {
            $data['books'][0]['author'][] = $row['author'];
        }

        $stmt = $dbh->prepare("SELECT `tag` FROM `tags` WHERE `isbn` = :isbn");
        $stmt->bindParam(":isbn", $_GET['isbn']);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach($rows as $row) {
            $data['books'][0]['tags'][] = $row['tag'];
        }

        $dbh->commit();
        print(json_encode($data, JSON_UNESCAPED_UNICODE));
    } catch (Exception $e) {
        $dbh->rollBack();
        print('{"result":"fail"}');
    }
?>