<?php
header('Content-Type: application/json');
require  'conexion.php';

$id = intval($_GET['id'] ?? 0);
if (!$id) { echo json_encode(['error' => 'ID inválido']); exit; }

$stmt = $pdo->prepare("SELECT * FROM usuario WHERE id_u = ?");
$stmt->execute([$id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

echo $user ? json_encode($user) : json_encode(['error' => 'No encontrado']);