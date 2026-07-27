<?php
session_start();
require __DIR__ . '/../conexion.php';

$CATS = ['decoracion', 'catering', 'fotografia', 'musica', 'gestion_lugares', 'efectos'];

switch (method()) {

    case 'GET':
        $stmt = db()->query("SELECT id_s AS id, nombre_s AS nombre, categoria_s AS categoria,
                                     descripcion_s AS descripcion, precio_referencia_s AS precio,
                                     estado_s AS estado
                              FROM servicio ORDER BY categoria_s, id_s");
        $rows = $stmt->fetchAll();
        foreach ($rows as &$row) {
            $row['id'] = (int) $row['id'];
            $row['precio'] = $row['precio'] !== null ? (float) $row['precio'] : 0;
        }
        json_out($rows);
        break;

    case 'POST':
        $d = body_or_error(['nombre', 'categoria']);
        if (!in_array($d['categoria'], $CATS, true)) {
            json_error('Categoría de servicio inválida', 422);
        }
        $stmt = db()->prepare("INSERT INTO servicio (nombre_s, categoria_s, descripcion_s, precio_referencia_s, estado_s)
                                VALUES (:nombre, :categoria, :descripcion, :precio, :estado)");
        $stmt->execute([
            ':nombre'      => $d['nombre'],
            ':categoria'   => $d['categoria'],
            ':descripcion' => $d['descripcion'] ?? '',
            ':precio'      => $d['precio'] ?? 0,
            ':estado'      => $d['estado'] ?? 'disponible',
        ]);
        json_out(['id' => (int) db()->lastInsertId(), 'ok' => true], 201);
        break;

    case 'PUT':
        $id = (int) ($_GET['id'] ?? 0);
        if (!$id) json_error('Falta el id del servicio', 422);
        $d = body_or_error(['nombre', 'categoria']);
        if (!in_array($d['categoria'], $CATS, true)) {
            json_error('Categoría de servicio inválida', 422);
        }
        $stmt = db()->prepare("UPDATE servicio SET
            nombre_s = :nombre, categoria_s = :categoria, descripcion_s = :descripcion,
            precio_referencia_s = :precio, estado_s = :estado
            WHERE id_s = :id");
        $stmt->execute([
            ':nombre'      => $d['nombre'],
            ':categoria'   => $d['categoria'],
            ':descripcion' => $d['descripcion'] ?? '',
            ':precio'      => $d['precio'] ?? 0,
            ':estado'      => $d['estado'] ?? 'disponible',
            ':id'          => $id,
        ]);
        json_out(['ok' => true]);
        break;

    case 'DELETE':
        $id = (int) ($_GET['id'] ?? 0);
        if (!$id) json_error('Falta el id del servicio', 422);

        db()->prepare("DELETE FROM ambiente_servicio WHERE id_s = :id")->execute([':id' => $id]);
        db()->prepare("DELETE FROM reserva_servicio WHERE id_s = :id")->execute([':id' => $id]);
        db()->prepare("DELETE FROM servicio WHERE id_s = :id")->execute([':id' => $id]);
        json_out(['ok' => true]);
        break;

    default:
        json_error('Método no permitido', 405);
}
