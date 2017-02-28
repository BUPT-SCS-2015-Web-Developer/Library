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

	
	/**
	 * 配置文件
	 */
	include('config.php');

	/**
	 * 站内应用需要使用AppID、AppSecret和应用入口地址初始化
	 *
	 */
	$api = YBOpenApi::getInstance()->init($cfg['appID'], $cfg['appSecret'], $cfg['callback']);
	
	if (empty($_SESSION['token'])) {
		if (!isset($_REQUEST['verify_request']) || empty($_REQUEST['verify_request'])) {
			header('location: ' . $cfg['callback']);
		} else {
			try
			{
				/**
				* 调用perform()验证授权，若未授权会自动重定向到授权页面
				* 授权成功返回的数组中包含用户基本信息及访问令牌信息
				*/
				$info = $api->getFrameUtil()->perform();
				
				$_SESSION['token']	= $info['visit_oauth']['access_token'];
				$_SESSION['usrid']	= $info['visit_user']['userid'];
				$_SESSION['name']	= $info['visit_user']['username'];

				if (!empty($_SESSION['token'])) {
					header('location: ' . $cfg['display']);
				} else {
					print_r("跳转中。。。");
				}
			}
			catch (YBException $ex) {
				print_r("登陆失败");
			}
		}
	} else {
		echo "您已登陆";
		header('location: ' . $cfg['display']);
	}
?>