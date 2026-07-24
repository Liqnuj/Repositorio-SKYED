<?php
ini_set('session.cookie_path', '/GitSkyed/Repositorio-SKYED/');
header('Content-Type: application/json');
session_start();
require __DIR__ . '/../../conexion.php';

$sessionUserId = $_SESSION['usuario_id'] ?? $_SESSION['user_id'] ?? null;
if (empty($sessionUserId)) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'No autenticado']);
    exit;
}

$usuario_id = (int)$sessionUserId;

try {
    $stmt = $pdo->prepare(
        "SELECT 
            i.id_i AS id,
            i.id_i AS row_id,
            i.cupo_i,
            i.estado_i AS estado,
            i.fecha_i AS fecha_inscripcion,
            i.precio_pagado_i AS precio_pagado,
            i.id_e AS evento_id,
            e.nombre_e AS eventoNombre,
            e.fecha_e AS eventoFecha,
            e.ubicacion_e AS eventoLugar,
            e.categoria_e AS eventoCategoria,
            e.imagen_e AS eventoImg,
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
        LEFT JOIN eventoDeportivo e ON e.id_e = i.id_e
        LEFT JOIN qr_entrada q ON q.id_i = i.id_i
        LEFT JOIN pago p ON p.id_pago = (
            SELECT id_pago
            FROM pago p2
            WHERE p2.id_i = i.id_i
            ORDER BY p2.fecha_p DESC
            LIMIT 1
        )
        WHERE i.id_u = ?
        ORDER BY i.fecha_i DESC"
    );
    $stmt->execute([$usuario_id]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $inscripciones = array_map(function($row) {
        return [
            'id'              => $row['id'],
            'ref_id'          => 'INS-' . str_pad($row['id'], 6, '0', STR_PAD_LEFT),
            'evento_id'       => $row['evento_id'] ?? null,
            'estado'          => $row['estado'] ?? null,
            'estado_i'        => $row['estado'] ?? null,
            'precio'          => (float)($row['precio_pagado'] ?? 0),
            'precio_pagado_i' => (float)($row['precio_pagado'] ?? 0),
            'dorsal'          => null,
            'quiere_jersey'   => false,
            'talla_camiseta'  => null,
            'qr_id'           => $row['id_qr'] ?? null,
            'qr_code'         => $row['codigo_qr'] ?? null,
            'qr_imagen_qr'    => $row['qr_imagen_qr'] ?? null,
            'fecha_generacion_qr' => $row['fecha_generacion_qr'] ?? null,
            'fecha_uso_qr'    => $row['fecha_uso_qr'] ?? null,
            'estado_qr'       => $row['estado_qr'] ?? 'activo',
            'fecha_inscripcion' => $row['fecha_inscripcion'] ?? null,
            'id_pago'         => $row['id_pago'] ?? null,
            'metodo_pago_p'   => $row['metodo_pago_p'] ?? null,
            'referencia_p'    => $row['referencia_p'] ?? null,
            'comprobante_p'   => $row['comprobante_p'] ?? null,
            'monto_p'         => $row['monto_p'] !== null ? (float)$row['monto_p'] : null,
            'fecha_p'         => $row['fecha_p'] ?? null,
            'estado_p'        => $row['estado_p'] ?? null,
            'eventoNombre'    => $row['eventoNombre'] ?? '',
            'eventoFecha'     => $row['eventoFecha'] ?? '',
            'eventoLugar'     => $row['eventoLugar'] ?? '',
            'eventoCategoria' => $row['eventoCategoria'] ?? '',
            'eventoKm'        => $row['eventoKm'] ?? '',
            'eventoImg'       => !empty($row['eventoImg'])
                    ? (str_starts_with($row['eventoImg'], 'http') || str_starts_with($row['eventoImg'], '/')
                        ? $row['eventoImg']
                        : '../' . $row['eventoImg'])
                    : '',
            'categoriaNombre' => $row['eventoCategoria'] ?? '',
        ];
    }, $rows);

    echo json_encode(['ok' => true, 'inscripciones' => $inscripciones]);

} catch (PDOException $e) {
    http_response_code(500);
    error_log('[SKYED] get_inscripciones: ' . $e->getMessage());
    echo json_encode(['ok' => false, 'inscripciones' => [], 'error' => 'Error BD: ' . $e->getMessage()]);
}
?>