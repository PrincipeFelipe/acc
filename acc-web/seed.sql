-- SCRIPT DE DATOS SEMILLA PARA ACC CONSTRUCCIÓN
-- Copia y pega esto en el SQL Editor de tu Dashboard de Supabase

-- 1. Categorías
INSERT INTO categorias (nombre) 
VALUES 
    ('Edificación'), 
    ('Obra Civil'), 
    ('Reformas'), 
    ('Mantenimiento')
ON CONFLICT (nombre) DO NOTHING;

-- 2. Trabajos (Proyectos)
-- Nota: Usamos subconsultas para obtener los IDs de las categorías dinámicamente
INSERT INTO trabajos (titulo, descripcion, categoria_id, ubicacion, destacado)
VALUES 
    (
        'Villa Lujo Costa del Sol', 
        'Vivienda unifamiliar de diseño minimalista con vistas al Mediterráneo. Materiales nobles y eficiencia energética A+.', 
        (SELECT id FROM categorias WHERE nombre = 'Edificación'), 
        'Marbella, España', 
        true
    ),
    (
        'Restauración Palacio Histórico', 
        'Rehabilitación integral de fachada y refuerzo estructural manteniendo los elementos ornamentales originales del siglo XIX.', 
        (SELECT id FROM categorias WHERE nombre = 'Reformas'), 
        'Madrid, España', 
        true
    ),
    (
        'Puente Gran Vía Autopista', 
        'Construcción de viaducto de 120 metros con tecnología de hormigón pretensado y acabados de seguridad de última generación.', 
        (SELECT id FROM categorias WHERE nombre = 'Obra Civil'), 
        'Sevilla, España', 
        true
    ),
    (
        'Complejo de Oficinas GreenTech', 
        'Edificio corporativo con certificación LEED Platinum, jardines verticales y sistemas de climatización pasiva.', 
        (SELECT id FROM categorias WHERE nombre = 'Edificación'), 
        'Barcelona, España', 
        false
    )
ON CONFLICT (titulo) DO NOTHING;

-- 3. Imágenes de Trabajos
INSERT INTO trabajo_imagenes (trabajo_id, url, es_principal)
VALUES 
    ((SELECT id FROM trabajos WHERE titulo = 'Villa Lujo Costa del Sol'), 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070', true),
    ((SELECT id FROM trabajos WHERE titulo = 'Restauración Palacio Histórico'), 'https://images.unsplash.com/photo-1517581177697-0005ec4a0041?q=80&w=2070', true),
    ((SELECT id FROM trabajos WHERE titulo = 'Puente Gran Vía Autopista'), 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070', true),
    ((SELECT id FROM trabajos WHERE titulo = 'Complejo de Oficinas GreenTech'), 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070', true)
ON CONFLICT (url) DO NOTHING;

-- 4. Promociones
INSERT INTO promociones (titulo, descripcion, imagen_url, precio, ubicacion, habitaciones, banos, metros_cuadrados, etiqueta, etiqueta_color, activa, destacada)
VALUES 
    (
        'Residencial Sky Horizon', 
        'Últimas 4 viviendas disponibles en el cielo de Benidorm. Terrazas de 40m2 y piscina infinity.', 
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070', 
        'Desde 450.000€', 
        'Alicante, España', 
        3, 2, '145 m2', 
        'En Construcción', 'blue', 
        true, true
    ),
    (
        'Mirador del Valle', 
        'Exclusivos chalets pareados en zona residencial tranquila. Entrega inmediata.', 
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075', 
        '320.000€', 
        'Guadalajara, España', 
        4, 3, '180 m2', 
        'Listo para Entrar', 'green', 
        true, false
    )
ON CONFLICT (titulo) DO NOTHING;
