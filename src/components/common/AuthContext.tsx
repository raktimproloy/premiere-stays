'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getBookingPath, clearBookingPath } from '@/utils/cookies';

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<'user' | 'admin' | 'superadmin' | null>(null);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        setRole(data.user.role);
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
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessfulAuth = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    setRole(userData.role);
    setLoading(false);

    // Check for booking path redirect
    const bookingPath = getBookingPath();
    if (bookingPath && userData.role === 'user') {
      // Clear the booking path cookie
      clearBookingPath();
      // Redirect to the saved booking path with searchId if available
      const redirectPath = bookingPath.searchId 
        ? `${bookingPath.path}?id=${bookingPath.searchId}`
        : bookingPath.path;
      router.push(redirectPath);
    } else {
      // Default redirect based on role
      if (userData.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (userData.role === 'superadmin') {
        router.push('/superadmin/dashboard');
      } else {
        router.push('/');
      }
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // First check if it's a dummy admin/superadmin user
      const dummyUser = DUMMY_USERS.find(u => u.email === email && u.password === password);
      
      if (dummyUser) {
        // Handle dummy admin/superadmin login
        const userData: User = {
          _id: 'dummy-' + Date.now(),
          fullName: email.split('@')[0],
          email: email,
          phone: '',
          dob: '',
          role: dummyUser.role as 'admin' | 'user' | 'superadmin',
          createdAt: new Date(),
          emailVerified: true
        };
        
        handleSuccessfulAuth(userData);
        localStorage.setItem('authToken', 'dummy-token');
        localStorage.setItem('user', JSON.stringify(userData));
        
        return true;
      }

      // Handle regular user login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        handleSuccessfulAuth(data.user);
        return true;
      } else {
        setError(data.message || 'Login failed');
        setLoading(false);
        return false;
      }
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
        handleSuccessfulAuth(data.user);
        return true;
      } else {
        setError(data.message || 'Signup failed');
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

  const logout = async () => {
    try {
      // Call logout API to clear server-side session
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }
    
    // Clear local state and localStorage
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Redirect to home page
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user,
      login, 
      signup,
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