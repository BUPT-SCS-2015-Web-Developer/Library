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

    try {
        $dbh = new PDO("mysql:host={$cfg['host']};dbname={$cfg['dbName']}", $cfg['user'], $cfg['pwd'], [PDO::ATTR_PERSISTENT => true, PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"]);
    } catch (PDOExveption $e) {
        print('{"result":"Database Fatal"');
        die();
    }

    $stmt = $dbh->prepare("SELECT isAdmin FROM user WHERE userID = :userID");
    $stmt->bindParam(':userID', $user['info']['yb_userid']);
    $stmt->execute();
    $isAdmin = $stmt->fetch();
    if ($isAdmin) {
        $data['isAdmin'] = true;
    }

    print(json_encode($data));
?>