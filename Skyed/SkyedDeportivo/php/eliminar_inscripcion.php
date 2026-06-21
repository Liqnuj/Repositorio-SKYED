<?php
// php/eliminar_inscripcion.php — elimina una inscripción del usuario en sesión
header('Content-Type: application/json');
session_start();
require __DIR__ . '/conexion.php';

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'No autenticado']);
    exit;
}

$usuario_id = (int)$_SESSION['user_id'];

$d = json_decode(file_get_contents('php://input'), true) ?: $_POST;

$id     = (int)($d['id'] ?? 0);
$ref_id = trim($d['ref_id'] ?? '');

if ($id <= 0 && $ref_id === '') {
    echo json_encode(['ok' => false, 'error' => 'Inscripción inválida']);
    exit;
}

try {
    // Verificar que la inscripción exista y pertenezca al usuario en sesión
    if ($id > 0) {
        $stmt = $pdo->prepare("SELECT id, usuario_id FROM inscripciones WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
    } else {
        $stmt = $pdo->prepare("SELECT id, usuario_id FROM inscripciones WHERE ref_id = ? LIMIT 1");
        $stmt->execute([$ref_id]);
    }
    $row = $stmt->fetch();

    if (!$row) {
        echo json_encode(['ok' => false, 'error' => 'La inscripción no existe']);
        exit;
    }

    if ((int)$row['usuario_id'] !== $usuario_id) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'No tienes permiso para eliminar esta inscripción']);
        exit;
    }

    // Eliminar definitivamente la inscripción
    $del = $pdo->prepare("DELETE FROM inscripciones WHERE id = ? AND usuario_id = ?");
    $del->execute([$row['id'], $usuario_id]);

    echo json_encode(['ok' => true, 'id' => $row['id']]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Error BD: ' . $e->getMessage()]);
}
