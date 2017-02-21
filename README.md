# 北邮易班工作站图书管理系统

## 部署说明

1. 在易班申请请应用，获取appID，appSecret，callbackURL，填写部署URL。
1. 在API/config.php中设置信息。
    
    ```PHP
    <?php
        $cfg = array(
            'appID'		=> '****************',
            'appSecret'	=> '*******************************',
            'callback'	=> 'http://f.yiban.cn/iapp*****',		// 管理中心里看到的“站内地址”
            'display'   => 'http://******'			            // 这里是部署URL;
    ?>
    ```

1. 在js/main.js中修改`app.config`。

    ```JavaScript
    app.config = {
        domain = 'xxxx.xxxx.xxx/xxxx/',
        protocal = 'https'
    }
    ```
