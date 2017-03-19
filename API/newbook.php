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

    if (!$_SESSION['isAdmin']) {
        notAuthorized();
    }

    include_once('connectDB.php');

    try {
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $dbh->beginTransaction();

        $stmt = $dbh->prepare("INSERT INTO `book` (`isbn`, `amount`, `location`, `pubdate`, `title`, `subtitle`, `origin_title`, `pages`, `publisher`, `alt_title`, `summary`, `price`, `smallimage`, `largeimage`, `mediumimage`) VALUES (:isbn, :amount, :location, :pubdate, :title, :subtitle, :origin_title, :pages, :publisher, :alt_title, :summary, :price, :smallimage, :largeimage, :mediumimage)");
        $stmt->bindParam(':isbn', $_POST['isbn13']);
        $stmt->bindParam(':amount', $_POST['amount']);
        $stmt->bindParam(':location', $_POST['location']);
        $stmt->bindParam(':pubdate', $_POST['pubdate']);
        $stmt->bindParam(':title', $_POST['title']);
        $stmt->bindParam(':subtitle', $_POST['subtitle']);
        $stmt->bindParam(':origin_title', $_POST['origin_title']);
        $stmt->bindParam(':pages', $_POST['pages']);
        $stmt->bindParam(':publisher', $_POST['publisher']);
        $stmt->bindParam(':alt_title', $_POST['alt_title']);
        $stmt->bindParam(':summary', $_POST['summary']);
        $stmt->bindParam(':price', $_POST['price']);
        $stmt->bindParam(':smallimage', $_POST['images']['small']);
        $stmt->bindParam(':largeimage', $_POST['images']['large']);
        $stmt->bindParam(':mediumimage', $_POST['images']['medium']);
        $stmt->execute();

        $stmt = $dbh->prepare("INSERT INTO `author` (`isbn`, `author`) VALUES (:isbn, :author)");
        foreach ($_POST['author'] as $author) {
            $stmt->bindParam(':isbn', $_POST['isbn13']);
            $stmt->bindParam(':author', $author);
            $stmt->execute();
        }

        $stmt = $dbh->prepare("INSERT INTO `tags` (`isbn`, `tag`) VALUES (:isbn, :tag)");
        foreach ($_POST['tags'] as $tag) {
            $stmt->bindParam(':isbn', $_POST['isbn13']);
            $stmt->bindParam(':tag', $tag);
            $stmt->execute();
        }

        $dbh->commit();
        print('{"result":"succeed"}');
    } catch (Exception $e) {
        $dbh->rollBack();
        print('{"result":"fail"}');
    }
?>