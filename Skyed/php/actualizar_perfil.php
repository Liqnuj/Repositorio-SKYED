<?php
session_start();
header('Content-Type: application/json');
require __DIR__ . '/conexion.php';

if (!isset($_SESSION['email'])) {
    echo json_encode(['ok' => false, 'error' => 'No hay sesión activa']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$email_actual = $_SESSION['email'];

try {
    $sql = "UPDATE usuario SET 
                nombre_u = ?, 
                apellido_u = ?, 
                telefono_u = ?
            WHERE correo_u = ?";
            
    $stmt = $pdo->prepare($sql);
    $exito = $stmt->execute([
        $data['nombre'],
        $data['apellido'],
        $data['telefono'],
        $email_actual
    ]);

    if ($exito) {
        echo json_encode(['ok' => true, 'mensaje' => 'Perfil actualizado correctamente']);
    } else {
        echo json_encode(['ok' => false, 'error' => 'No se pudieron guardar los cambios']);
    }

} catch (PDOException $e) {
    echo json_encode(['ok' => false, 'error' => 'Error BD: ' . $e->getMessage()]);
}
?>