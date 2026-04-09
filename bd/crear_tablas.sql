-- Se maneja la eliminacion y creacion de tablas
USE espacios_bo;

DROP TABLE IF EXISTS `logs-cambios`;

DROP TABLE IF EXISTS `tarjetas-usuarios`;

DROP TABLE IF EXISTS `transferencias-reservas`;

DROP TABLE IF EXISTS `empresas`;

DROP TABLE IF EXISTS `presidentes-otb`;

DROP TABLE IF EXISTS `permisos-eventos`;

DROP TABLE IF EXISTS `eventos`;

DROP TABLE IF EXISTS `reservas`;

DROP TABLE IF EXISTS `usuarios`;

DROP TABLE IF EXISTS `estados`;

DROP TABLE IF EXISTS `permisos`;

DROP TABLE IF EXISTS `tipos-eventos`;

DROP TABLE IF EXISTS `espacios-publicos`;

DROP TABLE IF EXISTS roles;

CREATE TABLE `roles` (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    rol VARCHAR(15) NOT NULL
);

CREATE TABLE `estados` (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    estado VARCHAR(25)
);

CREATE TABLE `usuarios` (
    ci INT PRIMARY KEY,
    nombre VARCHAR(100),
    ap_paterno VARCHAR(50),
    ap_materno VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    contrasena VARCHAR(255),
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    rol INT,
    estado INT DEFAULT 1,
    FOREIGN KEY (rol) REFERENCES `roles` (_id),
    FOREIGN KEY (estado) REFERENCES `estados` (_id)
);

CREATE TABLE `presidentes-otb` (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    usuario INT,
    otb VARCHAR(100),
    documento BLOB,
    FOREIGN KEY (usuario) REFERENCES `usuarios` (ci)
);

CREATE TABLE empresas (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    usuario INT,
    empresa VARCHAR(100),
    documento BLOB,
    FOREIGN KEY (usuario) REFERENCES `usuarios` (ci)
);

CREATE TABLE `espacios-publicos` (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    altitud DECIMAL(9, 6),
    latitud DECIMAL(9, 6),
    descripcion TEXT,
    url_imagen VARCHAR(255),
    tipo VARCHAR(10)
);

CREATE TABLE reservas (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    usuario INT,
    espacio_publico INT,
    fecha DATE,
    hora_inicio TIME,
    hora_fin TIME,
    estado INT DEFAULT 1,
    FOREIGN KEY (usuario) REFERENCES `usuarios` (ci),
    FOREIGN KEY (espacio_publico) REFERENCES `espacios-publicos` (_id),
    FOREIGN KEY (estado) REFERENCES `estados` (_id)
);

CREATE TABLE `tipos-eventos` (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50)
);

CREATE TABLE eventos (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    reserva INT,
    tipo_evento INT,
    nombre VARCHAR(255),
    descripcion TEXT,
    fecha_evento DATE,
    FOREIGN KEY (reserva) REFERENCES `reservas` (_id),
    FOREIGN KEY (tipo_evento) REFERENCES `tipos-eventos` (_id)
);

CREATE TABLE permisos (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE `permisos-eventos` (
    evento INT,
    permiso INT,
    documento BLOB,
    estado INT DEFAULT 1,
    PRIMARY KEY (evento, permiso),
    FOREIGN KEY (evento) REFERENCES `eventos` (_id),
    FOREIGN KEY (permiso) REFERENCES `permisos` (_id),
    FOREIGN KEY (estado) REFERENCES `estados` (_id)
);

CREATE TABLE `transferencias-reservas` (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    reserva INT,
    usuario_origen INT,
    usuario_destino INT,
    fecha DATE DEFAULT(CURRENT_DATE),
    estado INT DEFAULT 1,
    FOREIGN KEY (reserva) REFERENCES `reservas` (_id),
    FOREIGN KEY (usuario_origen) REFERENCES `usuarios` (ci),
    FOREIGN KEY (usuario_destino) REFERENCES `usuarios` (ci),
    FOREIGN KEY (estado) REFERENCES `estados` (_id)
);

CREATE TABLE `tarjetas-usuarios` (
    usuario INT,
    numero_tarjeta VARCHAR(19),
    saldo DECIMAL(9.6),
    caducidad DATE,
    cvc VARCHAR(4),
    PRIMARY KEY (usuario, numero_tarjeta),
    FOREIGN KEY (usuario) REFERENCES `usuarios` (ci)
);

CREATE TABLE `logs-cambios` (
    _id SERIAL PRIMARY KEY,
    tabla VARCHAR(50),
    operacion VARCHAR(10),
    registro_id INT,
    email_usuario VARCHAR(255),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    datos_previos JSON,
    datos_nuevos JSON
);