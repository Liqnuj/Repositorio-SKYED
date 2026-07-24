<?php
session_start();
require __DIR__ . '/../../conexion.php';

if (empty($_SESSION['usuario_id'])) {
    header("Location: ../login.html");
    exit;
}
$id_u = $_SESSION['usuario_id'];
$email_u = strtolower($_SESSION['email'] ?? '');

$destino = $_GET['destino'] ?? '';
if (!in_array($destino, ['social', 'deportivo'], true)) {
    die("Destino inválido");
}

$ADMINS = require __DIR__ . '/../../admins_config.php';

$es_admin = in_array($email_u, $ADMINS[$destino], true);

try {
    if ($es_admin) {
        $rol_admin = ($destino === 'deportivo') ? 'adminDeportivo' : 'adminSocial';

        $sqlUpsert = "INSERT INTO usuario_contexto_rol (id_u, id_rol, contexto)
                       VALUES (?, (SELECT id_rol FROM rol WHERE nombre_rol = ?), ?)
                       ON DUPLICATE KEY UPDATE id_rol = VALUES(id_rol)";
        $stmtUpsert = $pdo->prepare($sqlUpsert);
        $stmtUpsert->execute([$id_u, $rol_admin, $destino]);

        $_SESSION['contexto_actual'] = $destino;
        $_SESSION['rol_actual'] = $rol_admin;
        $_SESSION['rol'] = $rol_admin;

    } else {
        $sqlCheck = "SELECT r.nombre_rol 
                     FROM rol r 
                     JOIN usuario_contexto_rol ucr ON r.id_rol = ucr.id_rol 
                     WHERE ucr.id_u = ? AND ucr.contexto = ?";
        $stmt = $pdo->prepare($sqlCheck);
        $stmt->execute([$id_u, $destino]);

        $rol_existente = $stmt->fetchColumn();

        if ($rol_existente) {
            $_SESSION['contexto_actual'] = $destino;
            $_SESSION['rol_actual'] = $rol_existente;
            $_SESSION['rol'] = $rol_existente;

        } else {
            $id_rol_asignar = ($destino === 'deportivo') ? 2 : 1;

            $sqlInsert = "INSERT INTO usuario_contexto_rol (id_u, id_rol, contexto) VALUES (?, ?, ?)";
            $stmtInsert = $pdo->prepare($sqlInsert);
            $stmtInsert->execute([$id_u, $id_rol_asignar, $destino]);
            $_SESSION['contexto_actual'] = $destino;
            $_SESSION['rol_actual'] = ($destino === 'deportivo') ? 'participante' : 'cliente';
            $_SESSION['rol'] = $_SESSION['rol_actual'];
        }
    }

    if ($es_admin) {
            if ($destino === 'deportivo') {
                header("Location: ../../SkyedDeportivo/admin.php");
            } else {
                header("Location: ../../SkyedSocial/admin.php");
            }
        } elseif ($destino === 'deportivo') {
            header("Location: ../../SkyedDeportivo/index.html");
        } else {
            header("Location: ../../SkyedSocial/index.html");
        }
        exit;

} catch (PDOException $e) {
    error_log('asignar_rol SKYED: ' . $e->getMessage());
    die("Ocurrió un error al validar tu acceso. Intenta de nuevo.");
}
?>