-- ============================================================
--  EJECUTAR ESTO EN EL SQL EDITOR DE SUPABASE
--  Desactiva RLS para el prototipo y relaja constraints de FK
-- ============================================================

-- 1. Desactivar Row Level Security en todas las tablas
ALTER TABLE users                  DISABLE ROW LEVEL SECURITY;
ALTER TABLE students               DISABLE ROW LEVEL SECURITY;
ALTER TABLE educators              DISABLE ROW LEVEL SECURITY;
ALTER TABLE programs               DISABLE ROW LEVEL SECURITY;
ALTER TABLE groups                 DISABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments            DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance             DISABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations            DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications          DISABLE ROW LEVEL SECURITY;
ALTER TABLE venues                 DISABLE ROW LEVEL SECURITY;
ALTER TABLE venue_images           DISABLE ROW LEVEL SECURITY;
ALTER TABLE venue_amenities        DISABLE ROW LEVEL SECURITY;
ALTER TABLE venue_rules            DISABLE ROW LEVEL SECURITY;
ALTER TABLE rental_requests        DISABLE ROW LEVEL SECURITY;
ALTER TABLE contracts              DISABLE ROW LEVEL SECURITY;
ALTER TABLE contract_clauses       DISABLE ROW LEVEL SECURITY;
ALTER TABLE contract_documents     DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments               DISABLE ROW LEVEL SECURITY;
ALTER TABLE events                 DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_incidents        DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tickets    DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_attachments DISABLE ROW LEVEL SECURITY;

-- 2. Hacer opcionales los FK que el formulario no puede proporcionar
ALTER TABLE payments             ALTER COLUMN contract_id   DROP NOT NULL;
ALTER TABLE maintenance_tickets  ALTER COLUMN venue_id      DROP NOT NULL;
ALTER TABLE events               ALTER COLUMN request_id    DROP NOT NULL;
ALTER TABLE events               ALTER COLUMN contract_id   DROP NOT NULL;

-- 3. Dar valor por defecto a password_hash para creación de usuarios desde admin
ALTER TABLE users ALTER COLUMN password_hash SET DEFAULT '$2a$10$placeholder.hash.for.prototype.use.only';

-- Listo. El prototipo ya puede leer y escribir desde el frontend.
