<?php
header('Content-Type: application/json');
session_start();
require __DIR__ . '/conexion.php';

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'No autenticado']);
    exit;
}

$d          = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$id_u       = (int)$_SESSION['user_id'];
$id_e       = $d['evento_id'] ?? 0;

if (empty($id_e)) {
    echo json_encode(['ok' => false, 'error' => 'Evento inválido']);
    exit;
}

try {
    // Verificar duplicado en tabla inscripcion
    $chk = $pdo->prepare("SELECT id_i FROM inscripcion WHERE id_u = ? AND id_e = ? AND estado_i NOT IN ('cancelado','rechazado')");
    $chk->execute([$id_u, $id_e]);
    if ($chk->fetch()) {
        echo json_encode(['ok' => false, 'error' => 'Ya estás inscrito en este evento']);
        exit;
    }

    // Preparar datos
    $metodo_pago    = $d['metodo_pago']        ?? 'transferencia';
    $estado_i       = ($metodo_pago === 'efectivo') ? 'pendiente_pago' : 'pendiente_validacion';
    $precio_pagado  = round((float)($d['precio'] ?? 0), 2);
    $contacto_nom   = $d['contacto_nombre']    ?? '';
    $contacto_tel   = $d['contacto_telefono']  ?? '';
    $parentesco     = $d['parentesco']         ?? '';
    $invitado       = $d['invitado']           ?? null;

    // Insertar en tabla inscripcion
    $stmt = $pdo->prepare("INSERT INTO inscripcion (
        cupo_i, estado_i, fecha_i, precio_pagado_i,
        contacto_emergencia_nombre, contacto_emergencia_telefono, contacto_emergencia_parentesco,
        id_u, id_e
    ) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?)");

    $stmt->execute([
        1,
        $estado_i,
        $precio_pagado,
        $contacto_nom,
        $contacto_tel,
        $parentesco,
        $id_u,
        $id_e,
    ]);

    $id_i     = $pdo->lastInsertId();
    $ref_id   = 'INS-' . strtoupper(uniqid());
    $qr_code  = 'SKYED-' . $id_e . '-' . $id_u . '-' . time();

    // Insertar QR
    $qr_fecha = date('Y-m-d H:i:s');
    $stmtQr = $pdo->prepare("INSERT INTO qr_entrada (
        codigo_qr, qr_imagen_qr, fecha_generacion_qr, fecha_uso_qr, estado_qr, id_i
    ) VALUES (?, NULL, ?, NULL, 'activo', ?)");
    $stmtQr->execute([$qr_code, $qr_fecha, $id_i]);
    $qr_id = $pdo->lastInsertId();

    // Insertar pago
    $pago_referencia  = 'REF-' . strtoupper(uniqid());
    $pago_comprobante = ($metodo_pago === 'efectivo') ? 'Pago presencial' : null;
    $pago_fecha       = date('Y-m-d H:i:s');
    $stmtPago = $pdo->prepare("INSERT INTO pago (
        metodo_pago_p, referencia_p, comprobante_p, monto_p, fecha_p, estado_p, id_i
    ) VALUES (?, ?, ?, ?, ?, 'pendiente', ?)");
    $stmtPago->execute([
        $metodo_pago, $pago_referencia, $pago_comprobante,
        number_format($precio_pagado, 2, '.', ''), $pago_fecha, $id_i
    ]);
    $pago_id = $pdo->lastInsertId();

    // Guardar invitado si viene en el payload
    if (!empty($invitado) && !empty($invitado['documento_inv'])) {
        $stmtInv = $pdo->prepare("INSERT INTO invitado (
            tipo_documento, documento_inv, nombre_inv, apellido_inv,
            rh_inv, telefono_inv, fecha_nacimiento_inv, correo_inv, id_i
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmtInv->execute([
            $invitado['tipo_documento']                              ?? null,
            $invitado['documento_inv']                               ?? '',
            $invitado['nombre_inv']                                  ?? '',
            $invitado['apellido_inv']                                ?? '',
            $invitado['rh_inv']                                      ?? null,
            $invitado['telefono_inv']                                ?? null,
            !empty($invitado['fecha_nacimiento_inv']) ? $invitado['fecha_nacimiento_inv'] : null,
            !empty($invitado['correo_inv'])           ? $invitado['correo_inv']           : null,
            $id_i,
        ]);
    }

    echo json_encode([
        'ok'           => true,
        'id'           => $id_i,
        'ref_id'       => $ref_id,
        'estado'       => $estado_i,
        'qr_code'      => $qr_code,
        'qr_id'        => $qr_id,
        'precio'       => $precio_pagado,
        'eventoNombre' => $d['eventoNombre'] ?? '',
        'eventoFecha'  => $d['eventoFecha']  ?? '',
        'referencia_p' => $pago_referencia,
        'id_pago'      => $pago_id,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Error BD: ' . $e->getMessage()]);
}
?>