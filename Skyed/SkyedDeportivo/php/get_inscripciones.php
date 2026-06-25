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

try {
    $stmt = $pdo->prepare("
        SELECT
            i.id_i,
            i.cupo_i,
            i.estado_i,
            i.fecha_i,
            i.precio_pagado_i,
            i.contacto_emergencia_nombre,
            i.contacto_emergencia_telefono,
            i.contacto_emergencia_parentesco,
            i.id_e,
            e.nombre_e,
            e.fecha_e,
            e.ubicacion_e,
            e.categoria_e,
            e.imagen_e,
            q.id_qr,
            q.codigo_qr,
            q.qr_imagen_qr,
            q.fecha_generacion_qr,
            q.fecha_uso_qr,
            q.estado_qr,
            p.id_pago,
            p.metodo_pago_p,
            p.referencia_p,
            p.comprobante_p,
            p.monto_p,
            p.fecha_p,
            p.estado_p
        FROM inscripcion i
        LEFT JOIN eventodeportivo e ON e.id_e = i.id_e
        LEFT JOIN qr_entrada q ON q.id_i = i.id_i
        LEFT JOIN pago p ON p.id_i = i.id_i
        WHERE i.id_u = ?
        ORDER BY i.fecha_i DESC
    ");
    $stmt->execute([$id_u]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $inscripciones = array_map(function($row) {
        $img = $row['imagen_e'] ?? '';
        if ($img && !str_starts_with($img, 'http') && !str_starts_with($img, '/')) {
            $img = '../' . $img;
        }
        return [
            'id'              => $row['id_i'],
            'ref_id'          => 'INS-' . $row['id_i'],
            'id_e'            => $row['id_e'],
            'estado'          => $row['estado_i'],
            'estado_i'        => $row['estado_i'],
            'precio'          => (float)$row['precio_pagado_i'],
            'precio_pagado_i' => (float)$row['precio_pagado_i'],
            'fecha_inscripcion' => $row['fecha_i'],
            'fecha_i'         => $row['fecha_i'],
            // QR
            'qr_id'           => $row['id_qr']           ?? null,
            'qr_code'         => $row['codigo_qr']        ?? null,
            'qr_imagen_qr'    => $row['qr_imagen_qr']     ?? null,
            'fecha_generacion_qr' => $row['fecha_generacion_qr'] ?? null,
            'fecha_uso_qr'    => $row['fecha_uso_qr']     ?? null,
            'estado_qr'       => $row['estado_qr']        ?? 'activo',
            // Pago
            'id_pago'         => $row['id_pago']          ?? null,
            'metodo_pago_p'   => $row['metodo_pago_p']    ?? null,
            'metodo_pago_i'   => $row['metodo_pago_p']    ?? null,
            'referencia_p'    => $row['referencia_p']     ?? null,
            'comprobante_p'   => $row['comprobante_p']    ?? null,
            'monto_p'         => $row['monto_p'] !== null ? (float)$row['monto_p'] : null,
            'fecha_p'         => $row['fecha_p']          ?? null,
            'estado_p'        => $row['estado_p']         ?? null,
            // Datos del evento (JOIN con eventodeportivo)
            'eventoNombre'    => $row['nombre_e']    ?? '',
            'eventoFecha'     => $row['fecha_e']     ?? '',
            'eventoLugar'     => $row['ubicacion_e'] ?? '',
            'eventoCategoria' => $row['categoria_e'] ?? '',
            'eventoImg'       => $img,
        ];
    }, $rows);

    echo json_encode(['ok' => true, 'inscripciones' => $inscripciones]);

} catch (PDOException $e) {
    echo json_encode(['ok' => true, 'inscripciones' => [], 'debug' => $e->getMessage()]);
}
?>