<?php
    session_start();
	
    function notAuthorized() {
        print('{"result": "forbidden"}');
        die();
    }

    if (!$_SESSION['canReturn']) {
        notAuthorized();
    }

    include_once('connectDB.php');

    try {
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $dbh->beginTransaction();

        $stmt = $dbh->prepare("SELECT * FROM `borrow` WHERE `bookUID` = :bookUID AND returnDate = 0");
        $stmt->bindParam(":bookUID", $_GET['bookUID']);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            throw new Exception('Not Borrowed.');
        }
        $borrowID = $row['id'];

        $stmt = $dbh->prepare("UPDATE `borrow` SET `returnDate` = CURRENT_DATE WHERE `borrow`.`id` = :borrowID");
        $stmt->bindParam(":borrowID", $borrowID);
        $stmt->execute();

        $dbh->commit();
        print('{"result":"succeed"}');
    } catch (Exception $e) {
        $dbh->rollBack();
        print('{"result":"fail"}');
    }
?>