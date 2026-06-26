<?php
header('Content-Type: application/json');
session_start();
require __DIR__ . '/conexion.php';

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'No autenticado']);
    exit;
}

$d         = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$id_u      = (int)$_SESSION['user_id'];
$id_e      = (int)($d['evento_id'] ?? 0);

if ($id_e <= 0) {
    echo json_encode(['ok' => false, 'error' => 'Evento inválido']);
    exit;
}

try {
    // ── 1. Verificar duplicado ──────────────────────────────────────────────
    $chk = $pdo->prepare(
        "SELECT id_i FROM inscripcion
         WHERE id_u = ? AND id_e = ? AND estado_i != 'cancelada' LIMIT 1"
    );
    $chk->execute([$id_u, $id_e]);
    if ($chk->fetch()) {
        echo json_encode(['ok' => false, 'error' => 'Ya estás inscrito en este evento']);
        exit;
    }

    // ── 2. Verificar que el evento existe en la BD; si no, crearlo ──────────
    $chkEvento = $pdo->prepare("SELECT id_e FROM eventoDeportivo WHERE id_e = ? LIMIT 1");
    $chkEvento->execute([$id_e]);
    if (!$chkEvento->fetch()) {
        // Auto-insertar el evento desde los datos del payload
        $pdo->prepare("INSERT INTO eventoDeportivo
            (id_e, nombre_e, categoria_e, fecha_e, hora_e, ubicacion_e,
             descripcion_e, requisitos_e, imagen_e, cupos_disponibles_e, estado_e)
            VALUES (?, ?, 'ciclismo', ?, '07:00:00', ?, ?, ?, ?, 500, 'activo')")
        ->execute([
            $id_e,
            $d['eventoNombre'] ?? "Evento $id_e",
            $d['eventoFecha']  ?? date('Y-m-d'),
            $d['eventoLugar']  ?? 'Colombia',
            $d['eventoNombre'] ?? "Evento $id_e",
            'Abierto a todo público',
            $d['eventoImg']    ?? 'img/event1.jpg',
        ]);
    }

    // ── 3. Calcular cupo ────────────────────────────────────────────────────
    $cupoStmt = $pdo->prepare(
        "SELECT COALESCE(MAX(cupo_i), 0) + 1 FROM inscripcion WHERE id_e = ?"
    );
    $cupoStmt->execute([$id_e]);
    $cupo_i = (int)$cupoStmt->fetchColumn();

    // ── 4. Datos del formulario ─────────────────────────────────────────────
    $metodo_pago    = $d['metodo_pago']          ?? 'transferencia';
    $precio_pagado  = round((float)($d['precio'] ?? 0), 2);
    $contacto_nom   = trim($d['contacto_nombre']     ?? '');
    $contacto_tel   = trim($d['contacto_telefono']   ?? '');
    $parentesco     = trim($d['contacto_parentesco'] ?? ($d['parentesco'] ?? ''));
    $invitado       = $d['invitado']             ?? null;

    // estado_i solo acepta: 'pendiente', 'confirmada', 'cancelada'
    $estado_i = 'pendiente';

    // ── 5. Insertar inscripción ─────────────────────────────────────────────
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("INSERT INTO inscripcion (
        cupo_i, estado_i, fecha_i, precio_pagado_i,
        contacto_emergencia_nombre, contacto_emergencia_telefono, contacto_emergencia_parentesco,
        id_u, id_e
    ) VALUES (?, 'pendiente', NOW(), ?, ?, ?, ?, ?, ?)");

    $stmt->execute([
        $cupo_i,
        $precio_pagado,
        $contacto_nom,
        $contacto_tel,
        $parentesco,
        $id_u,
        $id_e,
    ]);

    $id_i    = (int)$pdo->lastInsertId();
    $ref_id  = 'INS-' . str_pad($id_i, 6, '0', STR_PAD_LEFT);
    $qr_code = 'SKYED-' . $id_e . '-' . $id_u . '-' . $id_i . '-' . time();

    $pdo->commit();

    // ── 6. Insertar QR ──────────────────────────────────────────────────────
    $qr_id    = null;
    $qr_error = null;
    try {
        $pdo->prepare("INSERT INTO qr_entrada (codigo_qr, fecha_generacion_qr, estado_qr, id_i)
                       VALUES (?, NOW(), 'activo', ?)")
            ->execute([$qr_code, $id_i]);
        $qr_id = (int)$pdo->lastInsertId();
    } catch (PDOException $e) {
        $qr_error = $e->getMessage();
        error_log('[SKYED] qr_entrada: ' . $qr_error);
    }

    // ── 7. Insertar pago ────────────────────────────────────────────────────
    $pago_id    = null;
    $pago_error = null;
    try {
        $pago_ref        = $d['referencia'] ?? ('PAY-' . strtoupper(substr(uniqid(), -8)));
        $raw_comprobante = $d['comprobante'] ?? null;
        $pago_comprobante = null;

        if ($raw_comprobante && str_starts_with($raw_comprobante, 'data:image')) {
            $uploadDir = __DIR__ . '/../uploads/comprobantes/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
            preg_match('/data:image\/(\w+);base64,(.+)/', $raw_comprobante, $m);
            if (count($m) === 3) {
                $filename = 'comp_' . $id_i . '_' . time() . '.' . $m[1];
                file_put_contents($uploadDir . $filename, base64_decode($m[2]));
                $pago_comprobante = 'uploads/comprobantes/' . $filename;
            }
        } elseif (!empty($raw_comprobante)) {
            $pago_comprobante = $raw_comprobante;
        }

        // monto_p: guardar como entero (sin decimales) para evitar overflow de DECIMAL(10,7)
        // Si tienes control de la BD, cambia monto_p a DECIMAL(12,2)
        $monto_db = (int)$precio_pagado;

        $pdo->prepare("INSERT INTO pago (metodo_pago_p, referencia_p, comprobante_p, monto_p, estado_p, id_i)
                       VALUES (?, ?, ?, ?, 'pendiente', ?)")
            ->execute([$metodo_pago, $pago_ref, $pago_comprobante, $monto_db, $id_i]);
        $pago_id = (int)$pdo->lastInsertId();
    } catch (PDOException $e) {
        $pago_error = $e->getMessage();
        error_log('[SKYED] pago: ' . $pago_error);
        $pago_ref = null;
    }

    // ── 8. Insertar invitado (si aplica) ────────────────────────────────────
    $id_inv    = null;
    $inv_error = null;
    if (!empty($invitado) && !empty($invitado['documento_inv'])) {
        try {
            $chkInv = $pdo->prepare("SELECT id_inv FROM invitado WHERE documento_inv = ? LIMIT 1");
            $chkInv->execute([(int)$invitado['documento_inv']]);
            $invExistente = $chkInv->fetch(PDO::FETCH_ASSOC);

            if ($invExistente) {
                $id_inv = $invExistente['id_inv'];
            } else {
                $pdo->prepare("INSERT INTO invitado (
                    tipo_documento, documento_inv, nombre_inv, apellido_inv,
                    rh_inv, telefono_inv, fecha_nacimiento_inv, correo_inv
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
                ->execute([
                    $invitado['tipo_documento']       ?? 'cedula_ciudadania',
                    (int)$invitado['documento_inv'],
                    trim($invitado['nombre_inv']       ?? ''),
                    trim($invitado['apellido_inv']     ?? ''),
                    $invitado['rh_inv']                ?? '',
                    $invitado['telefono_inv']           ?? '',
                    !empty($invitado['fecha_nacimiento_inv']) ? $invitado['fecha_nacimiento_inv'] : null,
                    !empty($invitado['correo_inv'])           ? $invitado['correo_inv']           : null,
                ]);
                $id_inv = (int)$pdo->lastInsertId();
            }
        } catch (PDOException $e) {
            $inv_error = $e->getMessage();
            error_log('[SKYED] invitado: ' . $inv_error);
        }
    }

    // ── 9. Respuesta ────────────────────────────────────────────────────────
    echo json_encode([
        'ok'           => true,
        'id'           => $id_i,
        'id_i'         => $id_i,
        'ref_id'       => $ref_id,
        'estado'       => $estado_i,
        'qr_code'      => $qr_code,
        'qr_id'        => $qr_id,
        'precio'       => $precio_pagado,
        'eventoNombre' => $d['eventoNombre'] ?? '',
        'eventoFecha'  => $d['eventoFecha']  ?? '',
        'referencia_p' => $pago_ref ?? '',
        'id_pago'      => $pago_id,
        'id_inv'       => $id_inv,
        // Errores de sub-inserts (null = éxito)
        '_debug' => [
            'qr_error'          => $qr_error,
            'pago_error'        => $pago_error,
            'inv_error'         => $inv_error,
            'invitado_recibido' => !empty($invitado) ? 'sí' : 'no',
            'invitado_data'     => $invitado,   // <-- ver exactamente qué llega
            'monto_enviado'     => $precio_pagado,
        ],
    ]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Error BD: ' . $e->getMessage()]);
}
?>