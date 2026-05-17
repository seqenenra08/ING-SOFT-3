/**
 * Programs service.
 * La tabla programs usa snake_case: schedule_desc, start_date, end_date, educator_id.
 * La vista v_programs expone: *, educator_name, enrolled_count, available_slots.
 */
import { api, isApiConfigured } from './api';
import { supabase, isSupabaseConfigured } from './supabase';
import { programsData } from '../data/mockData';

export interface Program {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  schedule: string;
  educator: string;
  educatorId?: string;
  level: string;
  capacity: number;
  enrolled: number;
  image: string;
  startDate: string;
  endDate: string;
}

function fromDbRow(row: any): Program {
  return {
    id:          row.id,
    name:        row.name          ?? '',
    category:    row.category      ?? '',
    description: row.description   ?? '',
    duration:    String(row.duration_months ?? ''),
    schedule:    row.schedule_desc ?? '',
    educator:    row.educator_name ?? '',
    educatorId:  row.educator_id   ?? undefined,
    level:       row.level         ?? '',
    capacity:    row.capacity      ?? 0,
    enrolled:    Number(row.enrolled_count) || 0,
    image:       row.image_url     ?? '',
    startDate:   row.start_date    ?? '',
    endDate:     row.end_date      ?? '',
  };
}

function toDbProgram(p: Partial<Program>): Record<string, unknown> {
  const db: Record<string, unknown> = {};
  if (p.name        !== undefined) db.name          = p.name;
  if (p.category    !== undefined) db.category      = p.category;
  if (p.description !== undefined) db.description   = p.description;
  if (p.schedule    !== undefined) db.schedule_desc = p.schedule;
  if (p.level       !== undefined) db.level         = p.level;
  if (p.capacity    !== undefined) db.capacity      = p.capacity;
  if (p.image       !== undefined) db.image_url     = p.image || null;
  if (p.startDate   !== undefined) db.start_date    = p.startDate || null;
  if (p.endDate     !== undefined) db.end_date      = p.endDate   || null;
  return db;
}

export const programsService = {
  async getAll(): Promise<Program[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('v_programs').select('*');
      if (error) throw new Error(error.message);
      return (data ?? []).map(fromDbRow);
    }
    if (!isApiConfigured()) return programsData as Program[];
    return api.get<Program[]>('/programs');
  },

  async getById(id: string): Promise<Program> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('v_programs').select('*').eq('id', id).single();
      if (error) throw new Error(error.message);
      return fromDbRow(data);
    }
    if (!isApiConfigured()) {
      const p = (programsData as Program[]).find(p => p.id === id);
      if (!p) throw new Error(`Program ${id} not found`);
      return p;
    }
    return api.get<Program>(`/programs/${id}`);
  },

  async create(payload: Omit<Program, 'id'>): Promise<Program> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('programs')
        .insert([toDbProgram(payload)])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return fromDbRow({ ...data, educator_name: payload.educator, enrolled_count: 0 });
    }
    if (!isApiConfigured()) {
      return { id: `mock-${Date.now()}`, ...payload } as Program;
    }
    return api.post<Program>('/programs', payload);
  },

  async update(id: string, payload: Partial<Program>): Promise<Program> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('programs')
        .update(toDbProgram(payload))
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      // Re-fetch from view to get educator_name and enrolled count
      const { data: view } = await supabase!
        .from('v_programs').select('*').eq('id', id).single();
      return fromDbRow(view ?? { ...data, educator_name: payload.educator });
    }
    if (!isApiConfigured()) {
      return { ...payload, id } as Program;
    }
    return api.put<Program>(`/programs/${id}`, payload);
  },

  async remove(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase!.from('programs').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }
    if (!isApiConfigured()) return;
    return api.delete(`/programs/${id}`);
  },

  async enroll(programId: string, studentId: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase!
        .from('enrollments')
        .insert([{ program_id: programId, student_id: studentId, status: 'activo' }]);
      if (error) throw new Error(error.message);
      return;
    }
    return api.post(`/programs/${programId}/enroll`, { studentId });
  },

  async unenroll(programId: string, studentId: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase!
        .from('enrollments')
        .delete()
        .eq('program_id', programId)
        .eq('student_id', studentId);
      if (error) throw new Error(error.message);
      return;
    }
    return api.delete(`/programs/${programId}/enroll/${studentId}`);
  },

  // Obtiene el students.id a partir del users.id del usuario logueado
  async getStudentId(userId: string): Promise<string | null> {
    if (isSupabaseConfigured()) {
      const { data } = await supabase!
        .from('students')
        .select('id')
        .eq('user_id', userId)
        .single();
      return data?.id ?? null;
    }
    return userId;
  },

  // Devuelve los programas en los que el estudiante está inscrito
  async getMyEnrollments(studentId: string): Promise<Program[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('enrollments')
        .select('program_id, status')
        .eq('student_id', studentId)
        .eq('status', 'activo');
      if (error) throw new Error(error.message);
      if (!data || data.length === 0) return [];
      const ids = data.map((e: any) => e.program_id);
      const { data: progs, error: pErr } = await supabase!
        .from('v_programs')
        .select('*')
        .in('id', ids);
      if (pErr) throw new Error(pErr.message);
      return (progs ?? []).map(fromDbRow);
    }
    return [];
  },

  // Verifica si un estudiante ya está inscrito en un programa
  async isEnrolled(programId: string, studentId: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { data } = await supabase!
        .from('enrollments')
        .select('program_id')
        .eq('program_id', programId)
        .eq('student_id', studentId)
        .maybeSingle();
      return !!data;
    }
    return false;
  },

  // Devuelve los programas asignados a un educador
  async getByEducatorId(educatorId: string): Promise<Program[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('v_programs')
        .select('*')
        .eq('educator_id', educatorId);
      if (error) throw new Error(error.message);
      return (data ?? []).map(fromDbRow);
    }
    return [];
  },

  // Cuenta inscripciones agrupadas por mes (para gráficas)
  async getMonthlyEnrollmentCounts(): Promise<{ month: string; students: number }[]> {
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    if (isSupabaseConfigured()) {
      const { data } = await supabase!
        .from('enrollments')
        .select('created_at')
        .eq('status', 'activo');
      const counts: Record<number, number> = {};
      (data ?? []).forEach((e: any) => {
        const m = new Date(e.created_at).getMonth();
        counts[m] = (counts[m] || 0) + 1;
      });
      return months.map((month, i) => ({ month, students: counts[i] || 0 }));
    }
    return months.map(month => ({ month, students: 0 }));
  },

  // Devuelve los estudiantes inscritos en un programa
  async getEnrolledStudents(programId: string): Promise<{ id: string; name: string }[]> {
    if (isSupabaseConfigured()) {
      const { data: enrollments } = await supabase!
        .from('enrollments')
        .select('student_id')
        .eq('program_id', programId)
        .eq('status', 'activo');
      if (!enrollments?.length) return [];
      const studentIds = enrollments.map((e: any) => e.student_id);
      const { data: students } = await supabase!
        .from('students')
        .select('id, user_id')
        .in('id', studentIds);
      if (!students?.length) return [];
      const userIds = students.map((s: any) => s.user_id);
      const { data: users } = await supabase!
        .from('users')
        .select('id, name')
        .in('id', userIds);
      return students.map((s: any) => {
        const u = (users ?? []).find((u: any) => u.id === s.user_id);
        return { id: s.id, name: u?.name ?? 'Estudiante' };
      });
    }
    return [];
  },
};
