<?php
    // Import PHPMailer classes into the global namespace
    // These must be at the top of your script, not inside a function
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    // Путь к autoload
    require 'vendor/autoload.php';

    // Переменные
    $name = $_POST['name']; ;
    $phone = $_POST['phone']; 

    $mail = new PHPMailer(true);                            // Passing `true` enables exceptions

    // Server settings
    $mail->SMTPDebug = 2;                                   // Enable verbose debug output
    $mail->isSMTP();                                        // Set mailer to use SMTP
    $mail->Host = 'smtp.yandex.ru';                         // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                                 // Enable SMTP authentication
    $mail->Username = 'SKIF9476@yandex.ru';                 // SMTP username
    $mail->Password = 'Пароль';                       // SMTP password
    $mail->SMTPSecure = 'ssl';                              // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 465;                                      // TCP port to connect to

    // Recipients
    $mail->CharSet = 'UTF-8';
    $mail->setFrom('SKIF9476@yandex.ru', 'Mailer');          // От кого
    $mail->addAddress('SKIF9476@yandex.ru', 'Joe User');     // Кому
    $mail->addAddress('kononov-genii@mail.ru');              // Кому
    $mail->addReplyTo('info@example.com', 'Information');    // На какой адрес ответить
    $mail->addCC('kononov-genii@mail.ru');                   // Копия
    $mail->addBCC('kononov-genii@mail.ru');


    // Письмо
    $mail->isHTML(true);                                        // Формат html
    $mail->Subject = 'Тема';                                    // Тема
    $mail->Body    = "$name <br> $phone";                       // Сообщение
    $mail->AltBody = "$name";                                   // Альтернативное сообщние, если не сработало первое

    // Отправка
    $mail->send();
    
?>