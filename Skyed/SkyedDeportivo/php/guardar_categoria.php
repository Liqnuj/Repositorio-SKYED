<?php
header('Content-Type: application/json');
session_start();
require __DIR__ . '/conexion.php';

if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'adminDeportivo') {
    echo json_encode(['ok' => false, 'error' => 'No autorizado']); exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$nombre      = trim($data['nombre_categoria'] ?? '');
$id_evento   = intval($data['id_evento']      ?? 0);
$edad_min    = intval($data['edad_min']        ?? 0);
$edad_max    = intval($data['edad_max']        ?? 0);
$genero      = trim($data['genero']            ?? '');
$distancia   = trim($data['distancia']         ?? '');
$descripcion = trim($data['descripcion']       ?? '');

if (!$nombre || !$id_evento || !$edad_min || !$edad_max || !$genero || !$distancia || !$descripcion) {
    echo json_encode(['ok' => false, 'error' => 'Faltan campos obligatorios']); exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO categoria_competencia (nombre_cc, id_e, edad_minima_cc, edad_maxima_cc, genero_cc, distancia_cc, descripcion_cc)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $ok = $stmt->execute([$nombre, $id_evento, $edad_min, $edad_max, $genero, $distancia, $descripcion]);
    echo json_encode(['ok' => (bool)$ok, 'id' => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}