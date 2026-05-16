-- ============================================================
--  SEED DATA — Datos de ejemplo que replican el mockData.ts
--  Ejecutar DESPUÉS de schema.sql
-- ============================================================

BEGIN;

-- Limpiar datos previos (seguro de correr múltiples veces)
TRUNCATE TABLE
  maintenance_attachments, maintenance_tickets,
  event_incidents, events,
  payments,
  contract_documents, contract_clauses, contracts,
  rental_requests,
  venue_rules, venue_amenities, venue_images, venues,
  notifications,
  evaluations, attendance, enrollments, groups,
  programs, educators, students, users
RESTART IDENTITY CASCADE;

-- ──────────────────────────────────────────────────────────────
--  USUARIOS
-- ──────────────────────────────────────────────────────────────
-- Las contraseñas son bcrypt de 'password123' (cámbialo en producción)
-- Hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0oR.kDcESK

INSERT INTO users (id, email, password_hash, role, name, avatar_url) VALUES
  -- Administrador
  ('00000001-0000-0000-0000-000000000001',
   'admin@lucytejada.edu.co',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0oR.kDcESK',
   'administrador',
   'Ana López',
   'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'),

  -- Educadores
  ('00000002-0000-0000-0000-000000000001',
   'diana.vargas@lucytejada.edu.co',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0oR.kDcESK',
   'educador',
   'Diana Vargas',
   'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'),
  ('00000002-0000-0000-0000-000000000002',
   'roberto.gomez@lucytejada.edu.co',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0oR.kDcESK',
   'educador',
   'Roberto Gómez',
   NULL),
  ('00000002-0000-0000-0000-000000000003',
   'andres.castano@lucytejada.edu.co',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0oR.kDcESK',
   'educador',
   'Andrés Castaño',
   NULL),
  ('00000002-0000-0000-0000-000000000004',
   'julian.perez@lucytejada.edu.co',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0oR.kDcESK',
   'educador',
   'Julián Pérez',
   NULL),
  ('00000002-0000-0000-0000-000000000005',
   'mariafernanda.silva@lucytejada.edu.co',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0oR.kDcESK',
   'educador',
   'María Fernanda Silva',
   NULL),
  ('00000002-0000-0000-0000-000000000006',
   'carolina.ruiz@lucytejada.edu.co',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0oR.kDcESK',
   'educador',
   'Carolina Ruiz',
   NULL),
  ('00000002-0000-0000-0000-000000000007',
   'luisfernando.torres@lucytejada.edu.co',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0oR.kDcESK',
   'educador',
   'Luis Fernando Torres',
   NULL),
  ('00000002-0000-0000-0000-000000000008',
   'patricia.moreno@lucytejada.edu.co',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0oR.kDcESK',
   'educador',
   'Patricia Moreno',
   NULL),

  -- Estudiantes
  ('00000003-0000-0000-0000-000000000001',
   'camila.rodriguez@email.com',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0oR.kDcESK',
   'estudiante',
   'Camila Rodríguez',
   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'),
  ('00000003-0000-0000-0000-000000000002',
   'sebastian.munoz@email.com',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0oR.kDcESK',
   'estudiante',
   'Sebastián Muñoz',
   NULL),
  ('00000003-0000-0000-0000-000000000003',
   'valentina.garcia@email.com',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0oR.kDcESK',
   'estudiante',
   'Valentina García',
   NULL),

  -- Operador backoffice escenarios
  ('00000004-0000-0000-0000-000000000001',
   'backoffice@escenarios.gov.co',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0oR.kDcESK',
   'backoffice',
   'Operador SGE',
   NULL);

-- ──────────────────────────────────────────────────────────────
--  PERFILES EDUCADORES
-- ──────────────────────────────────────────────────────────────

INSERT INTO educators (id, user_id, especialidad, telefono) VALUES
  ('e0000001-0000-0000-0000-000000000001', '00000002-0000-0000-0000-000000000001', 'Danza Clásica',     '318 234 5678'),
  ('e0000001-0000-0000-0000-000000000002', '00000002-0000-0000-0000-000000000002', 'Música',            '319 345 6789'),
  ('e0000001-0000-0000-0000-000000000003', '00000002-0000-0000-0000-000000000003', 'Teatro',            '320 456 7890'),
  ('e0000001-0000-0000-0000-000000000004', '00000002-0000-0000-0000-000000000004', 'Danza',             '321 567 8901'),
  ('e0000001-0000-0000-0000-000000000005', '00000002-0000-0000-0000-000000000005', 'Música Vocal',      '322 678 9012'),
  ('e0000001-0000-0000-0000-000000000006', '00000002-0000-0000-0000-000000000006', 'Teatro',            '323 789 0123'),
  ('e0000001-0000-0000-0000-000000000007', '00000002-0000-0000-0000-000000000007', 'Artes Visuales',    '324 890 1234'),
  ('e0000001-0000-0000-0000-000000000008', '00000002-0000-0000-0000-000000000008', 'Artes Visuales',    '325 901 2345');

-- ──────────────────────────────────────────────────────────────
--  PERFILES ESTUDIANTES
-- ──────────────────────────────────────────────────────────────

INSERT INTO students (id, user_id, documento, tipo_documento, telefono, direccion, fecha_nacimiento, acudiente, telefono_acudiente, estado) VALUES
  ('50000001-0000-0000-0000-000000000001',
   '00000003-0000-0000-0000-000000000001',
   '1001234567', 'TI', '320 456 7890',
   'Carrera 5 #23-45, Pereira', '2008-03-15',
   'María Rodríguez', '315 234 5678', 'Activo'),
  ('50000001-0000-0000-0000-000000000002',
   '00000003-0000-0000-0000-000000000002',
   '1001234568', 'TI', '321 567 8901',
   'Calle 10 #15-30, Pereira', '2010-07-22',
   'Jorge Muñoz', '316 345 6789', 'Activo'),
  ('50000001-0000-0000-0000-000000000003',
   '00000003-0000-0000-0000-000000000003',
   '1001234569', 'TI', '322 678 9012',
   'Avenida 3 #8-20, Pereira', '2009-11-05',
   'Laura García', '317 456 7890', 'Activo');

-- ──────────────────────────────────────────────────────────────
--  PROGRAMAS
-- ──────────────────────────────────────────────────────────────

INSERT INTO programs (id, name, category, description, duration_months, schedule_desc, level, capacity, educator_id, start_date, end_date, image_url) VALUES
  ('b0000001-0000-0000-0000-000000000001',
   'Ballet Clásico', 'Danza',
   'Aprende los fundamentos del ballet clásico con técnica profesional.',
   6, 'Martes y Jueves 4:00 PM - 6:00 PM', 'Principiante', 15,
   'e0000001-0000-0000-0000-000000000001',
   '2026-05-01', '2026-10-31',
   'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop'),
  ('b0000001-0000-0000-0000-000000000002',
   'Danza Folklórica Colombiana', 'Danza',
   'Explora la riqueza de nuestras danzas tradicionales.',
   4, 'Lunes y Miércoles 5:00 PM - 7:00 PM', 'Todos los niveles', 20,
   'e0000001-0000-0000-0000-000000000004',
   '2026-05-15', '2026-09-15',
   'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=600&fit=crop'),
  ('b0000001-0000-0000-0000-000000000003',
   'Guitarra Acústica', 'Música',
   'Domina la guitarra desde cero: acordes, ritmos y tu primera canción.',
   8, 'Sábados 10:00 AM - 12:00 PM', 'Principiante', 10,
   'e0000001-0000-0000-0000-000000000002',
   '2026-04-20', '2026-12-20',
   'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=600&fit=crop'),
  ('b0000001-0000-0000-0000-000000000004',
   'Coro Infantil', 'Música',
   'Desarrolla tu voz y canta en conjunto. Para niños de 8 a 14 años.',
   10, 'Viernes 3:00 PM - 5:00 PM', 'Niños', 25,
   'e0000001-0000-0000-0000-000000000005',
   '2026-03-01', '2026-12-15',
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop'),
  ('b0000001-0000-0000-0000-000000000005',
   'Teatro de Improvisación', 'Teatro',
   'Desarrolla creatividad, confianza y espontaneidad en el escenario.',
   5, 'Miércoles 6:00 PM - 8:00 PM', 'Intermedio', 12,
   'e0000001-0000-0000-0000-000000000003',
   '2026-05-10', '2026-10-10',
   'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop'),
  ('b0000001-0000-0000-0000-000000000006',
   'Actuación para Principiantes', 'Teatro',
   'Introducción al arte dramático: expresión corporal, voz y personaje.',
   6, 'Lunes y Viernes 5:00 PM - 7:00 PM', 'Principiante', 15,
   'e0000001-0000-0000-0000-000000000006',
   '2026-04-25', '2026-10-25',
   'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop'),
  ('b0000001-0000-0000-0000-000000000007',
   'Pintura al Óleo', 'Artes Visuales',
   'Técnicas clásicas y contemporáneas de pintura al óleo.',
   7, 'Martes 2:00 PM - 5:00 PM', 'Intermedio', 12,
   'e0000001-0000-0000-0000-000000000007',
   '2026-04-15', '2026-11-15',
   'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop'),
  ('b0000001-0000-0000-0000-000000000008',
   'Dibujo Artístico', 'Artes Visuales',
   'Fundamentos del dibujo: proporción, perspectiva, luz y sombra.',
   5, 'Jueves 4:00 PM - 6:00 PM', 'Principiante', 18,
   'e0000001-0000-0000-0000-000000000008',
   '2026-05-05', '2026-10-05',
   'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop');

-- ──────────────────────────────────────────────────────────────
--  GRUPOS
-- ──────────────────────────────────────────────────────────────

INSERT INTO groups (id, program_id, name, day_of_week, start_time, end_time, room) VALUES
  ('90000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'Ballet A', 'Martes',    '16:00', '18:00', 'Sala 1'),
  ('90000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'Ballet B', 'Jueves',    '16:00', '18:00', 'Sala 1'),
  ('90000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000003', 'Guitarra A', 'Sábado',  '10:00', '12:00', 'Aula Música'),
  ('90000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000005', 'Improv A',  'Miércoles','18:00', '20:00', 'Teatro');

-- ──────────────────────────────────────────────────────────────
--  INSCRIPCIONES
-- ──────────────────────────────────────────────────────────────

INSERT INTO enrollments (student_id, program_id, group_id, status) VALUES
  ('50000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', '90000001-0000-0000-0000-000000000001', 'activo'),
  ('50000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000007', NULL, 'activo'),
  ('50000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000003', '90000001-0000-0000-0000-000000000003', 'activo'),
  ('50000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000004', NULL, 'activo'),
  ('50000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000002', NULL, 'activo'),
  ('50000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000005', '90000001-0000-0000-0000-000000000004', 'activo');

-- ──────────────────────────────────────────────────────────────
--  ASISTENCIA
-- ──────────────────────────────────────────────────────────────

INSERT INTO attendance (group_id, student_id, session_date, status) VALUES
  ('90000001-0000-0000-0000-000000000001', '50000001-0000-0000-0000-000000000001', '2026-04-01', 'Presente'),
  ('90000001-0000-0000-0000-000000000001', '50000001-0000-0000-0000-000000000001', '2026-04-03', 'Presente'),
  ('90000001-0000-0000-0000-000000000001', '50000001-0000-0000-0000-000000000001', '2026-04-08', 'Ausente'),
  ('90000001-0000-0000-0000-000000000001', '50000001-0000-0000-0000-000000000001', '2026-04-10', 'Presente');

-- ──────────────────────────────────────────────────────────────
--  EVALUACIONES
-- ──────────────────────────────────────────────────────────────

INSERT INTO evaluations (student_id, educator_id, program_id, evaluation_date, fortalezas, oportunidades, observaciones, recomendaciones) VALUES
  ('50000001-0000-0000-0000-000000000001',
   'e0000001-0000-0000-0000-000000000001',
   'b0000001-0000-0000-0000-000000000001',
   '2026-04-10',
   'Excelente postura y disciplina. Muestra compromiso constante.',
   'Trabajar flexibilidad en piernas y mejorar equilibrio en piruetas.',
   'Progreso notable en las últimas semanas.',
   'Practicar estiramientos diarios 15 minutos.');

-- ──────────────────────────────────────────────────────────────
--  NOTIFICACIONES
-- ──────────────────────────────────────────────────────────────

INSERT INTO notifications (user_id, type, title, message, read) VALUES
  ('00000003-0000-0000-0000-000000000001', 'success', 'Inscripción confirmada',
   'Te has inscrito exitosamente en Ballet Clásico', FALSE),
  ('00000003-0000-0000-0000-000000000001', 'info',    'Próxima sesión',
   'Recuerda tu clase de Ballet Clásico mañana a las 4:00 PM', TRUE),
  ('00000003-0000-0000-0000-000000000001', 'warning', 'Nueva evaluación disponible',
   'Tu educador ha publicado una evaluación. Revísala en tu perfil.', TRUE);

-- ──────────────────────────────────────────────────────────────
--  ESCENARIOS
-- ──────────────────────────────────────────────────────────────

INSERT INTO venues (id, name, type, capacity, area_m2, address, neighborhood, zone, description,
                    hourly_rate, daily_rate, available,
                    has_ac, has_parking, has_kitchen, has_sound_system, has_projector, has_stage, accessibility)
VALUES
  ('f0000001-0000-0000-0000-000000000001',
   'Auditorio Principal Centro Cultural', 'auditorio',
   350, 420, 'Carrera 5 #6-05', 'San Antonio', 'Centro',
   'Auditorio equipado con sistema de sonido profesional, iluminación escénica y aire acondicionado.',
   280000, 1800000, TRUE,
   TRUE, TRUE, FALSE, TRUE, TRUE, TRUE, TRUE),

  ('f0000001-0000-0000-0000-000000000002',
   'Teatro Municipal Jorge Isaacs', 'teatro',
   180, 280, 'Calle 8 #3-14', 'Granada', 'Centro',
   'Teatro íntimo con excelente acústica y visibilidad desde todos los puntos.',
   320000, 2200000, TRUE,
   TRUE, FALSE, FALSE, TRUE, FALSE, TRUE, TRUE),

  ('f0000001-0000-0000-0000-000000000003',
   'Salón Sebastián de Belalcázar', 'salon_cultural',
   120, 180, 'Avenida Colombia #8-30', 'Santa Rosa', 'Norte',
   'Salón versátil con mobiliario flexible para talleres y conferencias.',
   150000, 900000, TRUE,
   TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE),

  ('f0000001-0000-0000-0000-000000000004',
   'Sala Lucy Tejada', 'sala',
   80, 120, 'Calle 6 #10-12', 'Centro', 'Centro',
   'Sala íntima ideal para recitales, exposiciones y presentaciones pequeñas.',
   100000, 650000, TRUE,
   TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, TRUE),

  ('f0000001-0000-0000-0000-000000000005',
   'Coliseo Mayor', 'auditorio',
   800, 1200, 'Carrera 30 #5-80', 'Kennedy', 'Occidente',
   'Gran coliseo para eventos masivos, conciertos y festivales.',
   850000, 5500000, FALSE,
   TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE);

-- Imágenes
INSERT INTO venue_images (venue_id, url, sort_order) VALUES
  ('f0000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87', 0),
  ('f0000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2', 1),
  ('f0000001-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1503095396549-807759245b35', 0),
  ('f0000001-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678', 0),
  ('f0000001-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64', 0),
  ('f0000001-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1573152143286-0c422b4d2175', 0);

-- Amenidades
INSERT INTO venue_amenities (venue_id, amenity) VALUES
  ('f0000001-0000-0000-0000-000000000001', 'Sistema de sonido profesional'),
  ('f0000001-0000-0000-0000-000000000001', 'Iluminación escénica'),
  ('f0000001-0000-0000-0000-000000000001', 'Aire acondicionado'),
  ('f0000001-0000-0000-0000-000000000001', 'Escenario elevado'),
  ('f0000001-0000-0000-0000-000000000001', 'Camerinos'),
  ('f0000001-0000-0000-0000-000000000001', 'Proyector HD'),
  ('f0000001-0000-0000-0000-000000000001', 'Estacionamiento 40 vehículos'),
  ('f0000001-0000-0000-0000-000000000002', 'Sistema acústico especializado'),
  ('f0000001-0000-0000-0000-000000000002', 'Iluminación teatral'),
  ('f0000001-0000-0000-0000-000000000002', 'Telón motorizado'),
  ('f0000001-0000-0000-0000-000000000002', 'Foso de orquesta'),
  ('f0000001-0000-0000-0000-000000000003', 'Proyector y pantalla'),
  ('f0000001-0000-0000-0000-000000000003', 'WiFi de alta velocidad'),
  ('f0000001-0000-0000-0000-000000000003', 'Cocina auxiliar');

-- Reglas
INSERT INTO venue_rules (venue_id, rule) VALUES
  ('f0000001-0000-0000-0000-000000000001', 'No fumar'),
  ('f0000001-0000-0000-0000-000000000001', 'No consumir alimentos ni bebidas en la sala'),
  ('f0000001-0000-0000-0000-000000000001', 'Respetar horarios de montaje y desmontaje'),
  ('f0000001-0000-0000-0000-000000000001', 'Contratar póliza de responsabilidad civil'),
  ('f0000001-0000-0000-0000-000000000002', 'No permitido consumo de alimentos'),
  ('f0000001-0000-0000-0000-000000000002', 'Silencio absoluto durante ensayos'),
  ('f0000001-0000-0000-0000-000000000003', 'Capacidad máxima estrictamente respetada'),
  ('f0000001-0000-0000-0000-000000000003', 'Devolver mobiliario a configuración original');

-- ──────────────────────────────────────────────────────────────
--  SOLICITUDES DE ALQUILER
-- ──────────────────────────────────────────────────────────────

INSERT INTO rental_requests
  (id, request_number, venue_id, venue_name, client_name, client_email, client_phone,
   client_document, client_org, event_type, event_name, event_date,
   start_time, end_time, attendees, status, submitted_at)
VALUES
  ('d0000001-0000-0000-0000-000000000001',
   'SGE-2026-001', 'f0000001-0000-0000-0000-000000000001',
   'Auditorio Principal Centro Cultural',
   'Festival de Jazz Pereira', 'contacto@jazzpereira.com',
   '312 555 0001', '900123456', 'Festival de Jazz Pereira',
   'Concierto', 'Noche de Jazz Vol. III',
   '2026-05-20', '18:00', '23:00', 280, 'pagada',
   '2026-03-15 10:00:00+00'),

  ('d0000001-0000-0000-0000-000000000002',
   'SGE-2026-002', 'f0000001-0000-0000-0000-000000000003',
   'Salón Sebastián de Belalcázar',
   'Universidad del Valle', 'eventos@univalle.edu.co',
   '312 555 0002', '890234567', 'Universidad del Valle',
   'Conferencia', 'Simposio de Arte Contemporáneo',
   '2026-05-25', '08:00', '18:00', 100, 'en_revision',
   '2026-04-18 14:30:00+00'),

  ('d0000001-0000-0000-0000-000000000003',
   'SGE-2026-003', 'f0000001-0000-0000-0000-000000000002',
   'Teatro Municipal Jorge Isaacs',
   'Cía. Danza Contemporánea', 'cia.danza@gmail.com',
   '312 555 0003', '123456789', 'Cía. Danza Contemporánea',
   'Espectáculo', 'Cuerpos en Movimiento',
   '2026-06-10', '19:00', '22:00', 160, 'pagada',
   '2026-03-20 09:00:00+00'),

  ('d0000001-0000-0000-0000-000000000004',
   'SGE-2026-004', 'f0000001-0000-0000-0000-000000000004',
   'Sala Lucy Tejada',
   'Colectivo Pacífico Visual', 'colectivop@gmail.com',
   '312 555 0004', '987654321', 'Colectivo Pacífico Visual',
   'Exposición', 'Voces del Pacífico',
   '2026-06-15', '10:00', '20:00', 60, 'enviada',
   '2026-04-19 16:00:00+00');

-- ──────────────────────────────────────────────────────────────
--  CONTRATOS
-- ──────────────────────────────────────────────────────────────

INSERT INTO contracts
  (id, contract_number, request_id, venue_id, venue_name,
   client_name, client_document, start_date, end_date, total_amount,
   status, legal_review_status, created_at, signed_at)
VALUES
  ('c0000001-0000-0000-0000-000000000001',
   'CONT-2026-001',
   'd0000001-0000-0000-0000-000000000001',
   'f0000001-0000-0000-0000-000000000001',
   'Auditorio Principal Centro Cultural',
   'Festival de Jazz Pereira', '900123456',
   '2026-05-20', '2026-05-20', 1400000,
   'activo', 'aprobado',
   '2026-03-20 10:00:00+00', '2026-03-25 14:00:00+00'),

  ('c0000001-0000-0000-0000-000000000003',
   'CONT-2026-003',
   'd0000001-0000-0000-0000-000000000003',
   'f0000001-0000-0000-0000-000000000002',
   'Teatro Municipal Jorge Isaacs',
   'Cía. Danza Contemporánea', '123456789',
   '2026-06-10', '2026-06-10', 960000,
   'activo', 'aprobado',
   '2026-03-25 09:00:00+00', '2026-04-01 11:00:00+00');

-- Vincular solicitudes con contratos
UPDATE rental_requests SET contract_id = 'c0000001-0000-0000-0000-000000000001'
  WHERE id = 'd0000001-0000-0000-0000-000000000001';
UPDATE rental_requests SET contract_id = 'c0000001-0000-0000-0000-000000000003'
  WHERE id = 'd0000001-0000-0000-0000-000000000003';

-- Cláusulas
INSERT INTO contract_clauses (contract_id, clause_text, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'El arrendatario se compromete a respetar la capacidad máxima del escenario.', 1),
  ('c0000001-0000-0000-0000-000000000001', 'El pago total debe realizarse 10 días antes del evento.', 2),
  ('c0000001-0000-0000-0000-000000000001', 'En caso de cancelación con menos de 48 horas de anticipación, no se realizará devolución.', 3);

-- ──────────────────────────────────────────────────────────────
--  PAGOS
-- ──────────────────────────────────────────────────────────────

INSERT INTO payments
  (id, payment_number, contract_id, contract_number, client_name,
   amount, payment_method, payment_date, receipt_number, status, registered_by, registered_at)
VALUES
  ('aa000001-0000-0000-0000-000000000001',
   'PAY-2026-001', 'c0000001-0000-0000-0000-000000000001', 'CONT-2026-001',
   'Festival de Jazz Pereira',
   1400000, 'transferencia', '2026-04-10', 'REC-001', 'completado',
   '00000004-0000-0000-0000-000000000001',
   '2026-04-10 09:30:00+00'),

  ('aa000001-0000-0000-0000-000000000002',
   'PAY-2026-002', 'c0000001-0000-0000-0000-000000000003', 'CONT-2026-003',
   'Cía. Danza Contemporánea',
   960000, 'transferencia', '2026-04-15', 'REC-002', 'completado',
   '00000004-0000-0000-0000-000000000001',
   '2026-04-15 10:00:00+00');

UPDATE rental_requests SET payment_id = 'aa000001-0000-0000-0000-000000000001'
  WHERE id = 'd0000001-0000-0000-0000-000000000001';
UPDATE rental_requests SET payment_id = 'aa000001-0000-0000-0000-000000000002'
  WHERE id = 'd0000001-0000-0000-0000-000000000003';

-- ──────────────────────────────────────────────────────────────
--  EVENTOS
-- ──────────────────────────────────────────────────────────────

INSERT INTO events
  (id, request_id, contract_id, venue_name, event_name, event_date,
   start_time, end_time, status, handover_completed, handover_date,
   return_completed, return_date, return_notes)
VALUES
  ('ab000001-0000-0000-0000-000000000001',
   'd0000001-0000-0000-0000-000000000001',
   'c0000001-0000-0000-0000-000000000001',
   'Auditorio Principal Centro Cultural',
   'Noche de Jazz Vol. III',
   '2026-05-20', '18:00', '23:00',
   'programado', FALSE, NULL, FALSE, NULL, NULL),

  ('ab000001-0000-0000-0000-000000000002',
   'd0000001-0000-0000-0000-000000000003',
   'c0000001-0000-0000-0000-000000000003',
   'Teatro Municipal Jorge Isaacs',
   'Cuerpos en Movimiento',
   '2026-06-10', '19:00', '22:00',
   'programado', FALSE, NULL, FALSE, NULL, NULL);

-- ──────────────────────────────────────────────────────────────
--  MANTENIMIENTO
-- ──────────────────────────────────────────────────────────────

INSERT INTO maintenance_tickets
  (id, ticket_number, venue_id, venue_name, type, priority,
   title, description, reported_by, status)
VALUES
  ('ac000001-0000-0000-0000-000000000001',
   'MANT-2026-001', 'f0000001-0000-0000-0000-000000000001',
   'Auditorio Principal Centro Cultural',
   'correctivo', 'alta',
   'Fallo en sistema de aire acondicionado',
   'El equipo de A/C del sector norte no enciende desde el 10 de abril.',
   'Operador SGE', 'en_proceso'),

  ('ac000001-0000-0000-0000-000000000002',
   'MANT-2026-002', 'f0000001-0000-0000-0000-000000000002',
   'Teatro Municipal Jorge Isaacs',
   'preventivo', 'media',
   'Revisión semestral sistema de sonido',
   'Mantenimiento preventivo programado del equipo de audio.',
   'Operador SGE', 'abierto');

COMMIT;
