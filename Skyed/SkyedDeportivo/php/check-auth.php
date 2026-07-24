<?php
ini_set('session.cookie_path', '/GitSkyed/Repositorio-SKYED/');
session_start();
header('Content-Type: application/json');

$sessionUserId = $_SESSION['usuario_id'] ?? $_SESSION['user_id'] ?? null;
if ($sessionUserId) {
    echo json_encode([
        'ok' => true,
        'loggedin' => true,
        'usuario' => [
            'id' => $sessionUserId,
            'nombre' => $_SESSION['nombre'] ?? '',
            'email' => $_SESSION['email'] ?? '',
            'rol' => $_SESSION['rol_actual'] ?? 'participante',
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
