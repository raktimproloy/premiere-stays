'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  dob?: Date;
  profileImage?: string;
  role: 'user' | 'admin' | 'superadmin';
  createdAt: Date;
  emailVerified: boolean;
  lastLogin?: Date;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'facebook' | 'apple') => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  role: 'user' | 'admin' | 'superadmin' | null;
}

interface SignupData {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  password: string;
  profileImage?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users for admin/superadmin (keeping existing functionality)
const DUMMY_USERS = [
  { email: 'admin@example.com', password: 'password123', role: 'admin' },
  { email: 'superadmin@example.com', password: 'password123', role: 'superadmin' },
];

// Add a type guard for role
function isValidRole(role: string | null): role is 'user' | 'admin' | 'superadmin' {
  return role === 'user' || role === 'admin' || role === 'superadmin';
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<'user' | 'admin' | 'superadmin' | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Handle NextAuth session
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (session?.user) {
      // Convert NextAuth session to our User format
      const userData: User = {
        id: session.user.id || '',
        fullName: session.user.name || '',
        email: session.user.email || '',
        profileImage: session.user.image || '',
        role: (session.user.role as 'user' | 'admin' | 'superadmin') || 'user',
        createdAt: new Date(),
        emailVerified: true,
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      setRole(userData.role);
      setLoading(false);
    } else {
      // Check localStorage for dummy admin/superadmin users
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          setRole(userData.role);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          // Clear invalid data
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    }
  }, [session, status]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // First check if it's a dummy admin/superadmin user
      const dummyUser = DUMMY_USERS.find(u => u.email === email && u.password === password);
      
      if (dummyUser) {
        // Handle dummy admin/superadmin login
        const userData: User = {
          id: 'dummy-' + Date.now(),
          fullName: email.split('@')[0],
          email: email,
          role: dummyUser.role,
          createdAt: new Date(),
          emailVerified: true
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        setRole(userData.role);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('role', userData.role);
        localStorage.setItem('user', JSON.stringify(userData));
        setLoading(false);
        return true;
      }

      // Handle regular user login with NextAuth
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return false;
      }

      setLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
      setLoading(false);
      return false;
    }
  };

  const signup = async (userData: SignupData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        setRole(data.user.role);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setLoading(false);
        return true;
      } else {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error. Please try again.');
      setLoading(false);
      return false;
    }
  };

  const socialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signIn(provider, { 
        callbackUrl: '/',
        redirect: false 
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return false;
      }

      setLoading(false);
      return true;
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setError('Network error. Please try again.');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    // Sign out from NextAuth
    signOut({ callbackUrl: '/' });
    
    // Clear local state and localStorage
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user,
      login, 
      signup,
      socialLogin,
      logout, 
      loading, 
      error, 
      role 
    }}>
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