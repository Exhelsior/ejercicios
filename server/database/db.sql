create database evaluation;

USE evaluation;

CREATE TABLE roles (
	id_rol INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    name_rol VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE users (
	id_user INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    document_type ENUM('CC' , 'TI', 'CE', 'NIT') NOT NULL,
    document_number VARCHAR(50) NOT NULL UNIQUE,
    create_at DATE
);

CREATE TABLE users_roles (
	id_user_rol INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
    rol_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (rol_id) REFERENCES roles(id_rol) ON DELETE CASCADE
);

CREATE TABLE sessions (
	id_sesiones INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    user_id INT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    started_at DATETIME NOT NULL,
    finish_at DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    reset_code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
);