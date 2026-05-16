/**
 * Students service.
 * Prioridad: Supabase → REST API → mock local.
 */
import { api, isApiConfigured } from './api';
import { supabase, isSupabaseConfigured } from './supabase';
import { studentsData } from '../data/mockData';

export interface Student {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: string;
  acudiente: string;
  telefonoAcudiente: string;
  programas: string[];
  estado: string;
}

export const studentsService = {
  async getAll(): Promise<Student[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('v_students')
        .select('*');
      if (error) throw new Error(error.message);
      return (data ?? []) as Student[];
    }
    if (!isApiConfigured()) return studentsData as Student[];
    return api.get<Student[]>('/students');
  },

  async getById(id: string): Promise<Student> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('v_students')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw new Error(error.message);
      return data as Student;
    }
    if (!isApiConfigured()) {
      const s = (studentsData as Student[]).find(s => s.id === id);
      if (!s) throw new Error(`Student ${id} not found`);
      return s;
    }
    return api.get<Student>(`/students/${id}`);
  },

  async create(payload: Omit<Student, 'id'>): Promise<Student> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('students')
        .insert([payload])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Student;
    }
    return api.post<Student>('/students', payload);
  },

  async update(id: string, payload: Partial<Student>): Promise<Student> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('students')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Student;
    }
    return api.put<Student>(`/students/${id}`, payload);
  },

  async remove(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase!
        .from('students')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }
    return api.delete(`/students/${id}`);
  },
};
