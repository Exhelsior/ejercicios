INSERT INTO roles (name_rol) VALUES 
	('Administrador'),
	('Usuario'),
	('Editor'),
	('Moderador');
    
INSERT INTO users (full_name, email, password_hash, document_type, document_number, create_at) VALUES 
	('Juan Pérez', 'juan.perez@example.com', 'hashed_password_1', 'CC', '123456789', NOW()),
	('María Gómez', 'maria.gomez@example.com', 'hashed_password_2', 'TI', '987654321', NOW()),
	('Carlos López', 'carlos.lopez@example.com', 'hashed_password_3', 'CE', '456789123', NOW()),
	('Ana Rodríguez', 'ana.rodriguez@example.com', 'hashed_password_4', 'NIT', '321654987', NOW());

INSERT INTO users_roles (user_id, rol_id) VALUES 
	(1, 1), -- Juan Pérez es Administrador
	(2, 2), -- María Gómez es Usuario
	(3, 3), -- Carlos López es Editor
	(4, 4), -- Ana Rodríguez es Moderador
	(2, 3), -- María Gómez también es Editora
	(3, 2); -- Carlos López también es Usuario

INSERT INTO sessions (user_id, ip_address, started_at, finish_at) VALUES 
(1, '192.168.1.1', NOW(), NULL),  -- Sesión activa de Juan Pérez
(2, '192.168.1.2', NOW(), NOW()), -- Sesión finalizada de María Gómez
(3, '192.168.1.3', NOW(), NULL),  -- Sesión activa de Carlos López
(4, '192.168.1.4', NOW(), NOW()); -- Sesión finalizada de Ana Rodríguez


