import React, { createContext, useContext, useState, ReactNode } from 'react';

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock users
    if (email.includes('estudiante')) {
      setUser({
        id: '1',
        name: 'Camila Rodríguez',
        email: email,
        role: 'estudiante',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
      });
    } else if (email.includes('educador')) {
      setUser({
        id: '2',
        name: 'Carlos Martínez',
        email: email,
        role: 'educador',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
      });
    } else if (email.includes('admin')) {
      setUser({
        id: '3',
        name: 'Ana López',
        email: email,
        role: 'administrador',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
      });
    }
  };

  const register = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({
      id: '1',
      name: data.nombre + ' ' + data.apellido,
      email: data.email,
      role: 'estudiante'
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
