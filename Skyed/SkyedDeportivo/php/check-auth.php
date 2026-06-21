<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'ok' => true,
        'loggedin' => true,
        'usuario' => [
            'id' => $_SESSION['user_id'],
            'nombre' => $_SESSION['nombre'] ?? '',
            'email' => $_SESSION['email'] ?? '',
            'rol' => $_SESSION['rol'] ?? 'participante',
            'telefono' => $_SESSION['telefono'] ?? '',
            'fechaNac' => $_SESSION['fecha_nacimiento'] ?? '',
            'documento' => $_SESSION['documento'] ?? ''
        ]
    ]);
} else {
    echo json_encode([
        'ok' => true,
        'loggedin' => false
    ]);
}
?>
