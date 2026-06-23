<?php
header('Content-Type: application/json');
require __DIR__ . '/conexion.php';

$data = json_decode(file_get_contents('php://input'), true) ?: $_POST;

// 1. Verificar que existan todos los campos que envía el JS
$campos = ['documento', 'tipoDocumento', 'nombre', 'apellido', 'email', 'telefono', 'fechaNac', 'rh', 'password'];
foreach ($campos as $c) {
    if (empty($data[$c])) { 
        echo json_encode(['ok'=>false,'error'=>"El campo $c es obligatorio"]); 
        exit; 
    }
}

// 2. Validación extra del correo
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) { 
    echo json_encode(['ok'=>false,'error'=>'Email inválido']); 
    exit; 
}

// 3. Hashear contraseña (solo necesitamos una)
$hash = password_hash($data['password'], PASSWORD_DEFAULT);

// 4. Valores por defecto para cumplir con los campos NOT NULL de tu tabla
$rolPorDefecto = 'participante'; 

try {
    $sql = "INSERT INTO usuario (
                rol_u, 
                tipo_documento_u,
                documento_u,
                nombre_u, 
                apellido_u,  
                rh_u, 
                telefono_u, 
                correo_u, 
                fecha_nacimiento_u, 
                contrasena_u
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $rolPorDefecto,
        $data['tipoDocumento'], 
        $data['documento'], 
        $data['nombre'], 
        $data['apellido'],            
        $data['rh'], 
        $data['telefono'], 
        strtolower($data['email']),    
        $data['fechaNac'], 
        $hash // Único envío del hash
    ]);
    
    // Todo salió bien, devolvemos el ID al JS para que redirija al login
    echo json_encode(['ok'=>true, 'id'=>$pdo->lastInsertId()]);
    
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(['ok'=>false, 'error'=>'El documento o correo ya se encuentran registrados en SKYED.']);
    } else {
        // echo json_encode(['ok'=>false, 'error'=>'Error BD: ' . $e->getMessage()]);
    }
}
?>