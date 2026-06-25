<?php
header('Content-Type: application/json');
session_start();
require __DIR__ . '/conexion.php';

if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'adminDeportivo') {
    echo json_encode(['ok' => false, 'error' => 'No autorizado']);
    exit;
}

try {

    $usuarios = $pdo->query("SELECT * FROM usuario ORDER BY nombre_u ASC")->fetchAll(PDO::FETCH_ASSOC);

    
    $inscripciones = $pdo->query("
        SELECT i.*, u.nombre_u, u.apellido_u, e.nombre_e 
        FROM inscripcion i 
        JOIN usuario u ON i.id_u = u.id_u 
        JOIN eventoDeportivo e ON i.id_e = e.id_e 
        ORDER BY i.fecha_i DESC
    ")->fetchAll(PDO::FETCH_ASSOC);

    
    $eventos = $pdo->query("SELECT * FROM eventoDeportivo ORDER BY fecha_e ASC")->fetchAll(PDO::FETCH_ASSOC);

    
    $pagos = $pdo->query("SELECT * FROM pago ORDER BY fecha_p DESC")->fetchAll(PDO::FETCH_ASSOC);
    

    $kits = $pdo->query("SELECT * FROM kit ORDER BY fecha_entrega_k ASC")->fetchAll(PDO::FETCH_ASSOC);
    
    $totalUsuarios     = count($usuarios);
    $totalEventos      = count($eventos);
    $totalInscripciones= count($inscripciones);
    $pagosAprobados    = count(array_filter($pagos, fn($p) => strtolower($p['estado_p'] ?? '') === 'aprobado'));
    $pagosPendientes   = count(array_filter($pagos, fn($p) => strtolower($p['estado_p'] ?? '') === 'pendiente'));
    $pagosRechazados   = count(array_filter($pagos, fn($p) => strtolower($p['estado_p'] ?? '') === 'rechazado'));
    $ingresos          = array_sum(array_column(
        array_filter($pagos, fn($p) => strtolower($p['estado_p'] ?? '') === 'aprobado'),
        'monto_p'
    ));


    echo json_encode([
        'ok' => true,
        'data' => [
            'usuarios'      => $usuarios,
            'inscripciones' => $inscripciones,
            'eventos'       => $eventos,
            'pagos'         => $pagos,
            'kits'          => $kits,
            'entregas'      => [],
            'categorias'    => [],
            'patrocinadores'=> [],
            'resultados'    => [],
            'rutas'         => [],
            'hidratacion'   => [],
            'notificaciones'=> [],
        ],
        'summary' => [
            'usuarios'        => $totalUsuarios,
            'eventos'         => $totalEventos,
            'inscripciones'   => $totalInscripciones,
            'kits'            => 0,
            'pagosAprobados'  => $pagosAprobados,
            'pagosPendientes' => $pagosPendientes,
            'pagosRechazados' => $pagosRechazados,
        ],
        'finance' => [
            'ingresos' => $ingresos,
            'pagos'    => [
                'aprobado'  => $pagosAprobados,
                'pendiente' => $pagosPendientes,
                'rechazado' => $pagosRechazados,
            ]
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}