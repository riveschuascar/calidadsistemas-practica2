-- Creacion de indices
USE espacios_bo;
-- USUARIOS
CREATE INDEX idxusuarios_estado_rol ON `usuarios` (estado, rol);
-- ESPACIOS PUBLICOS
CREATE INDEX idxespacios_nombre ON `espacios-publicos` (nombre);
CREATE INDEX idxespacios_tipo ON `espacios-publicos` (tipo);