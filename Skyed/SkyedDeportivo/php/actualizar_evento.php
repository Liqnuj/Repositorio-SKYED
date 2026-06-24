<?php
header('Content-Type: application/json');
session_start();
require __DIR__ . '/conexion.php';

if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'adminDeportivo') {
    echo json_encode(['ok' => false, 'error' => 'No autorizado']); exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$id          = intval($data['id_e']               ?? 0);
$nombre      = trim($data['nombre_e']             ?? '');
$categoria   = trim($data['categoria_e']          ?? '');
$fecha       = trim($data['fecha_e']              ?? '');
$hora        = trim($data['hora_e']               ?? '');
$ubicacion   = trim($data['ubicacion_e']          ?? '');
$descripcion = trim($data['descripcion_e']        ?? '') ?: 'Sin descripción';
$requisitos  = trim($data['requisitos_e']         ?? '') ?: 'Sin requisitos';
$imagen      = trim($data['imagen_e']             ?? '') ?: 'img/events/default.jpg';
$cupos       = intval($data['cupos_disponibles_e'] ?? 0);
$estado      = trim($data['estado_e']             ?? 'activo');

if (!$id || !$nombre || !$categoria || !$fecha || !$hora || !$ubicacion) {
    echo json_encode(['ok' => false, 'error' => 'Faltan campos obligatorios']); exit;
}

if (preg_match('/^data:(image\/[a-zA-Z0-9.+-]+);base64,/', $imagen)) {
    $parts   = explode(',', $imagen, 2);
    $mime    = preg_replace('/^data:(image\/[a-zA-Z0-9.+-]+);base64$/', '$1', $parts[0]);
    $ext     = match($mime) { 'image/png'=>'png','image/webp'=>'webp','image/gif'=>'gif', default=>'jpg' };
    $decoded = base64_decode($parts[1] ?? '');
    if ($decoded !== false) {
        $dir      = __DIR__ . '/../img/events';
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $filename = 'evento_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
        file_put_contents($dir . '/' . $filename, $decoded);
        $imagen = 'img/events/' . $filename;
    }
}

try {
    $stmt = $pdo->prepare("
        UPDATE eventoDeportivo SET
            nombre_e = ?, categoria_e = ?, fecha_e = ?, hora_e = ?,
            ubicacion_e = ?, descripcion_e = ?, requisitos_e = ?,
            imagen_e = ?, cupos_disponibles_e = ?, estado_e = ?
        WHERE id_e = ?
    ");
    $ok = $stmt->execute([$nombre, $categoria, $fecha, $hora, $ubicacion,
                          $descripcion, $requisitos, $imagen, $cupos, $estado, $id]);
    echo json_encode(['ok' => (bool)$ok]);
} catch (PDOException $e) {
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}