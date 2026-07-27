<?php
session_start();
require __DIR__ . '/../conexion.php';

/**
 * Busca un cliente existente por correo o teléfono; si no existe lo crea.
 * Devuelve el id_u del cliente.
 */
function find_or_create_cliente(PDO $pdo, array $c): int {
    $stmt = $pdo->prepare("SELECT id_u FROM usuario WHERE correo_u = :correo OR telefono_u = :telefono LIMIT 1");
    $stmt->execute([':correo' => $c['correo'] ?? '', ':telefono' => $c['telefono'] ?? '']);
    $row = $stmt->fetch();
    if ($row) {
        $upd = $pdo->prepare("UPDATE usuario SET nombre_u = :nombre, apellido_u = :apellido WHERE id_u = :id");
        $upd->execute([':nombre' => $c['nombre'], ':apellido' => $c['apellido'] ?? '', ':id' => $row['id_u']]);
        return (int) $row['id_u'];
    }

    $documento = !empty($c['documento']) ? (int) $c['documento'] : random_int(10000000, 999999999);
    $tipoDoc = $c['tipoDocumento'] ?? 'cedula_ciudadania';
    $hash = password_hash((string) $documento, PASSWORD_DEFAULT);

    $ins = $pdo->prepare("INSERT INTO usuario
        (tipo_documento_u, documento_u, nombre_u, apellido_u, telefono_u, correo_u, contrasena_u)
        VALUES (:tipoDoc, :documento, :nombre, :apellido, :telefono, :correo, :contrasena)");
    $ins->execute([
        ':tipoDoc'    => $tipoDoc,
        ':documento'  => $documento,
        ':nombre'     => $c['nombre'],
        ':apellido'   => $c['apellido'] ?? '',
        ':telefono'   => $c['telefono'] ?: ('sin-tel-' . uniqid()),
        ':correo'     => $c['correo'] ?: ('sin-correo-' . uniqid() . '@skyedsocial.local'),
        ':contrasena' => $hash,
    ]);
    return (int) $pdo->lastInsertId();
}

/** Encuentra o crea el tipo de evento (categoría) según lo enviado por el formulario. */
function resolve_tipo_evento(PDO $pdo, array $d): ?int {
    if (!empty($d['categoriaId'])) {
        return (int) $d['categoriaId'];
    }
    if (!empty($d['categoriaNombre'])) {
        $chk = $pdo->prepare("SELECT id_tipo_eves FROM tipo_evento WHERE nombre_tipo_eves = :n");
        $chk->execute([':n' => $d['categoriaNombre']]);
        $existing = $chk->fetch();
        if ($existing) {
            return (int) $existing['id_tipo_eves'];
        }
        $insTipo = $pdo->prepare("INSERT INTO tipo_evento (nombre_tipo_eves, color_tipo_eves) VALUES (:n, :c)");
        $insTipo->execute([':n' => $d['categoriaNombre'], ':c' => $d['categoriaColor'] ?? '#7c3aed']);
        return (int) $pdo->lastInsertId();
    }
    return null;
}

switch (method()) {

    case 'GET':
        $sql = "SELECT
                    r.id_rese AS id,
                    r.fecha_evento_rese AS fecha,
                    r.invitados_rese AS invitados,
                    r.presupuesto_rese AS presupuesto,
                    r.ubicacion_rese AS ubicacion,
                    r.Observaciones_rese AS peticionesCliente,
                    r.notas_logistica_rese AS notasLogistica,
                    r.total_rese AS total,
                    r.estado_rese AS estado,
                    r.creado_en_rese AS creadoEn,
                    u.id_u AS clienteId,
                    u.nombre_u AS clienteNombre,
                    u.apellido_u AS clienteApellido,
                    u.telefono_u AS clienteTelefono,
                    u.correo_u AS clienteEmail,
                    u.documento_u AS clienteDocumento,
                    u.tipo_documento_u AS clienteTipoDocumento,
                    er.id_er AS eventoId,
                    er.nombre_er AS titulo,
                    er.hora_er AS hora,
                    er.id_a AS lugarId,
                    a.nombre_a AS lugarNombre,
                    a.capacidad_a AS lugarCapacidad,
                    a.precio_referencia_a AS lugarPrecio,
                    a.ubicacion_a AS lugarUbicacion,
                    t.id_tipo_eves AS categoriaId,
                    t.nombre_tipo_eves AS categoria,
                    t.color_tipo_eves AS categoriaColor
                FROM reserva r
                JOIN usuario u ON u.id_u = r.id_u
                JOIN evento_realizado er ON er.id_er = r.id_er
                LEFT JOIN ambiente a ON a.id_a = er.id_a
                LEFT JOIN tipo_evento t ON t.id_tipo_eves = er.id_tipo_eves
                ORDER BY r.fecha_evento_rese ASC";
        $rows = db()->query($sql)->fetchAll();

        $svcStmt = db()->prepare("SELECT id_s FROM reserva_servicio WHERE id_rese = :id");
        foreach ($rows as &$row) {
            $svcStmt->execute([':id' => $row['id']]);
            $row['id'] = (int) $row['id'];
            $row['servicioIds']  = array_map('intval', array_column($svcStmt->fetchAll(), 'id_s'));
            $row['invitados']    = $row['invitados'] !== null ? (int) $row['invitados'] : null;
            $row['presupuesto']  = $row['presupuesto'] !== null ? (float) $row['presupuesto'] : 0;
            $row['total']        = $row['total'] !== null ? (float) $row['total'] : 0;
            $row['lugarId']      = $row['lugarId'] !== null ? (int) $row['lugarId'] : null;
            $row['categoriaId']  = $row['categoriaId'] !== null ? (int) $row['categoriaId'] : null;
            $row['clienteId']    = (int) $row['clienteId'];
        }
        json_out($rows);
        break;

    case 'POST':
        $d = body_or_error(['titulo', 'fecha', 'cliente']);
        $cliente = $d['cliente'];
        if (empty($cliente['nombre'])) json_error('Falta el nombre del cliente', 422);

        $pdo = db();
        $pdo->beginTransaction();
        try {
            $idCliente = find_or_create_cliente($pdo, $cliente);
            $idTipo = resolve_tipo_evento($pdo, $d);

            $insEr = $pdo->prepare("INSERT INTO evento_realizado (nombre_er, descripcion_er, fecha_er, hora_er, id_tipo_eves, id_a)
                                     VALUES (:titulo, :descripcion, :fecha, :hora, :idTipo, :idA)");
            $insEr->execute([
                ':titulo'      => $d['titulo'],
                ':descripcion' => $d['notasLogistica'] ?? '',
                ':fecha'       => $d['fecha'],
                ':hora'        => $d['hora'] ?? '19:00:00',
                ':idTipo'      => $idTipo,
                ':idA'         => $d['lugarId'] ?? null,
            ]);
            $idEr = (int) $pdo->lastInsertId();

            $insRes = $pdo->prepare("INSERT INTO reserva
                (fecha_evento_rese, invitados_rese, presupuesto_rese, ubicacion_rese, Observaciones_rese,
                 notas_logistica_rese, total_rese, estado_rese, id_u, id_er)
                VALUES (:fecha, :invitados, :presupuesto, :ubicacion, :observaciones, :notas, :total, :estado, :idU, :idEr)");
            $insRes->execute([
                ':fecha'         => $d['fecha'],
                ':invitados'     => $d['invitados'] ?? 0,
                ':presupuesto'   => $d['presupuesto'] ?? 0,
                ':ubicacion'     => $d['ubicacion'] ?: 'Por definir',
                ':observaciones' => $d['peticionesCliente'] ?: 'Sin observaciones',
                ':notas'         => $d['notasLogistica'] ?? '',
                ':total'         => $d['total'] ?? 0,
                ':estado'        => $d['estado'] ?? 'pendiente',
                ':idU'           => $idCliente,
                ':idEr'          => $idEr,
            ]);
            $idRese = (int) $pdo->lastInsertId();

            if (!empty($d['servicioIds']) && is_array($d['servicioIds'])) {
                $insSvc = $pdo->prepare("INSERT INTO reserva_servicio (id_rese, id_s) VALUES (:idRese, :idS)");
                foreach ($d['servicioIds'] as $idS) {
                    $insSvc->execute([':idRese' => $idRese, ':idS' => (int) $idS]);
                }
            }

            $pdo->commit();
            json_out(['id' => $idRese, 'ok' => true], 201);
        } catch (Throwable $e) {
            $pdo->rollBack();
            json_error('No se pudo guardar la reserva: ' . $e->getMessage(), 500);
        }
        break;

    case 'PUT':
        $id = (int) ($_GET['id'] ?? 0);
        if (!$id) json_error('Falta el id de la reserva', 422);
        $d = body_or_error(['titulo', 'fecha', 'cliente']);
        $cliente = $d['cliente'];

        $pdo = db();
        $find = $pdo->prepare("SELECT id_er FROM reserva WHERE id_rese = :id");
        $find->execute([':id' => $id]);
        $existing = $find->fetch();
        if (!$existing) json_error('Reserva no encontrada', 404);
        $idEr = (int) $existing['id_er'];

        $pdo->beginTransaction();
        try {
            $idCliente = find_or_create_cliente($pdo, $cliente);
            $idTipo = resolve_tipo_evento($pdo, $d);

            $updEr = $pdo->prepare("UPDATE evento_realizado SET
                nombre_er = :titulo, descripcion_er = :descripcion, fecha_er = :fecha,
                hora_er = :hora, id_tipo_eves = :idTipo, id_a = :idA
                WHERE id_er = :idEr");
            $updEr->execute([
                ':titulo'      => $d['titulo'],
                ':descripcion' => $d['notasLogistica'] ?? '',
                ':fecha'       => $d['fecha'],
                ':hora'        => $d['hora'] ?? '19:00:00',
                ':idTipo'      => $idTipo,
                ':idA'         => $d['lugarId'] ?? null,
                ':idEr'        => $idEr,
            ]);

            $updRes = $pdo->prepare("UPDATE reserva SET
                fecha_evento_rese = :fecha, invitados_rese = :invitados, presupuesto_rese = :presupuesto,
                ubicacion_rese = :ubicacion, Observaciones_rese = :observaciones,
                notas_logistica_rese = :notas, total_rese = :total, estado_rese = :estado, id_u = :idU
                WHERE id_rese = :id");
            $updRes->execute([
                ':fecha'         => $d['fecha'],
                ':invitados'     => $d['invitados'] ?? 0,
                ':presupuesto'   => $d['presupuesto'] ?? 0,
                ':ubicacion'     => $d['ubicacion'] ?: 'Por definir',
                ':observaciones' => $d['peticionesCliente'] ?: 'Sin observaciones',
                ':notas'         => $d['notasLogistica'] ?? '',
                ':total'         => $d['total'] ?? 0,
                ':estado'        => $d['estado'] ?? 'pendiente',
                ':idU'           => $idCliente,
                ':id'            => $id,
            ]);

            $pdo->prepare("DELETE FROM reserva_servicio WHERE id_rese = :id")->execute([':id' => $id]);
            if (!empty($d['servicioIds']) && is_array($d['servicioIds'])) {
                $insSvc = $pdo->prepare("INSERT INTO reserva_servicio (id_rese, id_s) VALUES (:idRese, :idS)");
                foreach ($d['servicioIds'] as $idS) {
                    $insSvc->execute([':idRese' => $id, ':idS' => (int) $idS]);
                }
            }

            $pdo->commit();
            json_out(['ok' => true]);
        } catch (Throwable $e) {
            $pdo->rollBack();
            json_error('No se pudo actualizar la reserva: ' . $e->getMessage(), 500);
        }
        break;

    case 'DELETE':
        $id = (int) ($_GET['id'] ?? 0);
        if (!$id) json_error('Falta el id de la reserva', 422);

        $pdo = db();
        $find = $pdo->prepare("SELECT id_er FROM reserva WHERE id_rese = :id");
        $find->execute([':id' => $id]);
        $row = $find->fetch();
        if (!$row) json_out(['ok' => true]); // ya no existe, nada que hacer

        $pdo->beginTransaction();
        try {
            $pdo->prepare("DELETE FROM reserva_servicio WHERE id_rese = :id")->execute([':id' => $id]);
            $pdo->prepare("DELETE FROM reserva WHERE id_rese = :id")->execute([':id' => $id]);
            $pdo->prepare("DELETE FROM evento_realizado WHERE id_er = :id")->execute([':id' => $row['id_er']]);
            $pdo->commit();
            json_out(['ok' => true]);
        } catch (Throwable $e) {
            $pdo->rollBack();
            json_error('No se pudo eliminar: ' . $e->getMessage(), 500);
        }
        break;

    default:
        json_error('Método no permitido', 405);
}
