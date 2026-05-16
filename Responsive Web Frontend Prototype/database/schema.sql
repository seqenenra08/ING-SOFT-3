-- ============================================================
--  PLATAFORMA LUCY TEJADA + SISTEMA DE GESTIÓN DE ESCENARIOS
--  Schema PostgreSQL
--  Base: PostgreSQL >= 15
-- ============================================================

BEGIN;

-- ──────────────────────────────────────────────────────────────
--  EXTENSIONES
-- ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "citext";     -- correos insensibles a mayúsculas

-- ──────────────────────────────────────────────────────────────
--  ENUMERACIONES GLOBALES
-- ──────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM (
  'estudiante',
  'educador',
  'administrador',
  'backoffice'            -- operador del sistema de escenarios
);

CREATE TYPE attendance_status AS ENUM (
  'Presente',
  'Ausente',
  'Justificado'
);

CREATE TYPE request_status AS ENUM (
  'enviada',
  'en_revision',
  'aprobada',
  'rechazada',
  'contrato_generado',
  'pagada',
  'cancelada'
);

CREATE TYPE contract_status AS ENUM (
  'borrador',
  'enviado_firma',
  'firmado',
  'activo',
  'finalizado',
  'cancelado'
);

CREATE TYPE legal_review_status AS ENUM (
  'pendiente',
  'en_revision',
  'aprobado',
  'rechazado'
);

CREATE TYPE payment_method AS ENUM (
  'efectivo',
  'transferencia',
  'tarjeta',
  'cheque'
);

CREATE TYPE payment_status AS ENUM (
  'pendiente',
  'parcial',
  'completado'
);

CREATE TYPE event_status AS ENUM (
  'programado',
  'en_curso',
  'finalizado',
  'cancelado'
);

CREATE TYPE maintenance_type AS ENUM (
  'preventivo',
  'correctivo'
);

CREATE TYPE maintenance_priority AS ENUM (
  'baja',
  'media',
  'alta',
  'critica'
);

CREATE TYPE maintenance_status AS ENUM (
  'abierto',
  'en_proceso',
  'resuelto',
  'cerrado'
);

CREATE TYPE venue_type AS ENUM (
  'auditorio',
  'teatro',
  'salon_cultural',
  'sala',
  'espacio_abierto'
);

-- ──────────────────────────────────────────────────────────────
--  ① AUTENTICACIÓN Y USUARIOS
-- ──────────────────────────────────────────────────────────────

