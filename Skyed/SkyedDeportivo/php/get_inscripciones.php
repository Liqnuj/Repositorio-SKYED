<?php
header('Content-Type: application/json');
session_start();
require __DIR__ . '/conexion.php';

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'No autenticado']);
    exit;
}

$usuario_id = (int)$_SESSION['user_id'];

try {
    // Crear tabla si no existe (para robustez)
    $pdo->exec("CREATE TABLE IF NOT EXISTS inscripciones (
        id                 INT AUTO_INCREMENT PRIMARY KEY,
        ref_id             VARCHAR(40)  NOT NULL,
        usuario_id         INT          NOT NULL,
        evento_id          INT          NOT NULL,
        estado             VARCHAR(40)  NOT NULL DEFAULT 'pendiente_validacion',
        metodo_pago        VARCHAR(40)  NOT NULL DEFAULT 'transferencia',
        precio_pagado      DECIMAL(12,2) NOT NULL DEFAULT 0,
        doc_u              VARCHAR(20)  DEFAULT NULL,
        rh_u               VARCHAR(5)   DEFAULT NULL,
        telefono_u         VARCHAR(20)  DEFAULT NULL,
        contacto_nombre    VARCHAR(100) DEFAULT NULL,
        contacto_telefono  VARCHAR(20)  DEFAULT NULL,
        fecha_nacimiento   DATE         DEFAULT NULL,
        dorsal             VARCHAR(10)  DEFAULT NULL,
        condiciones_medicas TEXT        DEFAULT NULL,
        quiere_jersey      TINYINT(1)   DEFAULT 0,
        talla_camiseta     VARCHAR(5)   DEFAULT NULL,
        id_cc              INT          DEFAULT NULL,
        qr_code            VARCHAR(100) DEFAULT NULL,
        evento_data        JSON         DEFAULT NULL,
        fecha_inscripcion  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_usuario  (usuario_id),
        INDEX idx_evento   (evento_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS qr_entrada (
        id_qr               INT AUTO_INCREMENT PRIMARY KEY,
        codigo_qr           VARCHAR(120) NOT NULL,
        qr_imagen_qr        TEXT DEFAULT NULL,
        fecha_generacion_qr DATETIME NOT NULL,
        fecha_uso_qr        DATETIME DEFAULT NULL,
        estado_qr           VARCHAR(40) NOT NULL DEFAULT 'activo',
        id_i                INT NOT NULL,
        INDEX idx_inscripcion_qr (id_i),
        INDEX idx_codigo_qr (codigo_qr),
        CONSTRAINT fk_qr_entrada_inscripcion FOREIGN KEY (id_i) REFERENCES inscripciones(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $stmt = $pdo->prepare("
        SELECT 
            i.id,
            i.ref_id,
            i.evento_id,
            i.estado,
            i.metodo_pago,
            i.precio_pagado,
            i.dorsal,
            i.quiere_jersey,
            i.talla_camiseta,
            i.qr_code AS inscripcion_qr_code,
            i.fecha_inscripcion,
            i.evento_data,
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
        FROM inscripciones i
        LEFT JOIN qr_entrada q ON q.id_i = i.id
        LEFT JOIN pago p ON p.id_pago = (
            SELECT id_pago
            FROM pago p2
            WHERE p2.id_i = i.id
            ORDER BY p2.fecha_p DESC
            LIMIT 1
        )
        WHERE i.usuario_id = ?
        ORDER BY i.fecha_inscripcion DESC
    ");
    $stmt->execute([$usuario_id]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Parsear evento_data JSON y normalizar campos para el JS del participante
    $inscripciones = array_map(function($row) {
        $ev = [];
        if (!empty($row['evento_data'])) {
            $ev = json_decode($row['evento_data'], true) ?: [];
        }
        return [
            'id'              => $row['id'],
            'ref_id'          => $row['ref_id'],
            'evento_id'       => $row['evento_id'],
            'estado'          => $row['estado'],
            // Alias compatibles con participante.js
            'estado_i'        => $row['estado'],
            'metodo_pago'     => $row['metodo_pago'],
            'metodo_pago_i'   => $row['metodo_pago'],
            'precio'          => (float)$row['precio_pagado'],
            'precio_pagado_i' => (float)$row['precio_pagado'],
            'dorsal'          => $row['dorsal'],
            'quiere_jersey'   => (bool)$row['quiere_jersey'],
            'talla_camiseta'  => $row['talla_camiseta'],
            'qr_id'           => $row['id_qr'] ?? null,
            'qr_code'         => $row['codigo_qr'] ?? $row['inscripcion_qr_code'],
            'qr_imagen_qr'    => $row['qr_imagen_qr'] ?? null,
            'fecha_generacion_qr' => $row['fecha_generacion_qr'] ?? null,
            'fecha_uso_qr'    => $row['fecha_uso_qr'] ?? null,
            'estado_qr'       => $row['estado_qr'] ?? 'activo',
            'fecha_inscripcion' => $row['fecha_inscripcion'],
            'id_pago'         => $row['id_pago'] ?? null,
            'metodo_pago_p'   => $row['metodo_pago_p'] ?? null,
            'referencia_p'    => $row['referencia_p'] ?? null,
            'comprobante_p'   => $row['comprobante_p'] ?? null,
            'monto_p'         => $row['monto_p'] !== null ? (float)$row['monto_p'] : null,
            'fecha_p'         => $row['fecha_p'] ?? null,
            'estado_p'        => $row['estado_p'] ?? null,
            // Datos del evento
            'eventoNombre'    => $ev['nombre']    ?? '',
            'eventoFecha'     => $ev['fecha']     ?? '',
            'eventoLugar'     => $ev['lugar']     ?? '',
            'eventoCategoria' => $ev['categoria'] ?? '',
            'eventoKm'        => $ev['km']        ?? '',
            'eventoImg'       => !empty($ev['imagen'])
                    ? (str_starts_with($ev['imagen'], 'http') || str_starts_with($ev['imagen'], '/')
                        ? $ev['imagen']
                        : '../' . $ev['imagen'])
                    : '',
            'categoriaNombre' => $ev['categoria_nombre'] ?? $ev['categoria'] ?? '',
        ];
    }, $rows);

    echo json_encode(['ok' => true, 'inscripciones' => $inscripciones]);

} catch (PDOException $e) {
    // Si la tabla aún no existe, devolver lista vacía
    echo json_encode(['ok' => true, 'inscripciones' => [], 'debug' => $e->getMessage()]);
}
?>