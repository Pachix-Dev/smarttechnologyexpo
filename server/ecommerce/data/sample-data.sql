-- ================================================================
-- DATOS DE EJEMPLO PARA E-COMMERCE
-- Smart Technology Expo 2026
-- ================================================================

-- ================================================================
-- 1. PRODUCTOS - MUJERES NETWORKING
-- ================================================================
INSERT INTO products (
  name, 
  description, 
  product_type, 
  category, 
  event_date, 
  price, 
  capacity_limit, 
  status
) VALUES (
  'Desayuno Mujeres Networking',
  'Únete a un desayuno inspirador con conferencias de mujeres líderes en tecnología. Conoce a profesionales, expande tu red y descubre nuevas oportunidades.',
  'event',
  'womens_networking',
  '2026-09-15 07:30:00',
  50.00,
  150,
  'active'
);

-- ================================================================
-- 2. PRODUCTOS - DRONE INNOVATIONS FORUM (3 talleres)
-- ================================================================
INSERT INTO products (
  name,
  description,
  product_type,
  category,
  event_date,
  price,
  capacity_limit,
  status
) VALUES (
  'Taller: Introducción a Drones Comerciales',
  'Aprende los conceptos básicos de operación de drones comerciales. Incluye demostración en vivo y sesión de preguntas.',
  'workshop',
  'drone_innovations',
  '2026-09-16 09:00:00',
  75.00,
  40,
  'active'
);

INSERT INTO products (
  name,
  description,
  product_type,
  category,
  event_date,
  price,
  capacity_limit,
  status
) VALUES (
  'Taller: Fotogrametría y Mapeo con Drones',
  'Domina técnicas avanzadas de captura de datos y procesamiento de imágenes. Ideal para profesionales en topografía y construcción.',
  'workshop',
  'drone_innovations',
  '2026-09-16 14:00:00',
  85.00,
  30,
  'active'
);

INSERT INTO products (
  name,
  description,
  product_type,
  category,
  event_date,
  price,
  capacity_limit,
  status
) VALUES (
  'Taller: Regulación y Seguridad Aérea',
  'Entiende la normativa actual para operación de drones. Cobertura de leyes, seguros y buenas prácticas de seguridad.',
  'workshop',
  'drone_innovations',
  '2026-09-17 10:00:00',
  60.00,
  50,
  'active'
);

-- ================================================================
-- 3. PRODUCTOS - TALLERES CSIA
-- ================================================================
INSERT INTO products (
  name,
  description,
  product_type,
  category,
  event_date,
  price,
  capacity_limit,
  status
) VALUES (
  'Taller: Seguridad en Sistemas IoT',
  'Explora vulnerabilidades comunes en dispositivos IoT y cómo protegerlos. Laboratorio práctico incluido.',
  'workshop',
  'csia',
  '2026-09-18 09:00:00',
  70.00,
  35,
  'active'
);

INSERT INTO products (
  name,
  description,
  product_type,
  category,
  event_date,
  price,
  capacity_limit,
  status
) VALUES (
  'Taller: Ciberataques y Respuesta ante Incidentes',
  'Aprende a detectar, responder y mitigar ciberataques. Casos de estudio reales y simulaciones.',
  'workshop',
  'csia',
  '2026-09-18 14:00:00',
  80.00,
  40,
  'active'
);

INSERT INTO products (
  name,
  description,
  product_type,
  category,
  event_date,
  price,
  capacity_limit,
  status
) VALUES (
  'Taller: Compliance y Normativas de Ciberseguridad',
  'Entiende GDPR, HIPAA, NOM-051 y otras regulaciones. Cómo implementarlas en tu organización.',
  'workshop',
  'csia',
  '2026-09-19 09:00:00',
  65.00,
  45,
  'active'
);

-- ================================================================
-- 4. CUPONES DE PRUEBA
-- ================================================================
INSERT INTO coupons (
  name,
  description,
  discount_value,
  code,
  status
) VALUES (
  'Descuento Temprano',
  'Descuento del 15% para los primeros compradores',
  15.00,
  'TEMPRANO15',
  'active'
);

INSERT INTO coupons (
  name,
  description,
  discount_value,
  code,
  status
) VALUES (
  'Descuento Educativo',
  'Descuento de $20 para estudiantes y educadores',
  20.00,
  'EDUCATIVO20',
  'active'
);

INSERT INTO coupons (
  name,
  description,
  discount_value,
  code,
  status
) VALUES (
  'Código Especial VIP',
  'Descuento del 25% para asistentes VIP',
  25.00,
  'VIP25',
  'active'
);

INSERT INTO coupons (
  name,
  description,
  discount_value,
  code,
  status
) VALUES (
  'Descuento Grupal',
  'Descuento del 10% al comprar 5 o más accesos',
  10.00,
  'GRUPO10',
  'active'
);

INSERT INTO coupons (
  name,
  description,
  discount_value,
  code,
  status
) VALUES (
  'Código Inactivo',
  'Este cupón no está disponible',
  50.00,
  'NOACTIVO50',
  'inactive'
);

-- ================================================================
-- NOTAS:
-- - Los productos están configurados con capacidad limitada
-- - Los precios están en USD
-- - Los cupones pueden ser porcentajes (< 100) o montos fijos (>= 100)
-- - Modifica dates, prices y capacities según necesites
-- - La tabla visitors_ste_2026 debe existir previamente
-- ================================================================