CREATE TABLE users (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email           CITEXT      NOT NULL UNIQUE,
  password_hash   TEXT        NOT NULL,
  role            user_role   NOT NULL,
  name            TEXT        NOT NULL,
  avatar_url      TEXT,
  active          BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ──────────────────────────────────────────────────────────────
--  ② PERFIL EXTENDIDO: ESTUDIANTES
-- ──────────────────────────────────────────────────────────────

CREATE TABLE students (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  documento           VARCHAR(20) NOT NULL UNIQUE,
  tipo_documento      VARCHAR(10) NOT NULL DEFAULT 'CC',  -- CC, TI, CE, PAS
  telefono            VARCHAR(20),
  direccion           TEXT,
  fecha_nacimiento    DATE,
  acudiente           TEXT,
  telefono_acudiente  VARCHAR(20),
  estado              TEXT        NOT NULL DEFAULT 'Activo',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_documento ON students(documento);

-- ──────────────────────────────────────────────────────────────
--  ③ PERFIL EXTENDIDO: EDUCADORES
-- ──────────────────────────────────────────────────────────────

CREATE TABLE educators (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  documento       VARCHAR(20),
  especialidad    TEXT        NOT NULL,
  telefono        VARCHAR(20),
  bio             TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_educators_updated_at
  BEFORE UPDATE ON educators
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_educators_user_id ON educators(user_id);

-- ──────────────────────────────────────────────────────────────
--  ④ PROGRAMAS ACADÉMICOS
-- ──────────────────────────────────────────────────────────────

CREATE TABLE programs (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT        NOT NULL,
  category        TEXT        NOT NULL,         -- Danza, Música, Teatro, Artes Visuales
  description     TEXT,
  duration_months INTEGER,
  schedule_desc   TEXT,                         -- Descripción legible del horario
  level           TEXT        NOT NULL DEFAULT 'Todos los niveles',
  capacity        INTEGER     NOT NULL DEFAULT 20,
  educator_id     UUID        REFERENCES educators(id) ON DELETE SET NULL,
  start_date      DATE,
  end_date        DATE,
  image_url       TEXT,
  active          BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_programs_updated_at
  BEFORE UPDATE ON programs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_programs_educator_id ON programs(educator_id);
CREATE INDEX idx_programs_category    ON programs(category);

-- ──────────────────────────────────────────────────────────────
--  ⑤ GRUPOS (instancias de clase dentro de un programa)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE groups (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id  UUID    NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  name        TEXT    NOT NULL,
  day_of_week TEXT,       -- 'Lunes', 'Martes', etc.
  start_time  TIME,
  end_time    TIME,
  room        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_groups_program_id ON groups(program_id);

-- ──────────────────────────────────────────────────────────────
--  ⑥ INSCRIPCIONES
-- ──────────────────────────────────────────────────────────────

CREATE TABLE enrollments (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID        NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  program_id  UUID        NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  group_id    UUID        REFERENCES groups(id) ON DELETE SET NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status      TEXT        NOT NULL DEFAULT 'activo',  -- activo, retirado, graduado
  UNIQUE (student_id, program_id)
);

CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_program_id ON enrollments(program_id);

-- ──────────────────────────────────────────────────────────────
--  ⑦ ASISTENCIA
-- ──────────────────────────────────────────────────────────────

CREATE TABLE attendance (
  id            UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id      UUID              NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  student_id    UUID              NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  session_date  DATE              NOT NULL,
  status        attendance_status NOT NULL DEFAULT 'Presente',
  notes         TEXT,
  registered_by UUID              REFERENCES educators(id),
  created_at    TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  UNIQUE (group_id, student_id, session_date)
);

CREATE INDEX idx_attendance_group_id   ON attendance(group_id);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_date       ON attendance(session_date);

-- ──────────────────────────────────────────────────────────────
--  ⑧ EVALUACIONES
-- ──────────────────────────────────────────────────────────────

CREATE TABLE evaluations (
  id               UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id       UUID  NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  educator_id      UUID  NOT NULL REFERENCES educators(id),
  program_id       UUID  NOT NULL REFERENCES programs(id),
  evaluation_date  DATE  NOT NULL DEFAULT CURRENT_DATE,
  fortalezas       TEXT,
  oportunidades    TEXT,
  observaciones    TEXT,
  recomendaciones  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_evaluations_updated_at
  BEFORE UPDATE ON evaluations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_evaluations_student_id  ON evaluations(student_id);
CREATE INDEX idx_evaluations_educator_id ON evaluations(educator_id);
CREATE INDEX idx_evaluations_program_id  ON evaluations(program_id);

-- ──────────────────────────────────────────────────────────────
--  ⑨ NOTIFICACIONES (plataforma Lucy Tejada)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE notifications (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        TEXT    NOT NULL DEFAULT 'info',   -- info, success, warning, error
  title       TEXT    NOT NULL,
  message     TEXT    NOT NULL,
  read        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read    ON notifications(user_id, read);

-- ──────────────────────────────────────────────────────────────
--  ⑩ ESCENARIOS (venues)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE venues (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT        NOT NULL,
  type            venue_type  NOT NULL,
  capacity        INTEGER     NOT NULL,
  area_m2         NUMERIC(8,2),
  address         TEXT        NOT NULL,
  neighborhood    TEXT,
  zone            TEXT,
  description     TEXT,
  hourly_rate     NUMERIC(12,2) NOT NULL,
  daily_rate      NUMERIC(12,2) NOT NULL,
  available       BOOLEAN     NOT NULL DEFAULT TRUE,
  -- Features
  has_ac          BOOLEAN NOT NULL DEFAULT FALSE,
  has_parking     BOOLEAN NOT NULL DEFAULT FALSE,
  has_kitchen     BOOLEAN NOT NULL DEFAULT FALSE,
  has_sound_system BOOLEAN NOT NULL DEFAULT FALSE,
  has_projector   BOOLEAN NOT NULL DEFAULT FALSE,
  has_stage       BOOLEAN NOT NULL DEFAULT FALSE,
  accessibility   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_venues_updated_at
  BEFORE UPDATE ON venues
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_venues_available ON venues(available);
CREATE INDEX idx_venues_type      ON venues(type);

-- Imágenes del escenario
CREATE TABLE venue_images (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id   UUID    NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  url        TEXT    NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_venue_images_venue_id ON venue_images(venue_id);

-- Amenidades del escenario (lista libre)
CREATE TABLE venue_amenities (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id   UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  amenity    TEXT NOT NULL
);

-- Reglas del escenario
CREATE TABLE venue_rules (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  rule     TEXT NOT NULL
);

-- ──────────────────────────────────────────────────────────────
--  ⑪ SOLICITUDES DE ALQUILER
-- ──────────────────────────────────────────────────────────────

CREATE TABLE rental_requests (
  id                UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number    TEXT            NOT NULL UNIQUE,
  venue_id          UUID            NOT NULL REFERENCES venues(id),
  -- Snapshot del nombre por si el escenario cambia
  venue_name        TEXT            NOT NULL,
  -- Datos del solicitante
  client_name       TEXT            NOT NULL,
  client_email      CITEXT          NOT NULL,
  client_phone      TEXT,
  client_document   TEXT,
  client_org        TEXT,
  -- Datos del evento
  event_type        TEXT            NOT NULL,
  event_name        TEXT            NOT NULL,
  event_date        DATE            NOT NULL,
  start_time        TIME            NOT NULL,
  end_time          TIME            NOT NULL,
  attendees         INTEGER         NOT NULL,
  -- Estado
  status            request_status  NOT NULL DEFAULT 'enviada',
  notes             TEXT,
  rejection_reason  TEXT,
  -- Auditoría
  submitted_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  reviewed_at       TIMESTAMPTZ,
  reviewed_by       UUID            REFERENCES users(id)
);

CREATE INDEX idx_requests_venue_id    ON rental_requests(venue_id);
CREATE INDEX idx_requests_status      ON rental_requests(status);
CREATE INDEX idx_requests_event_date  ON rental_requests(event_date);
CREATE INDEX idx_requests_client_email ON rental_requests(client_email);

-- ──────────────────────────────────────────────────────────────
--  ⑫ CONTRATOS
-- ──────────────────────────────────────────────────────────────

CREATE TABLE contracts (
  id                   UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number      TEXT            NOT NULL UNIQUE,
  request_id           UUID            NOT NULL REFERENCES rental_requests(id),
  venue_id             UUID            NOT NULL REFERENCES venues(id),
  venue_name           TEXT            NOT NULL,     -- snapshot
  client_name          TEXT            NOT NULL,
  client_document      TEXT            NOT NULL,
  start_date           DATE            NOT NULL,
  end_date             DATE            NOT NULL,
  total_amount         NUMERIC(14,2)   NOT NULL,
  status               contract_status NOT NULL DEFAULT 'borrador',
  legal_review_status  legal_review_status NOT NULL DEFAULT 'pendiente',
  legal_review_notes   TEXT,
  legal_reviewed_by    UUID            REFERENCES users(id),
  legal_reviewed_at    TIMESTAMPTZ,
  created_at           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  signed_at            TIMESTAMPTZ,
  updated_at           TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Vincular solicitud aprobada con su contrato
ALTER TABLE rental_requests
  ADD COLUMN contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL;

CREATE INDEX idx_contracts_request_id ON contracts(request_id);
CREATE INDEX idx_contracts_status     ON contracts(status);

-- Cláusulas del contrato
CREATE TABLE contract_clauses (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID    NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  clause_text TEXT    NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- Documentos adjuntos al contrato
CREATE TABLE contract_documents (
  id            UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id   UUID  NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  document_name TEXT  NOT NULL,
  document_url  TEXT  NOT NULL,
  uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
--  ⑬ PAGOS
-- ──────────────────────────────────────────────────────────────

CREATE TABLE payments (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number      TEXT            NOT NULL UNIQUE,
  contract_id         UUID            NOT NULL REFERENCES contracts(id),
  contract_number     TEXT            NOT NULL,     -- snapshot
  client_name         TEXT            NOT NULL,
  amount              NUMERIC(14,2)   NOT NULL,
  payment_method      payment_method  NOT NULL,
  payment_date        DATE            NOT NULL,
  receipt_number      TEXT,
  invoice_number      TEXT,
  status              payment_status  NOT NULL DEFAULT 'pendiente',
  notes               TEXT,
  registered_by       UUID            REFERENCES users(id),
  registered_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Vincular solicitud con su pago
ALTER TABLE rental_requests
  ADD COLUMN payment_id UUID REFERENCES payments(id) ON DELETE SET NULL;

CREATE INDEX idx_payments_contract_id ON payments(contract_id);
CREATE INDEX idx_payments_status      ON payments(status);
CREATE INDEX idx_payments_date        ON payments(payment_date);

-- ──────────────────────────────────────────────────────────────
--  ⑭ EVENTOS (ejecución del contrato)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE events (
  id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id          UUID         NOT NULL REFERENCES rental_requests(id),
  contract_id         UUID         NOT NULL REFERENCES contracts(id),
  venue_name          TEXT         NOT NULL,   -- snapshot
  event_name          TEXT         NOT NULL,
  event_date          DATE         NOT NULL,
  start_time          TIME         NOT NULL,
  end_time            TIME         NOT NULL,
  status              event_status NOT NULL DEFAULT 'programado',
  -- Entrega del escenario al cliente
  handover_completed  BOOLEAN      NOT NULL DEFAULT FALSE,
  handover_date       DATE,
  handover_notes      TEXT,
  handover_by         UUID         REFERENCES users(id),
  -- Devolución del escenario
  return_completed    BOOLEAN      NOT NULL DEFAULT FALSE,
  return_date         DATE,
  return_notes        TEXT,
  return_by           UUID         REFERENCES users(id),
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_events_contract_id ON events(contract_id);
CREATE INDEX idx_events_event_date  ON events(event_date);
CREATE INDEX idx_events_status      ON events(status);

-- Incidencias durante el evento
CREATE TABLE event_incidents (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  description TEXT        NOT NULL,
  reported_by UUID        REFERENCES users(id),
  reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
--  ⑮ MANTENIMIENTO
-- ──────────────────────────────────────────────────────────────

CREATE TABLE maintenance_tickets (
  id                UUID                 PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number     TEXT                 NOT NULL UNIQUE,
  venue_id          UUID                 NOT NULL REFERENCES venues(id),
  venue_name        TEXT                 NOT NULL,   -- snapshot
  type              maintenance_type     NOT NULL,
  priority          maintenance_priority NOT NULL DEFAULT 'media',
  title             TEXT                 NOT NULL,
  description       TEXT,
  reported_by       TEXT                 NOT NULL,   -- nombre libre o UUID de usuario
  reported_by_user  UUID                 REFERENCES users(id),
  status            maintenance_status   NOT NULL DEFAULT 'abierto',
  assigned_to       TEXT,
  assigned_at       TIMESTAMPTZ,
  resolved_at       TIMESTAMPTZ,
  resolution_notes  TEXT,
  cost              NUMERIC(12,2),
  created_at        TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ          NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_maintenance_updated_at
  BEFORE UPDATE ON maintenance_tickets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_maintenance_venue_id  ON maintenance_tickets(venue_id);
CREATE INDEX idx_maintenance_status    ON maintenance_tickets(status);
CREATE INDEX idx_maintenance_priority  ON maintenance_tickets(priority);

CREATE TABLE maintenance_attachments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id  UUID NOT NULL REFERENCES maintenance_tickets(id) ON DELETE CASCADE,
  file_url   TEXT NOT NULL,
  file_name  TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
--  VISTAS ÚTILES
-- ──────────────────────────────────────────────────────────────

-- Vista: Estudiantes con nombre completo
CREATE VIEW v_students AS
SELECT
  s.id,
  u.name,
  u.email,
  s.documento,
  s.tipo_documento,
  s.telefono,
  s.direccion,
  s.fecha_nacimiento,
  s.acudiente,
  s.telefono_acudiente,
  s.estado,
  u.active,
  s.created_at
FROM students s
JOIN users u ON u.id = s.user_id;

-- Vista: Educadores con nombre completo y programas
CREATE VIEW v_educators AS
SELECT
  e.id,
  u.name,
  u.email,
  e.especialidad,
  e.telefono,
  e.bio,
  u.active,
  COUNT(DISTINCT p.id) AS total_programs,
  COUNT(DISTINCT en.id) AS total_students
FROM educators e
JOIN users u ON u.id = e.user_id
LEFT JOIN programs p ON p.educator_id = e.id AND p.active = TRUE
LEFT JOIN enrollments en ON en.program_id = p.id AND en.status = 'activo'
GROUP BY e.id, u.name, u.email, e.especialidad, e.telefono, e.bio, u.active;

-- Vista: Programas con cupos disponibles
CREATE VIEW v_programs AS
SELECT
  p.*,
  u.name AS educator_name,
  COUNT(en.id) AS enrolled_count,
  (p.capacity - COUNT(en.id)) AS available_slots
FROM programs p
LEFT JOIN educators e ON e.id = p.educator_id
LEFT JOIN users u ON u.id = e.user_id
LEFT JOIN enrollments en ON en.program_id = p.id AND en.status = 'activo'
GROUP BY p.id, u.name;

-- Vista: Solicitudes con nombre del escenario
CREATE VIEW v_rental_requests AS
SELECT
  r.*,
  v.name AS venue_display_name,
  v.type AS venue_type,
  v.address AS venue_address
FROM rental_requests r
JOIN venues v ON v.id = r.venue_id;

-- Vista: KPI Dashboard de escenarios
CREATE VIEW v_backoffice_kpis AS
SELECT
  (SELECT COUNT(*) FROM rental_requests WHERE status = 'enviada')          AS pending_requests,
  (SELECT COUNT(*) FROM rental_requests WHERE status = 'en_revision')      AS in_review_requests,
  (SELECT COUNT(*) FROM events WHERE status = 'programado')                AS upcoming_events,
  (SELECT COUNT(*) FROM events WHERE status = 'en_curso')                  AS active_events,
  (SELECT COUNT(*) FROM maintenance_tickets WHERE status IN ('abierto','en_proceso')) AS open_tickets,
  (SELECT COALESCE(SUM(amount),0) FROM payments
     WHERE payment_date >= DATE_TRUNC('month', CURRENT_DATE)
       AND status = 'completado')                                           AS revenue_this_month,
  (SELECT COUNT(*) FROM venues WHERE available = TRUE)                     AS available_venues;

COMMIT;
