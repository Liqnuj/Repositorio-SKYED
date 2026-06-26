<?php
header('Content-Type: application/json');
session_start();
require __DIR__ . '/conexion.php';

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'No autenticado']);
    exit;
}

$id_u = (int)$_SESSION['user_id'];
$d    = json_decode(file_get_contents('php://input'), true) ?: $_POST;

// Aceptar id_i, id o ref_id
$id_i   = (int)($d['id_i'] ?? $d['id'] ?? 0);
$ref_id = trim($d['ref_id'] ?? '');

if ($id_i <= 0 && $ref_id === '') {
    echo json_encode(['ok' => false, 'error' => 'Inscripción inválida']);
    exit;
}

try {
    // Buscar la inscripción
    if ($id_i > 0) {
        $stmt = $pdo->prepare("SELECT id_i, id_u FROM inscripcion WHERE id_i = ? LIMIT 1");
        $stmt->execute([$id_i]);
    } elseif (preg_match('/(\d+)/', $ref_id, $m)) {
        // ref_id tipo "INS-000006" → extraer número
        $stmt = $pdo->prepare("SELECT id_i, id_u FROM inscripcion WHERE id_i = ? LIMIT 1");
        $stmt->execute([(int)$m[1]]);
    } else {
        echo json_encode(['ok' => false, 'error' => 'Referencia inválida']);
        exit;
    }
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        echo json_encode([
            'ok'    => false,
            'error' => 'La inscripción no existe',
            '_debug'=> ['id_i_buscado' => $id_i, 'ref_buscado' => $ref_id, 'recibido' => $d]
        ]);
        exit;
    }

    if ((int)$row['id_u'] !== $id_u) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'No tienes permiso para cancelar esta inscripción']);
        exit;
    }

    // Soft-delete: cambiar estado a 'cancelada'
    $pdo->prepare("UPDATE inscripcion SET estado_i = 'cancelada' WHERE id_i = ? AND id_u = ?")
        ->execute([$row['id_i'], $id_u]);

    // Cancelar QR asociado
    try {
        $pdo->prepare("UPDATE qr_entrada SET estado_qr = 'cancelado' WHERE id_i = ?")
            ->execute([$row['id_i']]);
    } catch (PDOException $e) { /* ignorar */ }

    echo json_encode(['ok' => true, 'id_i' => $row['id_i'], 'id' => $row['id_i']]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Error BD: ' . $e->getMessage()]);
}
?>