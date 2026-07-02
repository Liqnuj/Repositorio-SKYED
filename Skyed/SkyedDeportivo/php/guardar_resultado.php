<?php
header('Content-Type: application/json');
session_start();
require __DIR__ . '/conexion.php';

if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'adminDeportivo') {
    echo json_encode(['ok' => false, 'error' => 'No autorizado']); exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$tiempo_final          = trim($data['tiempo_final']           ?? '');
$posicion_general      = intval($data['posicion_general']     ?? 0);
$posicion_categoria    = intval($data['posicion_categoria']   ?? 0);
$estado                = trim($data['estado']                 ?? '');

if (!$tiempo_final || !$estado) {
    echo json_encode(['ok' => false, 'error' => 'Faltan campos obligatorios']); exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO resultado (tiempo_final_r, posicion_general_r, posicion_categoria_r, estado_r)
        VALUES (?, ?, ?, ?)
    ");
    $ok = $stmt->execute([$tiempo_final, $posicion_general ?: null, $posicion_categoria ?: null, $estado]);
    echo json_encode(['ok' => (bool)$ok, 'id' => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}