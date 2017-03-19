<?php
    $isbn = $_GET['isbn13'];
    $url='https://api.douban.com/v2/book/isbn/'.$isbn;
    $re=file_get_contents($url);
    print_r($re);
?>