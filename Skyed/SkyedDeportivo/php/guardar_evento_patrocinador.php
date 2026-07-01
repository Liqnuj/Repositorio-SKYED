<?php
header('Content-Type: application/json');
session_start();
require __DIR__ . '/conexion.php';

if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'adminDeportivo') {
    echo json_encode(['ok' => false, 'error' => 'No autorizado']); exit;
}

$data              = json_decode(file_get_contents('php://input'), true);
$id                = intval($data['id_ep']            ?? 0);
$patrocinador_id_p = intval($data['patrocinador_id_p'] ?? 0);
$evento_id_e       = intval($data['evento_id_e']       ?? 0);
$detalle           = trim($data['detalle']             ?? '');

if (!$patrocinador_id_p || !$evento_id_e) {
    echo json_encode(['ok' => false, 'error' => 'Selecciona patrocinador y evento']); exit;
}

try {
    if ($id) {
        $stmt = $pdo->prepare("
            UPDATE evento_patrocinador SET
                patrocinador_id_p = ?, evento_id_e = ?, detalle = ?
            WHERE id_ep = ?
        ");
        $ok = $stmt->execute([$patrocinador_id_p, $evento_id_e, $detalle, $id]);
    } else {
        $stmt = $pdo->prepare("
            INSERT INTO evento_patrocinador (patrocinador_id_p, evento_id_e, detalle)
            VALUES (?, ?, ?)
        ");
        $ok = $stmt->execute([$patrocinador_id_p, $evento_id_e, $detalle]);
        $id = $pdo->lastInsertId();
    }
    echo json_encode(['ok' => (bool)$ok, 'id' => $id]);
} catch (PDOException $e) {
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}