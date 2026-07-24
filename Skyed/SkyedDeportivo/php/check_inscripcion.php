<?php
// php/check_inscripcion.php — verifica si el usuario en sesión ya está inscrito a un evento
header('Content-Type: application/json');
ini_set('session.cookie_path', '/GitSkyed/Repositorio-SKYED/');
session_start();
require __DIR__ . '/../../conexion.php';

$sessionUserId = $_SESSION['usuario_id'] ?? $_SESSION['user_id'] ?? null;
if (empty($sessionUserId)) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'No autenticado']);
    exit;
}

$usuario_id = (int)$sessionUserId;
$evento_id  = (int)($_GET['evento_id'] ?? 0);

if ($evento_id <= 0) {
    echo json_encode(['ok' => false, 'error' => 'Evento inválido']);
    exit;
}

try {
    // Consultar la tabla principal de inscripciones (singular): `inscripcion`
    $stmt = $pdo->prepare(
        "SELECT i.id_i AS id,
                CONCAT('INS-', LPAD(i.id_i, 6, '0')) AS ref_id,
                i.estado_i AS estado
         FROM inscripcion i
         WHERE i.id_u = ? AND i.id_e = ? AND i.estado_i != 'cancelada'
         LIMIT 1"
    );
    $stmt->execute([$usuario_id, $evento_id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        echo json_encode([
            'ok'       => true,
            'inscrito' => true,
            'id'       => $row['id'],
            'ref_id'   => $row['ref_id'],
            'estado'   => $row['estado'],
        ]);
    } else {
        echo json_encode(['ok' => true, 'inscrito' => false]);
    }
} catch (PDOException $e) {
    // Si la tabla aún no existe o hay otro error, asumimos que no está inscrito
    echo json_encode(['ok' => true, 'inscrito' => false, 'debug' => $e->getMessage()]);
}
