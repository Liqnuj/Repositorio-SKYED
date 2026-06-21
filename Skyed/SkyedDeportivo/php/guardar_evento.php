<?php
header('Content-Type: application/json');
session_start();
require __DIR__ . '/conexion.php';

if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'adminDeportivo') {
    echo json_encode(['ok' => false, 'error' => 'No autorizado']); exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$nombre     = trim($data['nombre_e']            ?? '');
$categoria  = trim($data['categoria_e']         ?? '');
$fecha      = trim($data['fecha_e']             ?? '');
$hora       = trim($data['hora_e']              ?? '');
$ubicacion  = trim($data['ubicacion_e']         ?? '');
$descripcion= trim($data['descripcion_e']       ?? '');
$requisitos = trim($data['requisitos_e']        ?? '');
$imagen     = trim($data['imagen_e']            ?? 'default.jpg');
$cupos      = intval($data['cupos_disponibles_e']?? 0);
$estado     = trim($data['estado_e']            ?? 'activo');

if (!$nombre || !$categoria || !$fecha || !$hora || !$ubicacion) {
    echo json_encode(['ok' => false, 'error' => 'Faltan campos obligatorios']); exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO eventoDeportivo 
            (nombre_e, categoria_e, fecha_e, hora_e, ubicacion_e, descripcion_e, requisitos_e, imagen_e, cupos_disponibles_e, estado_e)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $ok = $stmt->execute([$nombre, $categoria, $fecha, $hora, $ubicacion, $descripcion, $requisitos, $imagen, $cupos, $estado]);
    echo json_encode(['ok' => $ok, 'id' => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}