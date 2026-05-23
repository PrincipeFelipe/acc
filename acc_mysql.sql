-- ==========================================
-- ESTRUCTURA DE LA BASE DE DATOS ACC (MYSQL)
-- Compatible con XAMPP (Local) y Plesk (Producción)
-- ==========================================

CREATE DATABASE IF NOT EXISTS `acc_` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `acc_`;

-- 1. Categorías de trabajos
CREATE TABLE IF NOT EXISTS `categorias` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(255) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Trabajos (Proyectos)
CREATE TABLE IF NOT EXISTS `trabajos` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `titulo` VARCHAR(255) NOT NULL UNIQUE,
    `descripcion` TEXT,
    `categoria_id` BIGINT NULL,
    `ubicacion` VARCHAR(255) DEFAULT NULL,
    `destacado` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Imágenes de trabajos
CREATE TABLE IF NOT EXISTS `trabajo_imagenes` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `trabajo_id` BIGINT NOT NULL,
    `url` VARCHAR(500) NOT NULL UNIQUE,
    `es_principal` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`trabajo_id`) REFERENCES `trabajos`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Promociones
CREATE TABLE IF NOT EXISTS `promociones` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `titulo` VARCHAR(255) NOT NULL UNIQUE,
    `descripcion` TEXT,
    `imagen_url` VARCHAR(500) DEFAULT NULL,
    `precio` VARCHAR(100) DEFAULT NULL,
    `ubicacion` VARCHAR(255) DEFAULT NULL,
    `habitaciones` INT DEFAULT NULL,
    `banos` INT DEFAULT NULL,
    `metros_cuadrados` VARCHAR(50) DEFAULT NULL,
    `etiqueta` VARCHAR(100) DEFAULT NULL,
    `etiqueta_color` VARCHAR(50) DEFAULT 'blue',
    `activa` TINYINT(1) DEFAULT 1,
    `destacada` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Mensajes de contacto
CREATE TABLE IF NOT EXISTS `mensajes_contacto` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `telefono` VARCHAR(50) DEFAULT NULL,
    `mensaje` TEXT NOT NULL,
    `leido` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Usuarios administradores
CREATE TABLE IF NOT EXISTS `usuarios` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- DATOS SEMILLA (SEED DATA)
-- ==========================================

-- 1. Categorías
INSERT IGNORE INTO `categorias` (`id`, `nombre`) VALUES 
(1, 'Edificación'), 
(2, 'Obra Civil'), 
(3, 'Reformas'), 
(4, 'Mantenimiento');

-- 2. Trabajos (Proyectos)
INSERT IGNORE INTO `trabajos` (`id`, `titulo`, `descripcion`, `categoria_id`, `ubicacion`, `destacado`) VALUES 
(1, 'Villa Lujo Costa del Sol', 'Vivienda unifamiliar de diseño minimalista con vistas al Mediterráneo. Materiales nobles y eficiencia energética A+.', 1, 'Marbella, España', 1),
(2, 'Restauración Palacio Histórico', 'Rehabilitación integral de fachada y refuerzo estructural manteniendo los elementos ornamentales originales del siglo XIX.', 3, 'Madrid, España', 1),
(3, 'Puente Gran Vía Autopista', 'Construcción de viaducto de 120 metros con tecnología de hormigón pretensado y acabados de seguridad de última generación.', 2, 'Sevilla, España', 1),
(4, 'Complejo de Oficinas GreenTech', 'Edificio corporativo con certificación LEED Platinum, jardines verticales y sistemas de climatización pasiva.', 1, 'Barcelona, España', 0);

-- 3. Imágenes de Trabajos
INSERT IGNORE INTO `trabajo_imagenes` (`id`, `trabajo_id`, `url`, `es_principal`) VALUES 
(1, 1, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070', 1),
(2, 2, 'https://images.unsplash.com/photo-1517581177697-0005ec4a0041?q=80&w=2070', 1),
(3, 3, 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070', 1),
(4, 4, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070', 1);

-- 4. Promociones
INSERT IGNORE INTO `promociones` (`id`, `titulo`, `descripcion`, `imagen_url`, `precio`, `ubicacion`, `habitaciones`, `banos`, `metros_cuadrados`, `etiqueta`, `etiqueta_color`, `activa`, `destacada`) VALUES 
(1, 'Residencial Sky Horizon', 'Últimas 4 viviendas disponibles en el cielo de Benidorm. Terrazas de 40m2 y piscina infinity.', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070', 'Desde 450.000€', 'Alicante, España', 3, 2, '145 m2', 'En Construcción', 'blue', 1, 1),
(2, 'Mirador del Valle', 'Exclusivos chalets pareados en zona residencial tranquila. Entrega inmediata.', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075', '320.000€', 'Guadalajara, España', 4, 3, '180 m2', 'Listo para Entrar', 'green', 1, 0);

-- 5. Usuario Administrador por defecto
-- Contraseña en texto plano: ACC_Admin_2024!
-- Hash generado mediante password_hash('ACC_Admin_2024!', PASSWORD_BCRYPT)
INSERT IGNORE INTO `usuarios` (`id`, `email`, `password_hash`) VALUES 
(1, 'admin@acc-construccion.com', '$2y$10$7R4d7gUspX2f/vV.qG1DqO0FkG0qj/Qf5G5zJbH4Z0v7wO6o0gK9y');
