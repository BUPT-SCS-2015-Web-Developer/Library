<?php
	/**
	 * 例子使用 站内应用 与 网站接入 方式测试
	 * 对应的 AppID 与 AppSecret 可以登录易班开放平台（http://open.yiban.cn）
	 * 从 管理中心 中取得，具体可以查看 https://open.yiban.cn/wiki/index.php?page=%E6%96%B0%E6%89%8B%E5%BC%95%E5%AF%BC
	 *
	 * 站内应用与轻应用接入方式一致
	 *
	 * AppID 与 AppSecret 都是 32位字符串
	 */

	$cfg = array(
		'appID'		=> 'af73262d17bf455c',
		'appSecret'	=> '158a54eabf0de2f4cad70cd336133d7e',
		'callback'	=> 'http://f.yiban.cn/iapp96133',		// 站内应用这里的 callback 是管理中心里看到的“站内地址”
		'display'   => 'http://linkin.local/Library/main.html'			// 这里是浏览器显示的地址
	);
?>