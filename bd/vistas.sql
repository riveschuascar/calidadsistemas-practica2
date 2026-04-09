-- Creacion de vistas
USE espacios_bo;

DROP PROCEDURE IF EXISTS actualizar_eventos_pasados;
DROP VIEW IF EXISTS `usuarios-pendientes`;
DROP VIEW IF EXISTS `transferencias-pendientes`;
DROP VIEW IF EXISTS `eventos-futuros`;

CREATE VIEW `usuarios-pendientes` AS
SELECT
    CONCAT_WS(' ', u.nombre, u.ap_paterno, u.ap_materno) as nombre,
    u.email AS correo,
    u.telefono AS telefono
FROM `usuarios` AS u 
LEFT JOIN `empresas` AS e ON u.ci = e.usuario
LEFT JOIN `presidentes-otb` as pr ON u.ci = pr.usuario
WHERE u.estado = 1 AND u.rol NOT IN (1, 2);

CREATE VIEW `transferencias-pendientes` AS
SELECT *
FROM `transferencias-reservas` AS t
WHERE t.estado = 1;

CREATE VIEW `eventos-futuros` AS
SELECT
    e.nombre AS evento,
    e.descripcion AS descripcion,
    e.fecha_evento AS fecha,
    ep.nombre AS lugar
FROM
    `eventos` AS e
    INNER JOIN `reservas` AS r ON e.reserva = r._id
    INNER JOIN `espacios-publicos` AS ep ON r.espacio_publico = ep._id
WHERE
    r.estado = 4
    AND e.fecha_evento >= CURRENT_DATE;

-- VISTAS "MATERIALIZADAS"

DROP TABLE IF EXISTS `vw-eventos-pasados`;

CREATE TABLE `vw-eventos-pasados` (
    _id INT PRIMARY KEY,
    evento VARCHAR(255),
    descripcion TEXT,
    fecha DATE,
    lugar VARCHAR(100),
    INDEX (fecha, lugar, evento),
    FOREIGN KEY (_id) REFERENCES eventos(_id)
);

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE actualizar_eventos_pasados()
BEGIN
    UPDATE `vw-eventos-pasados` pas
    JOIN `eventos` e ON ep._id = e._id
    JOIN `reservas` r ON e.reserva = r._id
    JOIN `espacios-publicos` ep ON r.espacio_publico = ep._id
    SET
        pas.evento = e.nombre,
        pas.descripcion = e.descripcion,
        pas.fecha = e.fecha_evento,
        pas.lugar = epb.nombre
    WHERE e.fecha_evento <= CURRENT_DATE;

    INSERT INTO `vw-eventos-pasados` (_id, evento, descripcion, fecha, lugar)
    SELECT
        e._id,
        e.nombre,
        e.descripcion,
        e.fecha_evento,
        epb.nombre
    FROM eventos e
    INNER JOIN `reservas` r ON e.reserva = r._id
    INNER JOIN `espacios-publicos` epb ON r.espacio_publico = epb._id
    WHERE e.fecha_evento <= CURRENT_DATE
    AND NOT EXISTS (
        SELECT 1
        FROM `vw-eventos-pasados` AS pas
        WHERE pas._id = e._id
    );
END$$

DELIMITER ;

CREATE EVENT evento_actualizar_eventos_pasados ON SCHEDULE EVERY 1 DAY DO
CALL actualizar_eventos_pasados ();