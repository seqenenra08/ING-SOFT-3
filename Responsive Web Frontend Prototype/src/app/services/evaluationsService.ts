/**
 * Evaluations service.
 * Tabla `evaluations` (ver database/schema.sql + database/migration_evaluations.sql):
 *   id, student_id, educator_id, program_id, evaluation_date,
 *   nota (NUMERIC 0-5, añadida por la migración),
 *   fortalezas, oportunidades, observaciones, recomendaciones
 *
 * Cada save inserta una fila nueva: así se construye el historial.
 * Para mostrar al educador el último valor por estudiante, ordenamos por
 * evaluation_date DESC y tomamos el primero por student_id.
 */
import { supabase, isSupabaseConfigured } from './supabase';

export interface Evaluation {
  id: string;
  studentId: string;
  studentName?: string;
  educatorId: string;
  educatorName?: string;
  programId: string;
  programName?: string;
  programCategory?: string;
  date: string;
  nota: number | null;
  observaciones: string;
}

interface EvaluationInput {
  studentId: string;
  educatorId: string;
  programId: string;
  nota: number | null;
  observaciones: string;
}

function fromDbRow(row: any): Evaluation {
  return {
    id:              row.id,
    studentId:       row.student_id,
    educatorId:      row.educator_id,
    programId:       row.program_id,
    date:            row.evaluation_date ?? '',
    nota:            row.nota === null || row.nota === undefined ? null : Number(row.nota),
    observaciones:   row.observaciones ?? '',
  };
}

export const evaluationsService = {
  /**
   * Inserta una evaluación por cada entrada del array.
   * Solo se guardan las que tienen nota o observación no vacía
   * (el llamador puede filtrar antes; aquí no asumimos nada).
   */
  async saveBatch(items: EvaluationInput[]): Promise<Evaluation[]> {
    if (!items.length) return [];
    if (!isSupabaseConfigured()) {
      // Prototipo sin Supabase: solo devolvemos lo recibido con id falso.
      const now = new Date().toISOString().slice(0, 10);
      return items.map((it, i) => ({
        id: `mock-${Date.now()}-${i}`,
        studentId: it.studentId,
        educatorId: it.educatorId,
        programId: it.programId,
        date: now,
        nota: it.nota,
        observaciones: it.observaciones,
      }));
    }

    const today = new Date().toISOString().slice(0, 10);
    const payload = items.map(it => ({
      student_id:      it.studentId,
      educator_id:     it.educatorId,
      program_id:      it.programId,
      evaluation_date: today,
      nota:            it.nota,
      observaciones:   it.observaciones || null,
    }));
    const { data, error } = await supabase!
      .from('evaluations')
      .insert(payload)
      .select('*');
    if (error) throw new Error(error.message);
    return (data ?? []).map(fromDbRow);
  },

  /**
   * Devuelve la evaluación más reciente de cada estudiante en un programa.
   * Útil para precargar el formulario del educador.
   */
  async getLatestByProgram(programId: string): Promise<Map<string, Evaluation>> {
    const map = new Map<string, Evaluation>();
    if (!isSupabaseConfigured()) return map;

    const { data, error } = await supabase!
      .from('evaluations')
      .select('*')
      .eq('program_id', programId)
      .order('evaluation_date', { ascending: false });
    if (error) throw new Error(error.message);

    for (const row of data ?? []) {
      const ev = fromDbRow(row);
      if (!map.has(ev.studentId)) map.set(ev.studentId, ev);
    }
    return map;
  },

  /**
   * Devuelve todas las evaluaciones de un programa (historial completo)
   * con nombres de estudiantes y educadores ya resueltos.
   */
  async getByProgram(programId: string): Promise<Evaluation[]> {
    if (!isSupabaseConfigured()) return [];

    const { data: rows, error } = await supabase!
      .from('evaluations')
      .select('*')
      .eq('program_id', programId)
      .order('evaluation_date', { ascending: false });
    if (error) throw new Error(error.message);

    return enrich(rows ?? []);
  },

  /**
   * Devuelve todas las evaluaciones de un estudiante (por students.id),
   * ordenadas por fecha desc, con nombres de programa y educador.
   */
  async getByStudent(studentId: string): Promise<Evaluation[]> {
    if (!isSupabaseConfigured()) return [];

    const { data: rows, error } = await supabase!
      .from('evaluations')
      .select('*')
      .eq('student_id', studentId)
      .order('evaluation_date', { ascending: false });
    if (error) throw new Error(error.message);

    return enrich(rows ?? []);
  },

  /**
   * Devuelve el historial completo (admin). Limitado por defecto a 500 filas
   * para no traer toda la BD si crece mucho.
   */
  async getAll(limit = 500): Promise<Evaluation[]> {
    if (!isSupabaseConfigured()) return [];

    const { data: rows, error } = await supabase!
      .from('evaluations')
      .select('*')
      .order('evaluation_date', { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);

    return enrich(rows ?? []);
  },
};

/**
 * Enriquece evaluaciones con nombres legibles de estudiante, educador y programa.
 * Hace 3 queries por ids únicos para no inflar la query principal.
 */
async function enrich(rows: any[]): Promise<Evaluation[]> {
  if (!rows.length || !isSupabaseConfigured()) return rows.map(fromDbRow);

  const studentIds  = Array.from(new Set(rows.map(r => r.student_id).filter(Boolean)));
  const educatorIds = Array.from(new Set(rows.map(r => r.educator_id).filter(Boolean)));
  const programIds  = Array.from(new Set(rows.map(r => r.program_id).filter(Boolean)));

  const [studentsRes, educatorsRes, programsRes] = await Promise.all([
    studentIds.length
      ? supabase!.from('v_students').select('id, name').in('id', studentIds)
      : Promise.resolve({ data: [] as any[] }),
    educatorIds.length
      ? supabase!.from('v_educators').select('id, name').in('id', educatorIds)
      : Promise.resolve({ data: [] as any[] }),
    programIds.length
      ? supabase!.from('programs').select('id, name, category').in('id', programIds)
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const studentMap  = new Map((studentsRes.data  ?? []).map((s: any) => [s.id, s.name as string]));
  const educatorMap = new Map((educatorsRes.data ?? []).map((e: any) => [e.id, e.name as string]));
  const programMap  = new Map((programsRes.data  ?? []).map((p: any) => [p.id, p as { id: string; name: string; category: string }]));

  return rows.map(r => {
    const base = fromDbRow(r);
    const prog = programMap.get(r.program_id);
    return {
      ...base,
      studentName:    studentMap.get(r.student_id) ?? '',
      educatorName:   educatorMap.get(r.educator_id) ?? '',
      programName:    prog?.name ?? '',
      programCategory: prog?.category ?? '',
    };
  });
}
