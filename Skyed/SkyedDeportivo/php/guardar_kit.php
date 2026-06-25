<?php
header('Content-Type: application/json');
session_start();
require __DIR__ . '/conexion.php';

if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'adminDeportivo') {
    echo json_encode(['ok' => false, 'error' => 'No autorizado']); exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$nombre   = trim($data['nombre_kit']     ?? '');
$stock    = intval($data['stock']        ?? 0);
$fecha    = trim($data['fecha_entrega']  ?? '');
$lugar    = trim($data['lugar_entrega']  ?? '');
$contenido= trim($data['contenido_kit']  ?? '');
$talla    = trim($data['talla_camiseta'] ?? '');
$dorsal   = intval($data['numero_dorsal']?? 0);

if (!$nombre || $stock < 0) {
    echo json_encode(['ok' => false, 'error' => 'Faltan campos obligatorios']); exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO kit (nombre_k, stock_k, fecha_entrega_k, lugar_entrega_k, contenido_k, talla_camiseta_k, numero_dorsal_k)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $ok = $stmt->execute([$nombre, $stock, $fecha ?: null, $lugar, $contenido, $talla, $dorsal ?: null]);
    echo json_encode(['ok' => (bool)$ok, 'id' => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}