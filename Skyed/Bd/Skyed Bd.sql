DROP DATABASE IF EXISTS skyed;
CREATE DATABASE IF NOT EXISTS skyed;
USE skyed;

-- =============================================
-- TABLA: INVITADO

CREATE TABLE invitado (
id_inv int PRIMARY KEY auto_increment,
tipo_documento ENUM ('cedula_ciudadania', 'tarjeta_identidad', 'cedula_extranjeria', 'pasaporte') NOT NULL,
documento_inv int not null UNIQUE,
 nombre_inv VARCHAR(50) not null,
 apellido_inv VARCHAR(50) not null,
 rh_inv VARCHAR(5) not null,
 telefono_inv VARCHAR(50) not null unique,
 fecha_nacimiento_inv DATE not null,
 correo_inv VARCHAR(80) UNIQUE
 );
-- =============================================
-- TABLA: USUARIO

CREATE TABLE usuario (
    id_u INT PRIMARY KEY auto_increment,
    tipo_documento_u ENUM ('cedula_ciudadania', 'tarjeta_identidad', 'cedula_extranjeria', 'pasaporte') NOT NULL,
    documento_u INT NOT NULL UNIQUE,
    rol_u ENUM("adminDeportivo","adminSocial","participante","cliente") DEFAULT 'participante',
    nombre_u VARCHAR(50) NOT NULL,
    apellido_u VARCHAR(50) NOT NULL,
    rh_u VARCHAR(5),
    telefono_u VARCHAR(15) NOT NULL UNIQUE,
    correo_u VARCHAR(80) NOT NULL UNIQUE,
    fecha_nacimiento_u DATE,
    codigo VARCHAR(6) DEFAULT NULL,
    contrasena_u VARCHAR(255) NOT NULL,
    estado_u ENUM('activo','inactivo','bloqueado') DEFAULT 'activo',
    id_inv int,
    FOREIGN KEY (id_inv) REFERENCES invitado(id_inv)
);

-- =============================================
-- TABLA: KIT

CREATE TABLE kit (
    id_k INT AUTO_INCREMENT PRIMARY KEY,
    nombre_k VARCHAR(45) NOT NULL,
    stock_k INT NOT NULL,
    fecha_entrega_k DATE,
    lugar_entrega_k VARCHAR(45),
    contenido_k VARCHAR(255),
    talla_camiseta_k VARCHAR(10),
    numero_dorsal_k INT
);

-- =============================================
-- EVENTO DEPORTIVO

CREATE TABLE eventoDeportivo  (
    id_e INT AUTO_INCREMENT PRIMARY KEY,
    nombre_e VARCHAR(120) NOT NULL,
    categoria_e ENUM('atletismo','senderismo','ciclismo'),
    fecha_e DATE NOT NULL,
    hora_e TIME NOT NULL,
    ubicacion_e VARCHAR(120) NOT NULL,
    descripcion_e VARCHAR(255) NOT NULL,
    requisitos_e VARCHAR(255) NOT NULL,
    imagen_e VARCHAR(120) NOT NULL,
    cupos_disponibles_e INT DEFAULT 0 NOT NULL,
    estado_e ENUM("activo", "inactivo", "inhabilitado") default "activo",
    creado_e DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_k INT,
    id_u INT,
    FOREIGN KEY (id_k) REFERENCES kit(id_k) ON DELETE SET NULL,
    FOREIGN KEY (id_u) REFERENCES usuario(id_u) ON DELETE CASCADE
);


-- =============================================
-- TABLA: CATEGORIA_COMPETENCIA DEPORTIVO


CREATE TABLE categoria_competencia (
    id_cc INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cc VARCHAR(50) NOT NULL,
    edad_minima_cc INT,
    edad_maxima_cc INT,
    genero_cc ENUM('masculino','femenino','mixto'),
    distancia_cc VARCHAR(45),
    descripcion_cc VARCHAR(255),
    id_e INT NOT NULL,
    FOREIGN KEY (id_e) REFERENCES eventoDeportivo(id_e) ON DELETE CASCADE
);

-- =============================================
-- TABLA: PATROCINADOR


CREATE TABLE patrocinador (
    id_p INT AUTO_INCREMENT PRIMARY KEY,
    nombre_p VARCHAR(100) NOT NULL,
    logo_p VARCHAR(255),
    telefono_p VARCHAR(15),
    correo_p VARCHAR(80),
    pagina_web_p VARCHAR(120),
    aporte_p VARCHAR(100),
    estado_p ENUM("activo", "inactivo", "inhabilitado")
);

-- =============================================
-- TABLA: EVENTO_PATROCINADOR


CREATE TABLE evento_patrocinador (
	id_ep INT primary key auto_increment,
    patrocinador_id_p INT NOT NULL,
    evento_id_e INT NOT NULL, 
    detalle VARCHAR(255),
    FOREIGN KEY (patrocinador_id_p) REFERENCES patrocinador(id_p) ON DELETE CASCADE,
    FOREIGN KEY (evento_id_e) REFERENCES eventoDeportivo(id_e) ON DELETE CASCADE
);

