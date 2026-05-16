import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { setToken as saveToken, removeToken } from '../services/api';

export type UserRole = 'estudiante' | 'educador' | 'administrador' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Persisted user stored as JSON in localStorage
const STORAGE_KEY = 'auth_user';

function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

// Avatar placeholders per role (used only when API does not provide one)
const ROLE_AVATARS: Record<string, string> = {
  estudiante:    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  educador:      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  administrador: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(loadStoredUser);
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('auth_token'));

  // Keep localStorage in sync
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    const u: User = {
      id:     result.user.id,
      name:   result.user.name,
      email:  result.user.email,
      role:   result.user.role as UserRole,
      avatar: ROLE_AVATARS[result.user.role],
    };
    saveToken(result.token);
    setTokenState(result.token);
    setUser(u);
  };

  const register = async (data: any) => {
    const result = await authService.register({
      name:  `${data.nombre ?? ''} ${data.apellido ?? ''}`.trim() || data.name || data.email,
      email: data.email,
      password: data.password,
      role: 'estudiante',
    });
    const u: User = {
      id:     result.user.id,
      name:   result.user.name,
      email:  result.user.email,
      role:   result.user.role as UserRole,
      avatar: ROLE_AVATARS[result.user.role],
    };
    saveToken(result.token);
    setTokenState(result.token);
    setUser(u);
  };

  const logout = () => {
    authService.logout();
    removeToken();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      register,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
