-- =============================================
-- Sistema de Reservas de Canchas Sintéticas
-- Script de creación de base de datos
-- =============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS reservas_canchas;
USE reservas_canchas;

-- =============================================
-- Tabla: administrators
-- Descripción: Almacena los usuarios administradores
-- =============================================
CREATE TABLE IF NOT EXISTS administrators (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('super_admin', 'admin', 'operator') DEFAULT 'operator',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- =============================================
-- Tabla: court_types
-- Descripción: Tipos de canchas disponibles
-- =============================================
CREATE TABLE IF NOT EXISTS court_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    players_per_team INT NOT NULL,
    dimensions VARCHAR(50),
    default_price DECIMAL(10, 2) NOT NULL,
    icon VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar tipos de canchas predeterminados
INSERT INTO court_types (code, name, description, players_per_team, dimensions, default_price, icon) VALUES
('futbol_5', 'Fútbol 5', 'Cancha sintética para 5 jugadores por equipo', 5, '25m x 15m', 80000.00, '⚽'),
('futbol_8', 'Fútbol 8', 'Cancha sintética para 8 jugadores por equipo', 8, '50m x 30m', 120000.00, '⚽'),
('futbol_11', 'Fútbol 11', 'Cancha sintética profesional para 11 jugadores por equipo', 11, '100m x 65m', 180000.00, '🏟️');

-- =============================================
-- Tabla: courts
-- Descripción: Canchas disponibles para reserva
-- =============================================
CREATE TABLE IF NOT EXISTS courts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    court_type_id INT NOT NULL,
    description TEXT,
    amenities JSON,
    images JSON,
    is_active BOOLEAN DEFAULT TRUE,
    is_covered BOOLEAN DEFAULT FALSE,
    surface_quality ENUM('standard', 'premium', 'professional') DEFAULT 'standard',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (court_type_id) REFERENCES court_types(id),
    INDEX idx_court_type (court_type_id),
    INDEX idx_is_active (is_active)
);

-- =============================================
-- Tabla: operating_hours
-- Descripción: Horarios de funcionamiento por cancha y día
-- =============================================
CREATE TABLE IF NOT EXISTS operating_hours (
    id INT PRIMARY KEY AUTO_INCREMENT,
    court_id INT NOT NULL,
    day_of_week TINYINT NOT NULL, -- 0 = Domingo, 6 = Sábado
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE,
    UNIQUE KEY unique_court_day (court_id, day_of_week),
    INDEX idx_court_day (court_id, day_of_week)
);

-- =============================================
-- Tabla: time_slot_categories
-- Descripción: Categorías de franjas horarias (mañana, tarde, noche)
-- =============================================
CREATE TABLE IF NOT EXISTS time_slot_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    price_multiplier DECIMAL(3, 2) DEFAULT 1.00,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar categorías de franjas horarias predeterminadas
INSERT INTO time_slot_categories (code, name, start_time, end_time, price_multiplier, description) VALUES
('morning', 'Mañana', '06:00:00', '12:00:00', 0.80, 'Horario matutino con 20% de descuento'),
('afternoon', 'Tarde', '12:00:00', '18:00:00', 1.00, 'Horario regular de tarde'),
('night', 'Noche', '18:00:00', '23:00:00', 1.20, 'Horario nocturno con 20% de recargo');

-- =============================================
-- Tabla: court_pricing
-- Descripción: Precios personalizados por cancha, día y franja horaria
-- =============================================
CREATE TABLE IF NOT EXISTS court_pricing (
    id INT PRIMARY KEY AUTO_INCREMENT,
    court_id INT NOT NULL,
    day_of_week TINYINT, -- NULL = aplica todos los días
    time_slot_category_id INT,
    specific_hour TIME, -- Para precios por hora específica
    price DECIMAL(10, 2) NOT NULL,
    is_special_price BOOLEAN DEFAULT FALSE,
    special_price_reason VARCHAR(100),
    valid_from DATE,
    valid_until DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE,
    FOREIGN KEY (time_slot_category_id) REFERENCES time_slot_categories(id),
    INDEX idx_court_pricing (court_id, day_of_week, time_slot_category_id)
);

-- =============================================
-- Tabla: customers
-- Descripción: Clientes que realizan reservas
-- =============================================
CREATE TABLE IF NOT EXISTS customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    document_type ENUM('CC', 'CE', 'NIT', 'PASSPORT') DEFAULT 'CC',
    document_number VARCHAR(20),
    address TEXT,
    is_frequent_customer BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_document (document_number)
);