-- =============================================
-- TABLA: INSCRIPCION


CREATE TABLE inscripcion (
    id_i INT AUTO_INCREMENT PRIMARY KEY,
    cupo_i INT NOT NULL,
    estado_i ENUM("pendiente", "confirmada", "cancelada") not null,
    fecha_i DATETIME DEFAULT CURRENT_TIMESTAMP,
    precio_pagado_i DECIMAL(10,2),
    contacto_emergencia_nombre VARCHAR(100) NOT NULL,
    contacto_emergencia_telefono VARCHAR(15) NOT NULL,
    contacto_emergencia_parentesco VARCHAR (50) NOT NULL,
    id_u INT NOT NULL,
    id_e INT NOT NULL,
    FOREIGN KEY (id_u) REFERENCES usuario(id_u) ON DELETE CASCADE,
    FOREIGN KEY (id_e) REFERENCES eventoDeportivo(id_e) ON DELETE CASCADE
);

-- =============================================
-- TABLA: PAGO


CREATE TABLE pago (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    metodo_pago_p VARCHAR(50),
    referencia_p VARCHAR(100),
    comprobante_p VARCHAR(255),
    monto_p DECIMAL(10,7),
    fecha_p DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado_p ENUM('pendiente','aprobado','rechazado') DEFAULT 'pendiente',
    id_i INT NOT NULL,
    FOREIGN KEY (id_i) REFERENCES inscripcion(id_i) ON DELETE CASCADE
);

-- =============================================
-- TABLA: QR_ENTRADA


CREATE TABLE qr_entrada (
    id_qr INT AUTO_INCREMENT PRIMARY KEY,
    codigo_qr VARCHAR(255) UNIQUE,
    qr_imagen_qr VARCHAR(255),
    fecha_generacion_qr DATETIME,
    fecha_uso_qr DATETIME,
    estado_qr ENUM('activo','usado', 'cancelado', 'vencido') DEFAULT 'activo',
    id_i INT NOT NULL,
    FOREIGN KEY (id_i) REFERENCES inscripcion(id_i) ON DELETE CASCADE
);

-- =============================================
-- TABLA: ENTREGA_KIT


CREATE TABLE entrega_kit (
    id_ek INT AUTO_INCREMENT PRIMARY KEY,
    fecha_entrega_real_ek DATETIME,
    persona_entrega_ek VARCHAR(80),
    estado_ek ENUM('pendiente','entregado', 'devolucion') DEFAULT 'pendiente',
    observaciones_ek VARCHAR(255),
    id_k INT NOT NULL,
    id_u INT NOT NULL,
    id_e INT NOT NULL,
    FOREIGN KEY (id_k) REFERENCES kit(id_k) ON DELETE CASCADE,
    FOREIGN KEY (id_u) REFERENCES usuario(id_u) ON DELETE CASCADE,
    FOREIGN KEY (id_e) REFERENCES eventoDeportivo(id_e) ON DELETE CASCADE
);

-- =============================================
-- TABLA: HISTORIAL_PARTICIPACION


CREATE TABLE historial_participacion (
    id_hp INT AUTO_INCREMENT PRIMARY KEY,
    fecha_hp DATETIME,
    estado_hp ENUM('inscrito','finalizado','asistio', 'abandono'),
    observaciones_hp VARCHAR(255),
    id_u INT NOT NULL,
    id_e INT NOT NULL,
    FOREIGN KEY (id_u) REFERENCES usuario(id_u) ON DELETE CASCADE,
    FOREIGN KEY (id_e) REFERENCES eventoDeportivo(id_e) ON DELETE CASCADE
);

-- =============================================
-- TABLA: NOTIFICACION


CREATE TABLE notificacion (
    id_n INT AUTO_INCREMENT PRIMARY KEY,
    titulo_n VARCHAR(120),
    mensaje_n TEXT,
    fecha_n DATETIME DEFAULT CURRENT_TIMESTAMP,
    leida_n TINYINT DEFAULT 0,
    tipo_n ENUM('general', 'evento', 'inscripcion', 'pago', 'resultado', 'kit'),
    referencia_id INT,
    id_u INT NOT NULL,
    FOREIGN KEY (id_u) REFERENCES usuario(id_u) ON DELETE CASCADE
);

-- =============================================
-- TABLA: PUNTO_HIDRATACION


CREATE TABLE estacion (
    id_est INT AUTO_INCREMENT PRIMARY KEY,
    nombre_est VARCHAR(100),
    tipo_est ENUM('hidratacion', 'primeros_auxilios', 'control', 'meta', 'general') DEFAULT 'general',
    kilometro_est VARCHAR(20),
    latitud_est DECIMAL(10,7),
    longitud_est DECIMAL(10,7),
    descripcion_pest VARCHAR(255),
    estado_est ENUM('activa', 'inactiva', 'cerrada'),
    id_e INT NOT NULL,
    FOREIGN KEY (id_e) REFERENCES eventoDeportivo(id_e) ON DELETE CASCADE
);

