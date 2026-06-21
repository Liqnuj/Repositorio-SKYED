<?php
// php/check_inscripcion.php — verifica si el usuario en sesión ya está inscrito a un evento
header('Content-Type: application/json');
session_start();
require __DIR__ . '/conexion.php';

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'No autenticado']);
    exit;
}

$usuario_id = (int)$_SESSION['user_id'];
$evento_id  = (int)($_GET['evento_id'] ?? 0);

if ($evento_id <= 0) {
    echo json_encode(['ok' => false, 'error' => 'Evento inválido']);
    exit;
}

try {
    // Crear tabla si no existe (para robustez, igual que en guardar_inscripcion.php)
    $pdo->exec("CREATE TABLE IF NOT EXISTS inscripciones (
        id                 INT AUTO_INCREMENT PRIMARY KEY,
        ref_id             VARCHAR(40)  NOT NULL,
        usuario_id         INT          NOT NULL,
        evento_id          INT          NOT NULL,
        estado             VARCHAR(40)  NOT NULL DEFAULT 'pendiente_validacion',
        metodo_pago        VARCHAR(40)  NOT NULL DEFAULT 'transferencia',
        precio_pagado      DECIMAL(12,2) NOT NULL DEFAULT 0,
        doc_u              VARCHAR(20)  DEFAULT NULL,
        rh_u               VARCHAR(5)   DEFAULT NULL,
        telefono_u         VARCHAR(20)  DEFAULT NULL,
        contacto_nombre    VARCHAR(100) DEFAULT NULL,
        contacto_telefono  VARCHAR(20)  DEFAULT NULL,
        fecha_nacimiento   DATE         DEFAULT NULL,
        dorsal             VARCHAR(10)  DEFAULT NULL,
        condiciones_medicas TEXT        DEFAULT NULL,
        quiere_jersey      TINYINT(1)   DEFAULT 0,
        talla_camiseta     VARCHAR(5)   DEFAULT NULL,
        id_cc              INT          DEFAULT NULL,
        qr_code            VARCHAR(100) DEFAULT NULL,
        evento_data        JSON         DEFAULT NULL,
        fecha_inscripcion  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_usuario  (usuario_id),
        INDEX idx_evento   (evento_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $stmt = $pdo->prepare("SELECT id, ref_id, estado FROM inscripciones WHERE usuario_id = ? AND evento_id = ? AND estado != 'cancelado' LIMIT 1");
    $stmt->execute([$usuario_id, $evento_id]);
    $row = $stmt->fetch();

    if ($row) {
        echo json_encode([
            'ok'       => true,
            'inscrito' => true,
            'id'       => $row['id'],
            'ref_id'   => $row['ref_id'],
            'estado'   => $row['estado'],
        ]);
    } else {
        echo json_encode(['ok' => true, 'inscrito' => false]);
    }
} catch (PDOException $e) {
    // Si la tabla aún no existe o hay otro error, asumimos que no está inscrito
    echo json_encode(['ok' => true, 'inscrito' => false, 'debug' => $e->getMessage()]);
}
