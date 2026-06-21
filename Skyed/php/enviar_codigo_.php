<?php
session_start();
include("conexion.php"); 
include("correo.php");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email']; 
    $codigo = rand(100000, 999999);

    $stmt = $pdo->prepare("UPDATE usuario SET codigo = ? WHERE correo_u = ?");

    $stmt->execute([$codigo, $email]);

    if ($stmt->rowCount() > 0) {
        $_SESSION['email'] = $email; 
        enviarCodigo($email, $codigo);
        header("Location: verificar.php");
        exit();
    } else {
        echo "Error: Este correo no está registrado en el sistema.";
    }
}
?>