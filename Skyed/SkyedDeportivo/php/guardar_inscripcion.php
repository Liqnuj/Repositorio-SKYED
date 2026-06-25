<?php
header('Content-Type: application/json');
session_start();
require __DIR__ . '/conexion.php';

// Verificar sesión
if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'No autenticado']);
    exit;
}

$d = json_decode(file_get_contents('php://input'), true) ?: $_POST;

// Campos requeridos
$usuario_id  = (int)$_SESSION['user_id'];
$evento_id   = $d['evento_id'] ?? 0;

if (empty($evento_id)) {
    echo json_encode(['ok' => false, 'error' => 'Evento inválido']);
    exit;
}

// Verificar que el evento existe
try {
    $stmt = $pdo->prepare("SELECT * FROM eventoDeportivo WHERE id_e = ?");
    $stmt->execute([$evento_id]);
    $evento = $stmt->fetch();

    if (!$evento) {
        // El evento viene como datos del JS (mock), los aceptamos del payload
        // para compatibilidad con la inscripcion.js que usa datos mock
        $evento = [
            'id_e'                  => $evento_id,
            'nombre_e'               => $d['eventoNombre'] ?? 'Evento',
            'fecha_e'                => $d['eventoFecha']  ?? date('Y-m-d'),
            'ubicacion_e'            => $d['eventoLugar']  ?? '',
            'categoria_e'            => $d['eventoCategoria'] ?? '',
            'distancia_total_e'      => $d['eventoKm']     ?? '',
            'imagen_e'               => $d['eventoImg']    ?? '',
            'precio_e'               => (float)($d['precio'] ?? 0),
        ];
    }

    // Verificar inscripción duplicada
    // Solo bloquear si hay inscripción real (evento_id válido y no cancelada)
    if (!empty($evento_id)) {
        $chk = $pdo->prepare("SELECT id FROM inscripciones WHERE usuario_id = ? AND evento_id = ? AND estado NOT IN ('cancelado','rechazado') AND evento_id != 0 AND evento_id != ''");
        $chk->execute([$usuario_id, $evento_id]);
        if ($chk->fetch()) {
            echo json_encode(['ok' => false, 'error' => 'Ya estás inscrito en este evento']);
            exit;
        }
    }

    // Preparar datos
    $metodo_pago       = $d['metodo_pago']       ?? 'transferencia';
    $estado            = ($metodo_pago === 'efectivo') ? 'pendiente_pago' : 'pendiente_validacion';
    $precio_pagado     = round((float)($d['precio'] ?? ($evento['precio_e'] ?? 0)), 2);
    $monto_pago        = round($precio_pagado, 2);
    $doc_u             = $d['doc_u']              ?? ($_SESSION['documento'] ?? '');
    $rh_u              = $d['rh_u']               ?? '';
    $telefono_u        = $d['telefono_u']          ?? ($_SESSION['telefono'] ?? '');
    $contacto_nombre   = $d['contacto_nombre']    ?? '';
    $contacto_telefono = $d['contacto_telefono']  ?? '';
    $fecha_nacimiento  = $d['fecha_nacimiento']   ?? ($_SESSION['fecha_nacimiento'] ?? null);
    $dorsal            = $d['dorsal']             ?? '';
    $cond_medicas      = $d['condiciones_medicas'] ?? '';
    $quiere_jersey     = !empty($d['quiere_jersey']) ? 1 : 0;
    $talla_camiseta    = $d['talla_camiseta']     ?? '';
    $id_cc             = !empty($d['id_cc']) ? (int)$d['id_cc'] : null;
    $categoria_nombre  = $d['categoriaNombre']    ?? ($d['eventoCategoria'] ?? '');
    $qr_code           = 'SKYED-' . $evento_id . '-' . $doc_u . '-' . time();
    $ref_id            = 'INS-' . strtoupper(uniqid());

    // Datos extra del evento para mostrar en el panel (guardados en JSON)
    $evento_data = json_encode([
        'nombre'    => $d['eventoNombre']    ?? ($evento['nombre_e'] ?? ''),
        'fecha'     => $d['eventoFecha']     ?? ($evento['fecha_e']  ?? ''),
        'lugar'     => $d['eventoLugar']     ?? ($evento['ubicacion_e']  ?? ''),
        'categoria' => $d['eventoCategoria'] ?? ($evento['categoria_e'] ?? ''),
        'km'        => $d['eventoKm']        ?? ($evento['distancia_total_e'] ?? ''),
        'imagen'    => $d['eventoImg']       ?? ($evento['imagen_e'] ?? ''),
        'categoria_nombre' => $categoria_nombre,
    ]);

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

    // Insertar inscripción
    $sql = "INSERT INTO inscripciones (
                ref_id, usuario_id, evento_id, estado, metodo_pago,
                precio_pagado, doc_u, rh_u, telefono_u,
                contacto_nombre, contacto_telefono, fecha_nacimiento,
                dorsal, condiciones_medicas, quiere_jersey, talla_camiseta,
                id_cc, qr_code, evento_data
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $ref_id, $usuario_id, $evento_id, $estado, $metodo_pago,
        $precio_pagado, $doc_u, $rh_u, $telefono_u,
        $contacto_nombre, $contacto_telefono,
        $fecha_nacimiento ?: null,
        $dorsal, $cond_medicas, $quiere_jersey, $talla_camiseta,
        $id_cc, $qr_code, $evento_data
    ]);

    $nuevo_id = $pdo->lastInsertId();
    $qr_fecha = date('Y-m-d H:i:s');
    $qr_estado = 'activo';
    $qr_imagen = null;

    $stmtQr = $pdo->prepare("INSERT INTO qr_entrada (
        codigo_qr, qr_imagen_qr, fecha_generacion_qr,
        fecha_uso_qr, estado_qr, id_i
    ) VALUES (?,?,?,?,?,?)");
    $stmtQr->execute([
        $qr_code, $qr_imagen, $qr_fecha, null, $qr_estado, $nuevo_id
    ]);
    $qr_id = $pdo->lastInsertId();

    // Guardar el pago asociado a la inscripción
    $pago_referencia   = $d['referencia']   ?? ('REF-' . strtoupper(uniqid()));
    $pago_comprobante  = $d['comprobante']  ?? ($metodo_pago === 'efectivo' ? 'Pago presencial' : null);
    $pago_estado       = 'pendiente';
    $pago_fecha        = date('Y-m-d H:i:s');

    $pdo->exec("CREATE TABLE IF NOT EXISTS pago (
        id_pago        INT AUTO_INCREMENT PRIMARY KEY,
        metodo_pago_p  VARCHAR(50) DEFAULT NULL,
        referencia_p   VARCHAR(100) DEFAULT NULL,
        comprobante_p  VARCHAR(255) DEFAULT NULL,
        monto_p        DECIMAL(10,7) DEFAULT NULL,
        fecha_p        DATETIME DEFAULT CURRENT_TIMESTAMP(),
        estado_p       ENUM('pendiente','aprobado','rechazado') DEFAULT 'pendiente',
        id_i           INT NOT NULL,
        INDEX idx_pago_inscripcion (id_i),
        CONSTRAINT fk_pago_inscripcion FOREIGN KEY (id_i) REFERENCES inscripciones(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $stmtPago = $pdo->prepare("INSERT INTO pago (
        metodo_pago_p, referencia_p, comprobante_p,
        monto_p, fecha_p, estado_p, id_i
    ) VALUES (?,?,?,?,?,?,?)");
    $stmtPago->execute([
        $metodo_pago, $pago_referencia, $pago_comprobante,
        number_format($monto_pago, 2, '.', ''), $pago_fecha, $pago_estado, $nuevo_id
    ]);
    $pago_id = $pdo->lastInsertId();

    echo json_encode([
        'ok'          => true,
        'id'          => $nuevo_id,
        'ref_id'      => $ref_id,
        'estado'      => $estado,
        'qr_code'     => $qr_code,
        'qr_id'       => $qr_id,
        'qr_estado'   => $qr_estado,
        'qr_fecha'    => $qr_fecha,
        'precio'      => $precio_pagado,
        'eventoNombre'=> $d['eventoNombre'] ?? '',
        'eventoFecha' => $d['eventoFecha']  ?? '',
        'referencia_p'=> $pago_referencia,
        'comprobante_p'=> $pago_comprobante,
        'estado_p'    => $pago_estado,
        'fecha_p'     => $pago_fecha,
        'id_pago'     => $pago_id,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Error BD: ' . $e->getMessage()]);
}
?>