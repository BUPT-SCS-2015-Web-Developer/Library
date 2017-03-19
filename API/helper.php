<?php

    function file_get_content($url) {
        //if (function_exists('file_get_contents')) {
        //    $file_contents = @file_get_contents($url);
        //}
        //if ($file_contents == ”) {
            $ch = curl_init();
            $timeout = 30;
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            $file_contents = curl_exec($ch);
            curl_close($ch);
        //}
    return $file_contents;
    }

    $isbn = $_GET['isbn13'];
    $url='https://api.douban.com/v2/book/isbn/'.$isbn;
    $re=file_get_content($url);

    header('Content-Type: application/json');
    print_r($re);
?>