-- =============================================
-- Tabla: reservations
-- Descripción: Reservas realizadas
-- =============================================
CREATE TABLE IF NOT EXISTS reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reservation_code VARCHAR(20) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    court_id INT NOT NULL,
    reservation_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    deposit_amount DECIMAL(10, 2) DEFAULT 0,
    deposit_paid BOOLEAN DEFAULT FALSE,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show') DEFAULT 'pending',
    payment_status ENUM('pending', 'partial', 'paid', 'refunded') DEFAULT 'pending',
    payment_method ENUM('cash', 'card', 'transfer', 'online') NULL,
    notes TEXT,
    cancelled_at TIMESTAMP NULL,
    cancellation_reason TEXT,
    confirmed_at TIMESTAMP NULL,
    confirmed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (court_id) REFERENCES courts(id),
    FOREIGN KEY (confirmed_by) REFERENCES administrators(id),
    INDEX idx_reservation_code (reservation_code),
    INDEX idx_court_date (court_id, reservation_date),
    INDEX idx_customer (customer_id),
    INDEX idx_status (status),
    INDEX idx_date_time (reservation_date, start_time)
);

-- =============================================
-- Tabla: payments
-- Descripción: Registro de pagos realizados
-- =============================================
CREATE TABLE IF NOT EXISTS payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reservation_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cash', 'card', 'transfer', 'online') NOT NULL,
    payment_reference VARCHAR(100),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_type ENUM('deposit', 'full', 'partial', 'refund') NOT NULL,
    notes TEXT,
    processed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id),
    FOREIGN KEY (processed_by) REFERENCES administrators(id),
    INDEX idx_reservation (reservation_id),
    INDEX idx_payment_date (payment_date)
);

-- =============================================
-- Tabla: blocked_slots
-- Descripción: Franjas horarias bloqueadas (mantenimiento, eventos, etc.)
-- =============================================
CREATE TABLE IF NOT EXISTS blocked_slots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    court_id INT NOT NULL,
    blocked_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    reason VARCHAR(200),
    blocked_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE,
    FOREIGN KEY (blocked_by) REFERENCES administrators(id),
    INDEX idx_court_date (court_id, blocked_date)
);

-- =============================================
-- Tabla: special_dates
-- Descripción: Fechas especiales con precios o configuraciones especiales
-- =============================================
CREATE TABLE IF NOT EXISTS special_dates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_multiplier DECIMAL(3, 2) DEFAULT 1.00,
    is_holiday BOOLEAN DEFAULT FALSE,
    is_open BOOLEAN DEFAULT TRUE,
    special_open_time TIME,
    special_close_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (date)
);

-- =============================================
-- Tabla: business_settings
-- Descripción: Configuraciones generales del negocio
-- =============================================
CREATE TABLE IF NOT EXISTS business_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(50) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar configuraciones predeterminadas
INSERT INTO business_settings (setting_key, setting_value, setting_type, description) VALUES
('business_name', 'Canchas El Golazo', 'string', 'Nombre del negocio'),
('business_address', 'Calle 123 #45-67, Bogotá', 'string', 'Dirección del negocio'),
('business_phone', '+57 300 123 4567', 'string', 'Teléfono de contacto'),
('business_email', 'reservas@elgolazo.com', 'string', 'Email de contacto'),
('business_description', 'Las mejores canchas sintéticas de la ciudad para disfrutar del fútbol con amigos y familia.', 'string', 'Descripción del negocio'),
('slot_duration_minutes', '60', 'number', 'Duración en minutos de cada franja horaria'),
('min_advance_hours', '2', 'number', 'Horas mínimas de anticipación para reservar'),
('max_advance_days', '30', 'number', 'Días máximos de anticipación para reservar'),
('deposit_percentage', '30', 'number', 'Porcentaje de depósito requerido'),
('cancellation_hours', '24', 'number', 'Horas antes para cancelar sin penalización'),
('allow_online_payment', 'true', 'boolean', 'Permitir pagos en línea'),
('whatsapp_number', '+57 300 123 4567', 'string', 'Número de WhatsApp para reservas'),
('social_instagram', '@canchaselgolazo', 'string', 'Usuario de Instagram'),
('social_facebook', 'CanchasElGolazo', 'string', 'Página de Facebook');

-- =============================================
-- Tabla: audit_log
-- Descripción: Registro de actividades para auditoría
-- =============================================
CREATE TABLE IF NOT EXISTS audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    user_type ENUM('admin', 'customer', 'system') NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id, user_type),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at)
);

-- =============================================
-- Vistas útiles
-- =============================================

-- Vista: Disponibilidad de canchas para hoy
CREATE OR REPLACE VIEW v_today_availability AS
SELECT 
    c.id AS court_id,
    c.name AS court_name,
    ct.name AS court_type,
    oh.open_time,
    oh.close_time,
    COALESCE(
        (SELECT COUNT(*) FROM reservations r 
         WHERE r.court_id = c.id 
         AND r.reservation_date = CURDATE() 
         AND r.status IN ('pending', 'confirmed')),
        0
    ) AS reservations_today
