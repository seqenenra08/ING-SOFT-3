-- ============================================================
--  MIGRACIÓN: SOPORTE DE EVALUACIONES (NOTAS) DESDE EL FRONTEND
--  Ejecutar en el SQL Editor de Supabase.
-- ============================================================

-- 1. Añadir columna 'nota' (0.0 - 5.0) a evaluations
ALTER TABLE evaluations
  ADD COLUMN IF NOT EXISTS nota NUMERIC(3,1);

-- 2. Índice para consulta rápida del histórico por estudiante
CREATE INDEX IF NOT EXISTS idx_evaluations_student_program_date
  ON evaluations (student_id, program_id, evaluation_date DESC);

-- 3. Desactivar RLS para el prototipo (igual que el resto)
ALTER TABLE evaluations DISABLE ROW LEVEL SECURITY;
