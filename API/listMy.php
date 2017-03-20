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

        $stmt = $dbh->prepare("SELECT `isbn`, 30 - DATEDIFF(CURRENT_DATE, `date`) AS rest FROM `borrow` WHERE `userID` = :userID AND `returnDate` = 0");
        $stmt->bindParam(":userID", $_SESSION['usrid']);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $data['books'] = array();
        foreach ($rows as $borrowRow) {
            $isbn = $borrowRow['isbn'];
            $dataRow = array();
            
            $stmt = $dbh->prepare("SELECT * FROM `book` WHERE `isbn` = :isbn");
            $stmt->bindParam(":isbn", $isbn);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row === false) {
                throw new Exception('No data.');
            }
            $dataRow = $row;
            $dataRow['images']['small'] = $row['smallimage'];
            $dataRow['images']['large'] = $row['largeimage'];
            $dataRow['images']['medium'] = $row['mediumimage'];

            $stmt = $dbh->prepare("SELECT `author` FROM `author` WHERE `isbn` = :isbn");
            $stmt->bindParam(":isbn", $isbn);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach($rows as $row) {
                $dataRow['author'][] = $row['author'];
            }

            $stmt = $dbh->prepare("SELECT `tag` FROM `tags` WHERE `isbn` = :isbn");
            $stmt->bindParam(":isbn", $isbn);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach($rows as $row) {
                $dataRow['tags'][] = $row['tag'];
            }

            $dataRow['rest'] = $borrowRow['rest'];

            $data['books'][] = $dataRow;
        }

        
        $dbh->commit();
        print(json_encode($data, JSON_UNESCAPED_UNICODE));
    } catch (Exception $e) {
        $dbh->rollBack();
        print('{"result":"fail"}');
    }
?>