FROM courts c
JOIN court_types ct ON c.court_type_id = ct.id
LEFT JOIN operating_hours oh ON c.id = oh.court_id AND oh.day_of_week = DAYOFWEEK(CURDATE()) - 1
WHERE c.is_active = TRUE;

-- Vista: Resumen de reservas por mes
CREATE OR REPLACE VIEW v_monthly_reservations AS
SELECT 
    YEAR(reservation_date) AS year,
    MONTH(reservation_date) AS month,
    COUNT(*) AS total_reservations,
    SUM(CASE WHEN status = 'confirmed' OR status = 'completed' THEN 1 ELSE 0 END) AS confirmed_reservations,
    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_reservations,
    SUM(total_price) AS total_revenue,
    SUM(CASE WHEN payment_status = 'paid' THEN total_price ELSE 0 END) AS collected_revenue
FROM reservations
GROUP BY YEAR(reservation_date), MONTH(reservation_date)
ORDER BY year DESC, month DESC;

-- =============================================
-- Procedimientos almacenados
-- =============================================

-- Procedimiento: Obtener franjas horarias disponibles para una cancha en una fecha
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS sp_get_available_slots(
    IN p_court_id INT,
    IN p_date DATE
)
BEGIN
    DECLARE v_day_of_week TINYINT;
    DECLARE v_open_time TIME;
    DECLARE v_close_time TIME;
    DECLARE v_slot_duration INT;
    
    SET v_day_of_week = DAYOFWEEK(p_date) - 1;
    
    -- Obtener horario de operación
    SELECT open_time, close_time INTO v_open_time, v_close_time
    FROM operating_hours
    WHERE court_id = p_court_id AND day_of_week = v_day_of_week AND is_open = TRUE;
    
    -- Obtener duración de slot
    SELECT CAST(setting_value AS UNSIGNED) INTO v_slot_duration
    FROM business_settings
    WHERE setting_key = 'slot_duration_minutes';
    
    IF v_slot_duration IS NULL THEN
        SET v_slot_duration = 60;
    END IF;
    
    -- Generar y devolver slots disponibles
    WITH RECURSIVE time_slots AS (
        SELECT v_open_time AS slot_time
        UNION ALL
        SELECT ADDTIME(slot_time, SEC_TO_TIME(v_slot_duration * 60))
        FROM time_slots
        WHERE ADDTIME(slot_time, SEC_TO_TIME(v_slot_duration * 60)) <= v_close_time
    )
    SELECT 
        ts.slot_time AS start_time,
        ADDTIME(ts.slot_time, SEC_TO_TIME(v_slot_duration * 60)) AS end_time,
        CASE 
            WHEN r.id IS NOT NULL THEN 'reserved'
            WHEN bs.id IS NOT NULL THEN 'blocked'
            ELSE 'available'
        END AS status
    FROM time_slots ts
    LEFT JOIN reservations r ON r.court_id = p_court_id 
        AND r.reservation_date = p_date 
        AND r.start_time = ts.slot_time
        AND r.status IN ('pending', 'confirmed')
    LEFT JOIN blocked_slots bs ON bs.court_id = p_court_id
        AND bs.blocked_date = p_date
        AND ts.slot_time >= bs.start_time
        AND ts.slot_time < bs.end_time
    WHERE ts.slot_time < v_close_time;
END //
DELIMITER ;

