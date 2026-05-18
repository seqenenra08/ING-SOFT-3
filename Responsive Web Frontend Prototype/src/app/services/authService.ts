/**
 * Auth service.
 * Prioridad: Supabase Auth → backend REST → mock local.
 */
import { api, isApiConfigured, setToken, removeToken } from './api';
import { supabase, isSupabaseConfigured } from './supabase';
import { sha256 } from './crypto';

export type UserRole = 'estudiante' | 'educador' | 'administrador';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  // Datos opcionales para crear perfil de estudiante
  documento?: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string;
  acudiente?: string;
  telefonoAcudiente?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// ── Mock helper ────────────────────────────────────────────────────────────────
function mockLogin(email: string): AuthResponse {
  let role: UserRole = 'estudiante';
  if (email.includes('educador')) role = 'educador';
  else if (email.includes('admin'))    role = 'administrador';

  const user: AuthUser = {
    id:    '1',
    name:  email.split('@')[0].replace('.', ' '),
    email,
    role,
  };
  const token = `mock_token_${role}`;
  return { token, user };
}

// ── Helpers Supabase ───────────────────────────────────────────────────────────
function roleFromEmail(email: string): UserRole {
  if (email.includes('educador')) return 'educador';
  if (email.includes('admin'))    return 'administrador';
  return 'estudiante';
}

async function supabaseLogin(email: string, password: string): Promise<AuthResponse> {
  // 1. Try Supabase Auth first (works for admin accounts registered via Auth)
  const { data, error } = await supabase!.auth.signInWithPassword({ email, password });

  if (!error && data.user) {
    const { data: profile } = await supabase!
      .from('users')
      .select('id, name, role')
      .eq('id', data.user.id)
      .single();

    const user: AuthUser = {
      id:    data.user.id,
      name:  profile?.name ?? email.split('@')[0],
      email: data.user.email!,
      role:  (profile?.role as UserRole) ?? roleFromEmail(email),
    };
    const token = data.session!.access_token;
    setToken(token);
    return { token, user };
  }

  // 2. Fallback: query custom users table by email + SHA-256 password check
  const { data: profile } = await supabase!
    .from('users')
    .select('id, name, role, email, password_hash')
    .eq('email', email)
    .single();

  if (profile) {
    const hash = await sha256(password);
    if (profile.password_hash !== hash) {
      throw new Error('Credenciales inválidas');
    }
    const user: AuthUser = {
      id:    profile.id,
      name:  profile.name ?? email.split('@')[0],
      email: profile.email ?? email,
      role:  (profile.role as UserRole) ?? roleFromEmail(email),
    };
    const token = `prototype_token_${profile.id}`;
    setToken(token);
    return { token, user };
  }

  throw new Error('Credenciales inválidas');
}

async function supabaseRegister(payload: RegisterPayload): Promise<AuthResponse> {
  const role: UserRole = payload.role ?? 'estudiante';

  // 1. Validar que el correo no exista ya en la tabla custom users
  const { data: existing } = await supabase!
    .from('users')
    .select('id')
    .eq('email', payload.email)
    .maybeSingle();
  if (existing) {
    throw new Error('Ya existe una cuenta con ese correo electrónico');
  }

  // 2. Insertar usuario en la tabla custom con hash sha256
  const passwordHash = await sha256(payload.password);
  const { data: created, error: userErr } = await supabase!
    .from('users')
    .insert([{
      email:         payload.email,
      name:          payload.name,
      role,
      password_hash: passwordHash,
    }])
    .select('id, name, email, role')
    .single();
  if (userErr || !created) throw new Error(userErr?.message ?? 'Error al crear la cuenta');

  // 3. Si es estudiante y vienen datos del perfil, crear fila en students
  if (role === 'estudiante') {
    const { error: studentErr } = await supabase!
      .from('students')
      .insert([{
        user_id:            created.id,
        documento:          payload.documento || `TEMP-${created.id.slice(0, 8)}`,
        telefono:           payload.telefono          || null,
        direccion:          payload.direccion         || null,
        fecha_nacimiento:   payload.fechaNacimiento   || null,
        acudiente:          payload.acudiente         || null,
        telefono_acudiente: payload.telefonoAcudiente || null,
        estado:             'Activo',
      }]);
    if (studentErr) {
      // Rollback: borrar el usuario recién creado para no dejar huérfano
      await supabase!.from('users').delete().eq('id', created.id);
      throw new Error(studentErr.message);
    }
  }

  const user: AuthUser = {
    id:    created.id,
    name:  created.name ?? payload.name,
    email: created.email ?? payload.email,
    role:  (created.role as UserRole) ?? role,
  };
  const token = `prototype_token_${user.id}`;
  setToken(token);
  return { token, user };
}

// ── Public API ─────────────────────────────────────────────────────────────────
export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    if (isSupabaseConfigured()) {
      return supabaseLogin(payload.email, payload.password);
    }
    if (isApiConfigured()) {
      const result = await api.post<AuthResponse>('/auth/login', payload);
      setToken(result.token);
      return result;
    }
    // Mock fallback
    const result = mockLogin(payload.email);
    setToken(result.token);
    return result;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (isSupabaseConfigured()) {
      return supabaseRegister(payload);
    }
    if (isApiConfigured()) {
      const result = await api.post<AuthResponse>('/auth/register', payload);
      setToken(result.token);
      return result;
    }
    const result = mockLogin(payload.email);
    setToken(result.token);
    return result;
  },

  async me(): Promise<AuthUser> {
    if (isSupabaseConfigured()) {
      const { data } = await supabase!.auth.getUser();
      if (!data.user) throw new Error('No session');
      const { data: profile } = await supabase!
        .from('users')
        .select('id, name, role')
        .eq('id', data.user.id)
        .single();
      return {
        id:    data.user.id,
        name:  profile?.name ?? data.user.email!.split('@')[0],
        email: data.user.email!,
        role:  (profile?.role as UserRole) ?? roleFromEmail(data.user.email!),
      };
    }
    return api.get<AuthUser>('/auth/me');
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase!.auth.signOut();
    }
    removeToken();
    localStorage.removeItem('auth_user');
  },
};
