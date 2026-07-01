<?php
header('Content-Type: application/json');
session_start();
require __DIR__ . '/conexion.php';

if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'adminDeportivo') {
    echo json_encode(['ok' => false, 'error' => 'No autorizado']); exit;
}

$data     = json_decode(file_get_contents('php://input'), true);
$id       = intval($data['id_k']           ?? 0);
$nombre   = trim($data['nombre_kit']       ?? '');
$stock    = intval($data['stock']          ?? 0);
$fecha    = trim($data['fecha_entrega']    ?? '');
$lugar    = trim($data['lugar_entrega']    ?? '');
$contenido= trim($data['contenido_kit']    ?? '');
$talla    = trim($data['talla_camiseta']   ?? '');
$dorsal   = intval($data['numero_dorsal']  ?? 0);

if (!$id || !$nombre || $stock < 1) {
    echo json_encode(['ok' => false, 'error' => 'Faltan campos obligatorios']); exit;
}

try {
    $stmt = $pdo->prepare("
        UPDATE kit SET
            nombre_k = ?, stock_k = ?, fecha_entrega_k = ?,
            lugar_entrega_k = ?, contenido_k = ?,
            talla_camiseta_k = ?, numero_dorsal_k = ?
        WHERE id_k = ?
    ");
    $ok = $stmt->execute([$nombre, $stock, $fecha ?: null, $lugar, $contenido, $talla, $dorsal ?: null, $id]);
    echo json_encode(['ok' => (bool)$ok]);
} catch (PDOException $e) {
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}