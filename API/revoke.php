<?php
	/**
	 * 轻应用通过IFrame方式在易班开放平台中接入显示
	 * 所以不能直接在浏览器打开本地地址进入浏览
	 * 而是打开易班管理中心中对应站内应用的网站地址进行浏览
	 *
	 * SDK中的方式会检测是否有易班开放平台提供的参数，若无则会抛出异常
	 */


	/**
	 * 包含SDK
	 */
	require("classes/yb-globals.inc.php");
	
	session_start();
    print_r($_SESSION);

	
	/**
	 * 配置文件
	 */
	include('config.php');

	/**
	 * 站内应用需要使用AppID、AppSecret和应用入口地址初始化
	 *
	 */
	$api = YBOpenApi::getInstance()->init($cfg['appID'], $cfg['appSecret'], $cfg['callback']);
	
	if (!empty($_SESSION['token'])) {
        $api->bind($_SESSION['token']);
        $result = $api->getAuthorize()->revoke();
        $_SESSION['token'] = '';
        print_r($result);
        echo "您已退出登陆2";
	}
    echo "您已退出登陆";
?>