-- Creacion de triggers
USE espacios_bo;

DELIMITER $$

CREATE TRIGGER insert_usuarios
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    DECLARE datos_nuevos JSON;
    SET datos_nuevos = JSON_OBJECT('id', NEW.ci, 'nombre', NEW.nombre, 'rol', NEW.rol, 'estado', NEW.estado);
    
    INSERT INTO `logs-cambios` (tabla, operacion, registro_id, email_usuario, datos_previos, datos_nuevos)
    VALUES ('usuarios', 'insert', NEW.ci, @ci_usuario_actual, NULL, datos_nuevos);
END;
$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER update_usuarios
AFTER UPDATE ON usuarios
FOR EACH ROW
BEGIN
    DECLARE datos_previos JSON;
    DECLARE datos_nuevos JSON;
    
    SET datos_previos = JSON_OBJECT('id', OLD.ci, 'nombre', OLD.nombre, 'rol', OLD.rol, 'estado', OLD.estado);
    SET datos_nuevos = JSON_OBJECT('id', NEW.ci, 'nombre', NEW.nombre, 'rol', NEW.rol, 'estado', NEW.estado);
    
    INSERT INTO `logs-cambios` (tabla, operacion, registro_id, email_usuario, datos_previos, datos_nuevos)
    VALUES ('usuarios', 'update', NEW.ci, @ci_usuario_actual, datos_previos, datos_nuevos);
END;
$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER delete_usuarios
AFTER DELETE ON usuarios
FOR EACH ROW
BEGIN
    DECLARE datos_previos JSON;
    
    SET datos_previos = JSON_OBJECT('id', OLD.ci, 'nombre', OLD.nombre, 'rol', OLD.rol, 'estado', OLD.estado);
    
    INSERT INTO `logs-cambios` (tabla, operacion, registro_id, email_usuario, datos_previos, datos_nuevos)
    VALUES ('usuarios', 'delete', OLD.ci, @ci_usuario_actual, datos_previos, NULL);
END;
$$

DELIMITER ;
