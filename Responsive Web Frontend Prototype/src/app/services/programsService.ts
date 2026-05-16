/**
 * Programs service.
 * Prioridad: Supabase → REST API → mock local.
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
  level: string;
  capacity: number;
  enrolled: number;
  image: string;
  startDate: string;
  endDate: string;
}

export const programsService = {
  async getAll(): Promise<Program[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('v_programs')
        .select('*');
      if (error) throw new Error(error.message);
      return (data ?? []) as Program[];
    }
    if (!isApiConfigured()) return programsData as Program[];
    return api.get<Program[]>('/programs');
  },

  async getById(id: string): Promise<Program> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('v_programs')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw new Error(error.message);
      return data as Program;
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
        .insert([payload])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Program;
    }
    return api.post<Program>('/programs', payload);
  },

  async update(id: string, payload: Partial<Program>): Promise<Program> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('programs')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Program;
    }
    return api.put<Program>(`/programs/${id}`, payload);
  },

  async remove(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase!.from('programs').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }
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
};
