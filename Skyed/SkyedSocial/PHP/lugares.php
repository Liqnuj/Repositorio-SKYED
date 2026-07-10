<?php
session_start();
require __DIR__ . '/../conexion.php';


switch (method()) {

    case 'GET':
        $stmt = db()->query("SELECT id_a AS id, nombre_a AS nombre, descripcion_a AS descripcion,
                                     capacidad_a AS capacidad, precio_referencia_a AS precio,
                                     ubicacion_a AS ubicacion, contacto_a AS contacto,
                                     estado_a AS estado, imagen_principal_a AS imagen
                              FROM ambiente ORDER BY id_a DESC");
        json_out($stmt->fetchAll());
        break;

    case 'POST':
        $d = body_or_error(['nombre']);
        $stmt = db()->prepare("INSERT INTO ambiente
            (nombre_a, descripcion_a, capacidad_a, precio_referencia_a, ubicacion_a, contacto_a, estado_a, imagen_principal_a)
            VALUES (:nombre, :descripcion, :capacidad, :precio, :ubicacion, :contacto, :estado, :imagen)");
        $stmt->execute([
            ':nombre'      => $d['nombre'],
            ':descripcion' => $d['descripcion'] ?? null,
            ':capacidad'   => $d['capacidad'] ?? 0,
            ':precio'      => $d['precio'] ?? 0,
            ':ubicacion'   => $d['ubicacion'] ?? null,
            ':contacto'    => $d['contacto'] ?? null,
            ':estado'      => $d['estado'] ?? 'disponible',
            ':imagen'      => $d['imagen'] ?? null,
        ]);
        json_out(['id' => (int) db()->lastInsertId()], 201);
        break;

    case 'PUT':
        $id = (int) ($_GET['id'] ?? 0);
        if (!$id) json_error('Falta el id del lugar', 422);
        $d = body_or_error(['nombre']);
        $stmt = db()->prepare("UPDATE ambiente SET
            nombre_a = :nombre, descripcion_a = :descripcion, capacidad_a = :capacidad,
            precio_referencia_a = :precio, ubicacion_a = :ubicacion, contacto_a = :contacto,
            estado_a = :estado, imagen_principal_a = :imagen
            WHERE id_a = :id");
        $stmt->execute([
            ':nombre'      => $d['nombre'],
            ':descripcion' => $d['descripcion'] ?? null,
            ':capacidad'   => $d['capacidad'] ?? 0,
            ':precio'      => $d['precio'] ?? 0,
            ':ubicacion'   => $d['ubicacion'] ?? null,
            ':contacto'    => $d['contacto'] ?? null,
            ':estado'      => $d['estado'] ?? 'disponible',
            ':imagen'      => $d['imagen'] ?? null,
            ':id'          => $id,
        ]);
        json_out(['ok' => true]);
        break;

    case 'DELETE':
        $id = (int) ($_GET['id'] ?? 0);
        if (!$id) json_error('Falta el id del lugar', 422);
        // Si el lugar está en uso por un evento, se desvincula.
        db()->prepare("UPDATE evento_realizado SET id_a = NULL WHERE id_a = :id")->execute([':id' => $id]);
        db()->prepare("DELETE FROM ambiente WHERE id_a = :id")->execute([':id' => $id]);
        json_out(['ok' => true]);
        break;

    default:
        json_error('Método no permitido', 405);
}
