<?php
header('Content-Type: application/json');
require __DIR__ . '/conexion.php';

$data = json_decode(file_get_contents('php://input'), true);
$id   = intval($data['id_u'] ?? 0);
if (!$id) { echo json_encode(['error' => 'ID inválido']); exit; }

$stmt = $pdo->prepare("
  UPDATE usuario SET
    tipo_documento_u  = ?,
    documento_u       = ?,
    nombre_u          = ?,
    apellido_u        = ?,
    fecha_nacimiento_u= ?,
    rh_u              = ?,
    correo_u          = ?,
    telefono_u        = ?
  WHERE id_u = ?
");

$ok = $stmt->execute([
  $data['tipo_documento_u'],
  $data['documento_u'],
  $data['nombre_u'],
  $data['apellido_u'],
  $data['fecha_nacimiento_u'],
  $data['rh_u'],
  $data['correo_u'],
  $data['telefono_u'],
  $id
]);

echo json_encode(['success' => $ok]);