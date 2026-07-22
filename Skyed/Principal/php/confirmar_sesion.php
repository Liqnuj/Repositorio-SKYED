<?php
session_start();
header('Content-Type: application/json');

if (!empty($_SESSION['usuario_id'])) {
    echo json_encode([
        'loggedin' => true,
        'usuario' => [
            'nombre' => $_SESSION['nombre'] ?? '',
            'correo' => $_SESSION['email'] ?? '',
        ]
    ]);
} else {
    echo json_encode(['loggedin' => false]);
}