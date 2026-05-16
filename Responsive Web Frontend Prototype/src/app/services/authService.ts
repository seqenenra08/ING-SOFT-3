/**
 * Auth service.
 * Prioridad: Supabase Auth → backend REST → mock local.
 */
import { api, isApiConfigured, setToken, removeToken } from './api';
import { supabase, isSupabaseConfigured } from './supabase';

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
  const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  // Obtener perfil de la tabla users
  const { data: profile } = await supabase!
    .from('users')
    .select('id, name, role')
    .eq('id', data.user!.id)
    .single();

  const user: AuthUser = {
    id:    data.user!.id,
    name:  profile?.name ?? email.split('@')[0],
    email: data.user!.email!,
    role:  (profile?.role as UserRole) ?? roleFromEmail(email),
  };
  const token = data.session!.access_token;
  setToken(token);
  return { token, user };
}

async function supabaseRegister(payload: RegisterPayload): Promise<AuthResponse> {
  const { data, error } = await supabase!.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: { data: { name: payload.name, role: payload.role ?? 'estudiante' } },
  });
  if (error) throw new Error(error.message);

  const user: AuthUser = {
    id:    data.user!.id,
    name:  payload.name,
    email: payload.email,
    role:  payload.role ?? 'estudiante',
  };
  const token = data.session?.access_token ?? `sb_token_${user.id}`;
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
