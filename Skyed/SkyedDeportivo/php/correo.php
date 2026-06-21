<?php
require __DIR__ . '/../PHPMailer/src/Exception.php';
require __DIR__ . '/../PHPMailer/src/PHPMailer.php';
require __DIR__ . '/../PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function enviarCodigo($correo, $codigo) {
    $mail = new PHPMailer(true);

    try {
        $mail->CharSet = 'UTF-8';
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;

        $mail->Username = 'yisethsara094@gmail.com';
        $mail->Password = 'jsqu omdu xcpd dvah'; 
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('yisethsara094@gmail.com', 'SKYED');
        $mail->addAddress($correo);

        $mail->isHTML(true);
        $mail->Subject = 'Código de verificación';

        $mail->AddEmbeddedImage(__DIR__ . '/../img/logo.png', 'logo_skyed');

        $mail->Body = '
        <div style="background:#f4f4f4; padding:40px; font-family:Arial;">
            <div style="max-width:600px; background:white; margin:auto; padding:30px; border-radius:10px; text-align:center;">
                <img src="cid:logo_skyed" width="180">
                <h2>Recuperación de contraseña</h2>
                <p>Tu código de verificación es:</p>
                <div style="background:#1a6fa0; color:white; display:inline-block; padding:15px 25px; font-size:32px; border-radius:8px; letter-spacing:5px; margin:20px 0;">
                    '.$codigo.'
                </div>
                <p style="color:#888; font-size:14px;">No compartas este código con nadie.</p>
            </div>
        </div>';

        $mail->send();
    } catch (Exception $e) {
        error_log("Error de PHPMailer: " . $mail->ErrorInfo);
    }
}
?>