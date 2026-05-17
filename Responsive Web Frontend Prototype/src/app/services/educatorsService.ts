/**
 * Educators service.
 * El perfil del educador está dividido en:
 *   users     → id, email, name, role
 *   educators → id, user_id, especialidad, telefono, bio
 * La vista v_educators las une.
 */
import { api, isApiConfigured } from './api';
import { supabase, isSupabaseConfigured } from './supabase';
import { sha256, DEFAULT_PASSWORD } from './crypto';
import { educatorsData } from '../data/mockData';

export interface Educator {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  email: string;
  telefono: string;
  bio?: string;
  programas: string[];
  grupos: number;
  estudiantes: number;
  active?: boolean;
}

function fromDbRow(row: any): Educator {
  const fullName: string = row.name ?? '';
  const parts = fullName.trim().split(' ');
  const apellido = parts.length > 1 ? parts.slice(-1).join(' ') : '';
  const nombre   = parts.length > 1 ? parts.slice(0, -1).join(' ') : fullName;
  return {
    id:           row.id,
    nombre,
    apellido,
    especialidad: row.especialidad  ?? '',
    email:        row.email         ?? '',
    telefono:     row.telefono      ?? '',
    bio:          row.bio           ?? undefined,
    programas:    [],
    grupos:       Number(row.total_programs) || 0,
    estudiantes:  Number(row.total_students) || 0,
    active:       row.active        ?? true,
  };
}

export const educatorsService = {
  async getAll(): Promise<Educator[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('v_educators').select('*');
      if (error) throw new Error(error.message);
      return (data ?? []).map(fromDbRow);
    }
    if (!isApiConfigured()) return educatorsData as Educator[];
    return api.get<Educator[]>('/educators');
  },

  async getById(id: string): Promise<Educator> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('v_educators').select('*').eq('id', id).single();
      if (error) throw new Error(error.message);
      return fromDbRow(data);
    }
    if (!isApiConfigured()) {
      const e = (educatorsData as Educator[]).find(e => e.id === id);
      if (!e) throw new Error(`Educator ${id} not found`);
      return e;
    }
    return api.get<Educator>(`/educators/${id}`);
  },

  async create(payload: Omit<Educator, 'id'>): Promise<Educator> {
    if (isSupabaseConfigured()) {
      const fullName = `${payload.nombre ?? ''} ${payload.apellido ?? ''}`.trim();

      // 1. Crear en users
      const passwordHash = await sha256(DEFAULT_PASSWORD);
      const { data: user, error: userErr } = await supabase!
        .from('users')
        .insert([{
          email:         payload.email,
          name:          fullName,
          role:          'educador',
          password_hash: passwordHash,
        }])
        .select('id')
        .single();
      if (userErr) throw new Error(userErr.message);

      // 2. Crear perfil en educators
      const { data: educator, error: edErr } = await supabase!
        .from('educators')
        .insert([{
          user_id:      user.id,
          especialidad: payload.especialidad ?? '',
          telefono:     payload.telefono     ?? null,
          bio:          payload.bio          ?? null,
        }])
        .select('*')
        .single();

      if (edErr) {
        await supabase!.from('users').delete().eq('id', user.id);
        throw new Error(edErr.message);
      }

      return fromDbRow({ ...educator, name: fullName, email: payload.email, total_programs: 0, total_students: 0 });
    }
    if (!isApiConfigured()) {
      return { id: `mock-${Date.now()}`, ...payload } as Educator;
    }
    return api.post<Educator>('/educators', payload);
  },

  async update(id: string, payload: Partial<Educator>): Promise<Educator> {
    if (isSupabaseConfigured()) {
      const { data: existing } = await supabase!
        .from('educators').select('user_id').eq('id', id).single();

      // Actualizar users
      if (existing?.user_id && (payload.nombre || payload.apellido || payload.email)) {
        const userUpdate: Record<string, string> = {};
        const fullName = `${payload.nombre ?? ''} ${payload.apellido ?? ''}`.trim();
        if (fullName)        userUpdate.name  = fullName;
        if (payload.email)   userUpdate.email = payload.email;
        await supabase!.from('users').update(userUpdate).eq('id', existing.user_id);
      }

      // Actualizar educators
      const edUpdate: Record<string, unknown> = {};
      if (payload.especialidad !== undefined) edUpdate.especialidad = payload.especialidad;
      if (payload.telefono     !== undefined) edUpdate.telefono     = payload.telefono;
      if (payload.bio          !== undefined) edUpdate.bio          = payload.bio;

      if (Object.keys(edUpdate).length > 0) {
        const { error } = await supabase!.from('educators').update(edUpdate).eq('id', id);
        if (error) throw new Error(error.message);
      }

      // Re-leer desde la vista
      const { data: updated, error: fetchErr } = await supabase!
        .from('v_educators').select('*').eq('id', id).single();
      if (fetchErr) throw new Error(fetchErr.message);
      return fromDbRow(updated);
    }
    if (!isApiConfigured()) {
      const existing = (educatorsData as Educator[]).find(e => e.id === id);
      return { ...(existing ?? {}), ...payload, id } as Educator;
    }
    return api.put<Educator>(`/educators/${id}`, payload);
  },

  async getEducatorId(userId: string): Promise<string | null> {
    if (isSupabaseConfigured()) {
      const { data } = await supabase!
        .from('educators').select('id').eq('user_id', userId).single();
      return data?.id ?? null;
    }
    return userId;
  },

  async remove(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { data: e } = await supabase!
        .from('educators').select('user_id').eq('id', id).single();
      if (e?.user_id) {
        const { error } = await supabase!.from('users').delete().eq('id', e.user_id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase!.from('educators').delete().eq('id', id);
        if (error) throw new Error(error.message);
      }
      return;
    }
    if (!isApiConfigured()) return;
    return api.delete(`/educators/${id}`);
  },
};
