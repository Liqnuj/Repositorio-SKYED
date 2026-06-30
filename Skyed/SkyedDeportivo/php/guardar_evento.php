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
$descripcion= trim($data['descripcion_e']       ?? '') ?: 'Sin descripción';
$requisitos = trim($data['requisitos_e']        ?? '') ?: 'Sin requisitos';
$imagen     = trim($data['imagen_e']            ?? '') ?: 'default.jpg';
$cupos      = intval($data['cupos_disponibles_e']?? 0);
$estado     = trim($data['estado_e']            ?? 'activo');

if (!$nombre || !$categoria || !$fecha || !$hora || !$ubicacion) {
    echo json_encode(['ok' => false, 'error' => 'Faltan campos obligatorios']); exit;
}

try {
    if (preg_match('/^data:(image\/[a-zA-Z0-9.+-]+);base64,/', $imagen)) {
        $parts = explode(',', $imagen, 2);
        $meta = $parts[0];
        $data64 = $parts[1] ?? '';
        $mime = preg_replace('/^data:(image\/[a-zA-Z0-9.+-]+);base64$/', '$1', $meta);
        $ext = 'jpg';
        switch ($mime) {
            case 'image/png': $ext = 'png'; break;
            case 'image/webp': $ext = 'webp'; break;
            case 'image/gif': $ext = 'gif'; break;
            case 'image/svg+xml': $ext = 'svg'; break;
            case 'image/jpeg':
            default: $ext = 'jpg'; break;
        }
        $decoded = base64_decode($data64);
        if ($decoded !== false) {
            $dir = __DIR__ . '/../img/events';
            if (!is_dir($dir)) mkdir($dir, 0755, true);
            $filename = 'evento_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
            $fullpath = $dir . '/' . $filename;
            file_put_contents($fullpath, $decoded);
            $imagen = 'img/events/' . $filename;
        } else {
            $imagen = 'default.jpg';
        }
    }

    $stmt = $pdo->prepare("
        INSERT INTO eventoDeportivo 
            (nombre_e, categoria_e, fecha_e, hora_e, ubicacion_e, descripcion_e, requisitos_e, imagen_e, cupos_disponibles_e, estado_e)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $ok = $stmt->execute([$nombre, $categoria, $fecha, $hora, $ubicacion, $descripcion, $requisitos, $imagen, $cupos, $estado]);
    $lastId = $pdo->lastInsertId();
    echo json_encode([
        'ok' => (bool)$ok,
        'id' => $lastId,
        'evento' => [
            'id_e' => $lastId,
            'nombre_e' => $nombre,
            'categoria_e' => $categoria,
            'fecha_e' => $fecha,
            'hora_e' => $hora,
            'ubicacion_e' => $ubicacion,
            'descripcion_e' => $descripcion,
            'requisitos_e' => $requisitos,
            'imagen_e' => $imagen,
            'cupos_disponibles_e' => $cupos,
            'estado_e' => $estado,
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}