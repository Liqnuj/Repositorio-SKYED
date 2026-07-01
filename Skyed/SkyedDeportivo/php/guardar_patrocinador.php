<?php
header('Content-Type: application/json');
session_start();
require __DIR__ . '/conexion.php';

if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'adminDeportivo') {
    echo json_encode(['ok' => false, 'error' => 'No autorizado']); exit;
}

$data        = json_decode(file_get_contents('php://input'), true);
$id          = intval($data['id_p']                  ?? 0);
$nombre      = trim($data['nombre_p']                ?? '');
$logo        = trim($data['logo_p']                  ?? '');
if (preg_match('/^data:(image\/[a-zA-Z0-9.+-]+);base64,/', $logo)) {
    $parts   = explode(',', $logo, 2);
    $mime    = preg_replace('/^data:(image\/[a-zA-Z0-9.+-]+);base64$/', '$1', $parts[0]);
    $ext     = match($mime) { 'image/png'=>'png','image/webp'=>'webp', default=>'jpg' };
    $decoded = base64_decode($parts[1] ?? '');
    if ($decoded !== false) {
        $dir      = __DIR__ . '/../img/patrocinadores';
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $filename = 'pat_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
        file_put_contents($dir . '/' . $filename, $decoded);
        $logo = 'img/patrocinadores/' . $filename;
    }
}
$telefono    = trim($data['telefono_p']              ?? '');
$correo      = trim($data['correo_p']                ?? '');
$pagina_web  = trim($data['pagina_web_p']            ?? '');
$aporte      = trim($data['aporte_p']                ?? '');
$estado      = trim($data['estado_p']                ?? 'activo');

if (!$nombre) {
    echo json_encode(['ok' => false, 'error' => 'El nombre es obligatorio']); exit;
}

try {
    if ($id) {
        $stmt = $pdo->prepare("
            UPDATE patrocinador SET
                nombre_p = ?, logo_p = ?, telefono_p = ?,
                correo_p = ?, pagina_web_p = ?, aporte_p = ?, estado_p = ?
            WHERE id_p = ?
        ");
        $ok = $stmt->execute([$nombre, $logo, $telefono, $correo, $pagina_web, $aporte, $estado, $id]);
    } else {
        $stmt = $pdo->prepare("
            INSERT INTO patrocinador (nombre_p, logo_p, telefono_p, correo_p, pagina_web_p, aporte_p, estado_p)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $ok = $stmt->execute([$nombre, $logo, $telefono, $correo, $pagina_web, $aporte, $estado]);
        $id = $pdo->lastInsertId();
    }
    echo json_encode(['ok' => (bool)$ok, 'id' => $id]);
} catch (PDOException $e) {
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}