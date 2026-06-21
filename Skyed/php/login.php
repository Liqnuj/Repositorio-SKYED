<?php
session_start();
header('Content-Type: application/json');
require __DIR__ . '/conexion.php';

$data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$email = strtolower(trim($data['email'] ?? ''));
$pass  = $data['password'] ?? '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !$pass) {
    echo json_encode(['ok'=>false,'error'=>'Datos inválidos']); exit;
}

$stmt = $pdo->prepare("SELECT id_u, nombre_u, apellido_u, correo_u, contrasena_u, rol_u, telefono_u, fecha_nacimiento_u, documento_u FROM usuario WHERE correo_u = ? LIMIT 1");
$stmt->execute([$email]);
$u = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$u || !password_verify($pass, $u['contrasena_u'])) {
    echo json_encode(['ok' => false, 'error' => 'Correo o contraseña incorrectos']);
    exit;
}

$_SESSION['user_id'] = $u['id_u'];
$_SESSION['nombre']  = $u['nombre_u'];
$_SESSION['email']   = $u['correo_u'];
$_SESSION['rol']     = $u['rol_u'];
$_SESSION['telefono'] = $u['telefono_u'] ?? '';
$_SESSION['fecha_nacimiento'] = $u['fecha_nacimiento_u'] ?? '';
$_SESSION['documento'] = $u['documento_u'] ?? '';

echo json_encode([
    'ok' => true,
    'usuario' => [
        'id' => $u['id_u'],
        'nombre' => $u['nombre_u'],
        'email' => $u['correo_u'],
        'rol' => $u['rol_u'] ?? 'participante',
        'telefono' => $u['telefono_u'] ?? '',
        'fechaNac' => $u['fecha_nacimiento_u'] ?? '',
        'documento' => $u['documento_u'] ?? '',
    ]
]);
?>