-- =============================================
-- TABLA: RUTA_EVENTO


CREATE TABLE ruta_evento (
    id_re INT AUTO_INCREMENT PRIMARY KEY,
    nombre_re VARCHAR(100) NOT NULL,
    estado_re ENUM("activo", "inactivo", "deshabilitado"),
    distancia_re VARCHAR(45),
    desnivel_re VARCHAR(45),
    descripcion_re VARCHAR(255),
    archivo_gpx_re VARCHAR(255),
    precio_re DECIMAL(10,7),
    id_e INT NOT NULL,
    FOREIGN KEY (id_e) REFERENCES eventoDeportivo(id_e) ON DELETE CASCADE
);

-- =============================================
-- TABLA: RESULTADO


CREATE TABLE resultado (
    id_r INT AUTO_INCREMENT PRIMARY KEY,
    tiempo_final_r TIME NOT NULL,
    posicion_general_r INT,
    posicion_categoria_r INT,
    estado_r ENUM('oficial', 'en revision', 'desaclificado') not null,
    id_i INT,
    foreign key (id_i) references inscripcion (id_i)
);

CREATE TABLE categoria_resultado (
id_categoria_resultado INT primary key auto_increment,
posicion_categoria INT NOT NULL,
estado_competidor ENUM('clasificado', 'descalificado') DEFAULT 'clasificado',
id_cc INT,
id_r INT,
foreign key (id_cc) references categoria_competencia (id_cc),
foreign key (id_r) references resultado (id_r)
);




-- =============================================
-- SKYED SOCIAL
-- =============================================




-- =============================================
-- TABLA: TIPOS DE EVENTOS


CREATE TABLE tipo_evento (
    id_tipo_eves INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo_eves VARCHAR(50) NOT NULL,
    descripcion_eves VARCHAR (120)
);

-- =============================================
-- TABLA: AMBIENTES-LUGAR

CREATE TABLE ambiente (
    id_a INT AUTO_INCREMENT PRIMARY KEY,
    nombre_a VARCHAR(100) NOT NULL,
    descripcion_a TEXT,
    capacidad_a INT NOT NULL,
    precio_referencia_a DECIMAL(12,7),
    imagen_principal_a VARCHAR(255)
);

-- =============================================
-- TABLA: SERVICIOS INCLUIDOS

CREATE TABLE servicio (
    id_s INT AUTO_INCREMENT PRIMARY KEY,
    nombre_s VARCHAR(100) NOT NULL,
    descripcion_s VARCHAR(255)
);

-- =============================================
-- TABLA: RELACION AMBIENTE_SERVICIO

CREATE TABLE ambiente_servicio (
    id_a INT,
    id_s INT,
    PRIMARY KEY(id_a, id_s),
    FOREIGN KEY(id_a) REFERENCES ambiente(id_a),
    FOREIGN KEY(id_s) REFERENCES servicio(id_s)
);



-- =============================================
-- EVENTO REALIZADOS SOCIAL


CREATE TABLE evento_realizado (
    id_er INT AUTO_INCREMENT PRIMARY KEY,
    nombre_er VARCHAR(150) NOT NULL,
    descripcion_er VARCHAR (255),
    fecha_er DATE,
    id_tipo_eves INT,
    id_a INT,
    FOREIGN KEY(id_tipo_eves) REFERENCES tipo_evento(id_tipo_eves),
    FOREIGN KEY(id_a) REFERENCES ambiente(id_a)
);

-- =============================================
-- TABLA: RESERVAS


CREATE TABLE reserva (
  id_rese           INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  fecha_evento_rese DATE         NOT NULL,
  invitados_rese    INT  NOT NULL,
  presupuesto_rese  DECIMAL(12,2) NOT NULL,
  ubicacion_rese    VARCHAR(120) NOT NULL,
  Observaciones_rese  VARCHAR(255) NOT NULL,
  total_rese       DECIMAL(12,7) NOT NULL DEFAULT 0,
  estado_rese      ENUM('pendiente','confirmada','cancelada','completada') NOT NULL DEFAULT 'pendiente',
  creado_en_rese    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_u INT NOT NULL,
  FOREIGN KEY (id_u) REFERENCES usuario(id_u) ON DELETE CASCADE,
  id_er INT NOT NULL, 
  FOREIGN KEY (id_er) REFERENCES evento_realizado(id_er) ON DELETE CASCADE
  );
  
  
-- =============================================
-- TABLA: SEGUIMIENTO RESERVA

CREATE TABLE seguimiento_reserva (
    id_seguimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_rese INT NOT NULL,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    comentario TEXT,
    FOREIGN KEY(id_rese) REFERENCES reserva(id_rese)
);


-- =============================================
-- TABLA: COPIA_SEGURIDAD


CREATE TABLE copia_seguridad (
    id_cs INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tabla_cs VARCHAR(50),
    fecha_cs DATETIME DEFAULT CURRENT_TIMESTAMP,
    datos_json_cs JSON
);