<?php
// php/inscribir.php — registra una venta/factura
header('Content-Type: application/json');
session_start();
require __DIR__ . '/conexion.php';

if (empty($_SESSION['user_id'])) { http_response_code(401); echo json_encode(['ok'=>false,'error'=>'No autenticado']); exit; }
$d = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$evento_id = (int)($d['evento_id'] ?? 0);
if ($evento_id<=0) { echo json_encode(['ok'=>false,'error'=>'Evento inválido']); exit; }

$stmt = $pdo->prepare("SELECT precio FROM eventos WHERE id=?");
$stmt->execute([$evento_id]);
$ev = $stmt->fetch();
if (!$ev) { echo json_encode(['ok'=>false,'error'=>'Evento no encontrado']); exit; }

$pdo->prepare("INSERT INTO ventas (usuario_id,evento_id,precio) VALUES (?,?,?)")
    ->execute([$_SESSION['user_id'],$evento_id,$ev['precio']]);
echo json_encode(['ok'=>true,'factura_id'=>$pdo->lastInsertId()]);
