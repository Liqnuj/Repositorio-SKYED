<?php
header('Content-Type: application/json');
require __DIR__ . '/../../conexion.php';

$data = json_decode(file_get_contents('php://input'), true) ?: $_POST;

// 1. Verificar que existan todos los campos obligatorios que envía el JS
$campos = ['documento', 'tipoDocumento', 'nombre', 'apellido', 'email', 'telefono', 'fechaNac', 'password'];
foreach ($campos as $c) {
    if (empty($data[$c])) { 
        echo json_encode(['ok'=>false,'error'=>"El campo $c es obligatorio"]); 
        exit; 
    }
}

// RH queda opcional y se guarda como NULL si viene vacío
$rhValue = isset($data['rh']) && $data['rh'] !== '' ? $data['rh'] : null;

// 2. Validación extra del correo
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) { 
    echo json_encode(['ok'=>false,'error'=>'Email inválido']); 
    exit; 
}

// 3. Validación de la fecha de nacimiento
$fechaNac = $data['fechaNac'] ?? '';
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fechaNac)) {
    echo json_encode(['ok'=>false,'error'=>'La fecha de nacimiento no es válida']);
    exit;
}

$fechaObj = DateTimeImmutable::createFromFormat('!Y-m-d', $fechaNac);
if (!$fechaObj || $fechaObj->format('Y-m-d') !== $fechaNac) {
    echo json_encode(['ok'=>false,'error'=>'La fecha de nacimiento no es válida']);
    exit;
}

$hoy = new DateTimeImmutable('today');
if ($fechaObj >= $hoy) {
    echo json_encode(['ok'=>false,'error'=>'La fecha de nacimiento no puede ser futura']);
    exit;
}

$edad = $hoy->diff($fechaObj)->y;
if ($edad < 10) {
    echo json_encode(['ok'=>false,'error'=>'Debes tener al menos 10 años para registrarte']);
    exit;
}

// 4. Hashear contraseña (solo necesitamos una)
$hash = password_hash($data['password'], PASSWORD_DEFAULT);

try {
    $sql = "INSERT INTO usuario (
                tipo_documento_u,
                documento_u,
                nombre_u, 
                apellido_u,  
                rh_u, 
                telefono_u, 
                correo_u, 
                fecha_nacimiento_u, 
                contrasena_u
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $data['tipoDocumento'], 
        $data['documento'], 
        $data['nombre'], 
        $data['apellido'],            
        $rhValue, 
        $data['telefono'], 
        strtolower($data['email']),    
        $fechaNac, 
        $hash
    ]);
    
    // Todo salió bien, devolvemos el ID al JS para que redirija al login
    echo json_encode(['ok'=>true, 'id'=>$pdo->lastInsertId()]);
    
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(['ok'=>false, 'error'=>'El documento, teléfono o correo ya se encuentran registrados en SKYED.']);
    } else {
        echo json_encode(['ok'=>false, 'error'=>'Error en el servidor. Intenta de nuevo.']);
        error_log('registro SKYED: ' . $e->getMessage());
    }
}
?>