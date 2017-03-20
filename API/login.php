<?php
    session_start();
	
    function notAuthorized() {
        print('{"result": "forbidden"}');
        die();
    }

	if (empty($_GET['token']))
	{
		notAuthorized();
	}

    $_SESSION['token'] = $_GET['token'];
    $_SESSION['isAdmin'] = false;
    $_SESSION['canReturn'] = false;
    $_SESSION['banBorrow'] = false;

    include_once('connectDB.php');

    $stmt = $dbh->prepare("SELECT isAdmin, canReturn, banBorrow FROM user WHERE userID = :userID");
    $stmt->bindParam(':userID', $_SESSION['token']);
    $stmt->execute();
    $result = $stmt->fetch();
    if ($result) {
        if ($result['isAdmin']) {
            $_SESSION['isAdmin'] = true;
        }
        if ($result['canReturn']) {
            $_SESSION['canReturn'] = true;
            print('{"result": "succeed"}');
        }
        if ($result['banBorrow']) {
            $_SESSION['banBorrow'] = true;
        }
    } else {
        print('{"result": "forbidden"}');
    }
?>