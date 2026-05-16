/**
 * Base API client.
 * Set VITE_API_BASE_URL in your .env to point to the real backend.
 * While the env var is absent the mock services fall back to local data.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const isApiConfigured = (): boolean =>
  Boolean(BASE_URL && BASE_URL.length > 0);

// ── Token helpers ──────────────────────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem('auth_token');
export const setToken = (token: string): void => localStorage.setItem('auth_token', token);
export const removeToken = (): void => localStorage.removeItem('auth_token');

// ── Generic fetch wrapper ──────────────────────────────────────────────────────
export interface ApiError {
  status: number;
  message: string;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  if (!isApiConfigured()) {
    throw new Error('API not configured — set VITE_API_BASE_URL');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const errBody = await res.json();
      message = errBody?.message ?? errBody?.detail ?? message;
    } catch {
      // ignore parse errors
    }
    const err: ApiError = { status: res.status, message };
    throw err;
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(path: string)               => request<T>('GET',    path),
  post:   <T>(path: string, body: unknown) => request<T>('POST',   path, body),
  put:    <T>(path: string, body: unknown) => request<T>('PUT',    path, body),
  patch:  <T>(path: string, body?: unknown)=> request<T>('PATCH',  path, body),
  delete: <T>(path: string)               => request<T>('DELETE',  path),
};
