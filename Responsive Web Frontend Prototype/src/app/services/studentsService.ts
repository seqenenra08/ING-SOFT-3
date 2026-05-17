/**
 * Students service.
 * El perfil de estudiante está dividido en dos tablas:
 *   users   → id, email, name (nombre completo), role
 *   students → id, user_id, documento, telefono, direccion, fecha_nacimiento, ...
 * La vista v_students las une.
 */
import { api, isApiConfigured } from './api';
import { supabase, isSupabaseConfigured } from './supabase';
import { sha256, DEFAULT_PASSWORD } from './crypto';
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
  programas?: string[];
  estado: string;
}

function fromDbRow(row: any): Student {
  const fullName: string = row.name ?? '';
  const parts = fullName.trim().split(' ');
  const apellido = parts.length > 1 ? parts.slice(-1).join(' ') : '';
  const nombre   = parts.length > 1 ? parts.slice(0, -1).join(' ') : fullName;
  return {
    id:                row.id,
    nombre,
    apellido,
    email:             row.email               ?? '',
    documento:         row.documento           ?? '',
    telefono:          row.telefono            ?? '',
    direccion:         row.direccion           ?? '',
    fechaNacimiento:   row.fecha_nacimiento    ?? '',
    acudiente:         row.acudiente           ?? '',
    telefonoAcudiente: row.telefono_acudiente  ?? '',
    programas:         [],
    estado:            row.estado              ?? 'Activo',
  };
}

export const studentsService = {
  async getAll(): Promise<Student[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('v_students').select('*');
      if (error) throw new Error(error.message);
      return (data ?? []).map(fromDbRow);
    }
    if (!isApiConfigured()) return studentsData as Student[];
    return api.get<Student[]>('/students');
  },

  async getById(id: string): Promise<Student> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('v_students').select('*').eq('id', id).single();
      if (error) throw new Error(error.message);
      return fromDbRow(data);
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
      const fullName = `${payload.nombre ?? ''} ${payload.apellido ?? ''}`.trim();

      // 1. Crear entrada en users
      const passwordHash = await sha256(DEFAULT_PASSWORD);
      const { data: user, error: userErr } = await supabase!
        .from('users')
        .insert([{
          email:         payload.email,
          name:          fullName,
          role:          'estudiante',
          password_hash: passwordHash,
        }])
        .select('id')
        .single();
      if (userErr) throw new Error(userErr.message);

      // 2. Crear perfil en students
      const { data: student, error: studentErr } = await supabase!
        .from('students')
        .insert([{
          user_id:           user.id,
          documento:         payload.documento         || '',
          telefono:          payload.telefono          || null,
          direccion:         payload.direccion         || null,
          fecha_nacimiento:  payload.fechaNacimiento   || null,
          acudiente:         payload.acudiente         || null,
          telefono_acudiente:payload.telefonoAcudiente || null,
          estado:            payload.estado            || 'Activo',
        }])
        .select('*')
        .single();

      if (studentErr) {
        // Rollback: eliminar el usuario recién creado
        await supabase!.from('users').delete().eq('id', user.id);
        throw new Error(studentErr.message);
      }

      return fromDbRow({ ...student, name: fullName, email: payload.email });
    }
    if (!isApiConfigured()) {
      return { ...payload, id: `mock-${Date.now()}` } as Student;
    }
    return api.post<Student>('/students', payload);
  },

  async update(id: string, payload: Partial<Student>): Promise<Student> {
    if (isSupabaseConfigured()) {
      // Obtener user_id del estudiante
      const { data: existing } = await supabase!
        .from('students').select('user_id').eq('id', id).single();

      // Actualizar users si hay cambios de nombre/email
      if (existing?.user_id && (payload.nombre || payload.apellido || payload.email)) {
        const userUpdate: Record<string, string> = {};
        const fullName = `${payload.nombre ?? ''} ${payload.apellido ?? ''}`.trim();
        if (fullName)        userUpdate.name  = fullName;
        if (payload.email)   userUpdate.email = payload.email;
        if (Object.keys(userUpdate).length > 0) {
          await supabase!.from('users').update(userUpdate).eq('id', existing.user_id);
        }
      }

      // Actualizar students con los campos que corresponden
      const studentUpdate: Record<string, unknown> = {};
      if (payload.documento         !== undefined) studentUpdate.documento          = payload.documento;
      if (payload.telefono          !== undefined) studentUpdate.telefono           = payload.telefono;
      if (payload.direccion         !== undefined) studentUpdate.direccion          = payload.direccion;
      if (payload.fechaNacimiento   !== undefined) studentUpdate.fecha_nacimiento   = payload.fechaNacimiento || null;
      if (payload.acudiente         !== undefined) studentUpdate.acudiente          = payload.acudiente;
      if (payload.telefonoAcudiente !== undefined) studentUpdate.telefono_acudiente = payload.telefonoAcudiente;
      if (payload.estado            !== undefined) studentUpdate.estado             = payload.estado;

      if (Object.keys(studentUpdate).length > 0) {
        const { error } = await supabase!
          .from('students').update(studentUpdate).eq('id', id);
        if (error) throw new Error(error.message);
      }

      // Re-leer desde la vista para obtener datos combinados
      const { data: updated, error: fetchErr } = await supabase!
        .from('v_students').select('*').eq('id', id).single();
      if (fetchErr) throw new Error(fetchErr.message);
      return fromDbRow(updated);
    }
    if (!isApiConfigured()) {
      return { ...payload, id } as Student;
    }
    return api.put<Student>(`/students/${id}`, payload);
  },

  async remove(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      // Obtener user_id y eliminar el usuario (cascade elimina el perfil students)
      const { data: s } = await supabase!
        .from('students').select('user_id').eq('id', id).single();
      if (s?.user_id) {
        const { error } = await supabase!.from('users').delete().eq('id', s.user_id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase!.from('students').delete().eq('id', id);
        if (error) throw new Error(error.message);
      }
      return;
    }
    if (!isApiConfigured()) return;
    return api.delete(`/students/${id}`);
  },
};
