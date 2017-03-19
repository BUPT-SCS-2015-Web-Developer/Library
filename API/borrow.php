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

    if ($_SESSION['banBorrow']) {
        notAuthorized();
    }

    include_once('connectDB.php');

    try {
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $dbh->beginTransaction();

        $stmt = $dbh->prepare("SELECT amount FROM `book` WHERE `isbn` = :isbn");
        $isbn = substr($_GET['bookUID'], 0, 13);
        $number = intval(substr($_GET['bookUID'], 13, 1));
        $stmt->bindParam(":isbn", $isbn);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row === false) {
            throw new Exception('No data.');
        }
        if ($row['amount'] <= $number) {
            throw new Exception('Wrong UID.');
        }

        $stmt = $dbh->prepare("SELECT * FROM `borrow` WHERE `bookUID` = :bookUID AND returnDate = 0");
        $stmt->bindParam(":bookUID", $_GET['bookUID']);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            throw new Exception('Out of Stock.');
        }

        $stmt = $dbh->prepare("SELECT * FROM `borrow` WHERE `isbn` = :isbn AND `userID` = :userID AND returnDate = 0");
        $stmt->bindParam(":isbn", $isbn);
        $stmt->bindParam(":userID", $_SESSION['usrid']);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            throw new Exception('Out of Stock.');
        }

        $stmt = $dbh->prepare("INSERT INTO `borrow` (`bookUID`, `isbn`, `userID`, `name`, `date`) VALUES (:bookUID, :isbn, :userID, :name, CURRENT_DATE)");
        $stmt->bindParam(":bookUID", $_GET['bookUID']);
        $stmt->bindParam(":isbn", $isbn);
        $stmt->bindParam(":userID", $_SESSION['usrid']);
        $stmt->bindParam(":name", $_SESSION['name']);
        $stmt->execute();

        $stmt = $dbh->prepare("UPDATE `static` SET `amount` = `amount` + 1 WHERE `static`.`date` = CURRENT_DATE");
        $stmt->execute();

        $dbh->commit();
        print('{"result":"succeed"}');
    } catch (Exception $e) {
        $dbh->rollBack();
        print('{"result":"fail"}');
    }
?>