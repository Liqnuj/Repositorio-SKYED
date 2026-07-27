<?php
session_start();
require __DIR__ . '/../conexion.php';

switch (method()) {

    case 'GET':
        $stmt = db()->query("SELECT id_tipo_eves AS id, nombre_tipo_eves AS nombre,
                                     descripcion_eves AS descripcion, color_tipo_eves AS color
                              FROM tipo_evento ORDER BY id_tipo_eves");
        $rows = $stmt->fetchAll();
        foreach ($rows as &$row) {
            $row['id'] = (int) $row['id'];
        }
        json_out($rows);
        break;

    case 'POST':
        $d = body_or_error(['nombre']);
        // Evita duplicar si ya existe una categoría con el mismo nombre.
        $chk = db()->prepare("SELECT id_tipo_eves FROM tipo_evento WHERE nombre_tipo_eves = :n");
        $chk->execute([':n' => $d['nombre']]);
        $existing = $chk->fetch();
        if ($existing) {
            json_out(['id' => (int) $existing['id_tipo_eves'], 'existed' => true]);
        }
        $stmt = db()->prepare("INSERT INTO tipo_evento (nombre_tipo_eves, descripcion_eves, color_tipo_eves)
                                VALUES (:nombre, :descripcion, :color)");
        $stmt->execute([
            ':nombre'      => $d['nombre'],
            ':descripcion' => $d['descripcion'] ?? null,
            ':color'       => $d['color'] ?? '#7c3aed',
        ]);
        json_out(['id' => (int) db()->lastInsertId(), 'ok' => true], 201);
        break;

    default:
        json_error('Método no permitido', 405);
}