-- Procedimiento: Crear una nueva reserva
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS sp_create_reservation(
    IN p_customer_name VARCHAR(100),
    IN p_customer_email VARCHAR(100),
    IN p_customer_phone VARCHAR(20),
    IN p_court_id INT,
    IN p_date DATE,
    IN p_start_time TIME,
    IN p_end_time TIME,
    OUT p_reservation_id INT,
    OUT p_reservation_code VARCHAR(20)
)
BEGIN
    DECLARE v_customer_id INT;
    DECLARE v_duration INT;
    DECLARE v_price DECIMAL(10,2);
    DECLARE v_code VARCHAR(20);
    
    -- Verificar disponibilidad
    IF EXISTS (
        SELECT 1 FROM reservations 
        WHERE court_id = p_court_id 
        AND reservation_date = p_date
        AND status IN ('pending', 'confirmed')
        AND (
            (start_time <= p_start_time AND end_time > p_start_time) OR
            (start_time < p_end_time AND end_time >= p_end_time) OR
            (start_time >= p_start_time AND end_time <= p_end_time)
        )
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El horario seleccionado no está disponible';
    END IF;
    
    -- Buscar o crear cliente
    SELECT id INTO v_customer_id FROM customers WHERE email = p_customer_email;
    
    IF v_customer_id IS NULL THEN
        INSERT INTO customers (full_name, email, phone)
        VALUES (p_customer_name, p_customer_email, p_customer_phone);
        SET v_customer_id = LAST_INSERT_ID();
    ELSE
        UPDATE customers SET full_name = p_customer_name, phone = p_customer_phone
        WHERE id = v_customer_id;
    END IF;
    
    -- Calcular duración
    SET v_duration = TIMESTAMPDIFF(MINUTE, p_start_time, p_end_time);
    
    -- Obtener precio (simplificado - se puede mejorar con lógica de pricing)
    SELECT ct.default_price INTO v_price
    FROM courts c
    JOIN court_types ct ON c.court_type_id = ct.id
    WHERE c.id = p_court_id;
    
    -- Generar código único
    SET v_code = CONCAT('RES-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 10000), 4, '0'));
    
    -- Crear reserva
    INSERT INTO reservations (
        reservation_code, customer_id, court_id, reservation_date,
        start_time, end_time, duration_minutes, total_price, status
    ) VALUES (
        v_code, v_customer_id, p_court_id, p_date,
        p_start_time, p_end_time, v_duration, v_price, 'pending'
    );
    
    SET p_reservation_id = LAST_INSERT_ID();
    SET p_reservation_code = v_code;
END //
DELIMITER ;

-- =============================================
-- Triggers
-- =============================================

-- Trigger: Registrar cambios en reservas
DELIMITER //
CREATE TRIGGER IF NOT EXISTS tr_reservation_audit
AFTER UPDATE ON reservations
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (user_type, action, entity_type, entity_id, old_values, new_values)
    VALUES (
        'system',
        CASE 
            WHEN NEW.status != OLD.status THEN CONCAT('status_changed_to_', NEW.status)
            ELSE 'updated'
        END,
        'reservation',
        NEW.id,
        JSON_OBJECT('status', OLD.status, 'payment_status', OLD.payment_status),
        JSON_OBJECT('status', NEW.status, 'payment_status', NEW.payment_status)
    );
END //
DELIMITER ;

-- =============================================
-- Insertar datos de ejemplo
-- =============================================

-- Administrador por defecto (contraseña: admin123 - debe cambiarse en producción)
INSERT INTO administrators (username, password_hash, email, full_name, role)
VALUES ('admin', '$2b$10$X7UrE3Y5v.XZsCmQ6Q4h4eTCT3L/kq6X0sU2C9v/rM4lQf8XQ6X6i', 'admin@elgolazo.com', 'Administrador Principal', 'super_admin');

-- Canchas de ejemplo
INSERT INTO courts (name, court_type_id, description, amenities, images, surface_quality) VALUES
('Cancha Principal', 1, 'Nuestra cancha estrella con césped sintético de última generación, iluminación LED profesional y graderías.', '["Iluminación LED", "Graderías", "Vestuarios", "Parqueadero"]', '[]', 'premium'),
('Cancha Norte', 1, 'Cancha ideal para partidos casuales y entrenamientos.', '["Iluminación", "Vestuarios"]', '[]', 'standard'),
('Cancha Sur', 1, 'Perfecta para grupos pequeños y prácticas.', '["Iluminación", "Vestuarios"]', '[]', 'standard'),
('Cancha Profesional', 2, 'Cancha de mayor tamaño perfecta para partidos competitivos.', '["Iluminación LED", "Graderías", "Vestuarios", "Cafetería", "Parqueadero"]', '[]', 'professional'),
('Estadio Central', 3, 'Cancha profesional tamaño completo para torneos y eventos especiales.', '["Iluminación LED Pro", "Graderías cubiertas", "Vestuarios premium", "Cafetería", "Parqueadero VIP", "Sistema de sonido"]', '[]', 'professional');

-- Horarios de operación para todas las canchas (Lunes a Domingo 6am-11pm)
INSERT INTO operating_hours (court_id, day_of_week, open_time, close_time, is_open)
SELECT c.id, d.day, '06:00:00', '23:00:00', TRUE
FROM courts c
CROSS JOIN (SELECT 0 AS day UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6) d;

-- =============================================
-- Índices adicionales para optimización
-- =============================================
CREATE INDEX IF NOT EXISTS idx_reservations_date_status ON reservations(reservation_date, status);
CREATE INDEX IF NOT EXISTS idx_blocked_slots_date ON blocked_slots(blocked_date);
CREATE INDEX IF NOT EXISTS idx_payments_method ON payments(payment_method);

-- =============================================
-- Comentarios finales
-- =============================================
-- Para ejecutar este script:
-- mysql -u root -p < database_schema.sql
--
-- Para producción, recuerde:
-- 1. Cambiar la contraseña del administrador por defecto
-- 2. Configurar las variables de entorno para la conexión
-- 3. Implementar backup automático de la base de datos
-- 4. Revisar y ajustar los índices según el uso real
