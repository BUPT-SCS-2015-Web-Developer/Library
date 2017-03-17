<?php
    require("classes/yb-globals.inc.php");
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

    $api = YBOpenApi::getInstance()->init($cfg['appID'], $cfg['appSecret'], $cfg['callback']);
	$api = YBOpenApi::getInstance()->bind($_SESSION['token']);

    $user = $api->getUser()->me();
    if ($user['status'] != 'success') {
        notAuthorized();
    }

    $data = array(
        'result' => 'succeed',
        'userID' => $user['info']['yb_userid'],
        'userName' => $user['info']['yb_username'],
        'userPic'  => $user['info']['yb_userhead'],
        'isAdmin'  => false
    );
    $_SESSION['isAdmin'] = false;
    $_SESSION['canReturn'] = false;
    $_SESSION['banBorrow'] = false;

    include_once('connectDB.php');

    $stmt = $dbh->prepare("SELECT isAdmin, canReturn, banBorrow FROM user WHERE userID = :userID");
    $stmt->bindParam(':userID', $user['info']['yb_userid']);
    $stmt->execute();
    $result = $stmt->fetch();
    if ($result) {
        if ($result['isAdmin']) {
            $data['isAdmin'] = true;
            $_SESSION['isAdmin'] = true;
        }
        if ($result['canReturn']) {
            $_SESSION['canReturn'] = true;
        }
        if ($result['banBorrow']) {
            $_SESSION['banBorrow'] = true;
        }
    }

    print(json_encode($data));
?>