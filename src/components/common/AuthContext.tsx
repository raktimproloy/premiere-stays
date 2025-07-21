'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  role: 'admin' | 'superadmin' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DUMMY_USERS = [
  { email: 'admin@example.com', password: 'password123', role: 'admin' },
  { email: 'superadmin@example.com', password: 'password123', role: 'superadmin' },
];

// Add a type guard for role
function isValidRole(role: string | null): role is 'admin' | 'superadmin' {
  return role === 'admin' || role === 'superadmin';
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<'admin' | 'superadmin' | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for auth state and role
    const loggedIn = localStorage.getItem('isAuthenticated') === 'true';
    const storedRole = localStorage.getItem('role');
    setIsAuthenticated(loggedIn);
    if (storedRole === 'admin') {
      setRole('admin');
    } else if (storedRole === 'superadmin') {
      setRole('superadmin');
    } else {
      setRole(null);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    // Simulate async login
    await new Promise((res) => setTimeout(res, 700));
    const user = DUMMY_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      setIsAuthenticated(true);
      setRole(user.role as 'admin' | 'superadmin');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', user.role);
      setLoading(false);
      setError(null);
      return true;
    } else {
      setError('Invalid email or password');
      setLoading(false);
      setIsAuthenticated(false);
      setRole(null);
      localStorage.setItem('isAuthenticated', 'false');
      localStorage.removeItem('role');
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('role');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, error, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 