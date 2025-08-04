'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
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
  loginWithGoogle: (userData: User, token: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  role: 'user' | 'admin' | 'superadmin' | null;
  testRedirect: () => void;
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
  
  // Add refs to prevent multiple simultaneous calls
  const authCheckInProgress = useRef(false);
  const lastAuthCheck = useRef<number>(0);
  const AUTH_CHECK_INTERVAL = 30000; // 30 seconds

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    // Prevent multiple simultaneous calls
    if (authCheckInProgress.current) {
      return;
    }

    // Check if we've recently checked auth status
    const now = Date.now();
    if (now - lastAuthCheck.current < AUTH_CHECK_INTERVAL) {
      setLoading(false);
      return;
    }

    try {
      authCheckInProgress.current = true;
      setLoading(true);
      lastAuthCheck.current = now;
      
      // Check server-side authentication (for regular users with HTTP-only cookies)
      const response = await fetch('/api/auth/me');
      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        setRole(data.user.role);
        setLoading(false);
        return;
      }

      // If server-side auth fails, check localStorage for dummy admin/superadmin users only
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // Only allow dummy users (admin/superadmin) from localStorage
          if (userData.role === 'admin' || userData.role === 'superadmin') {
            setUser(userData);
            setIsAuthenticated(true);
            setRole(userData.role);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          // Clear invalid data
          localStorage.removeItem('user');
        }
      }

      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('Auth status check error:', error);
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
      authCheckInProgress.current = false;
    }
  };

  const handleSuccessfulAuth = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    setRole(userData.role);
    setLoading(false);

    // Add a small delay to ensure state updates are processed
    setTimeout(() => {
      
      // Check for booking path redirect
      const bookingPath = getBookingPath();
      
      if (bookingPath && userData.role === 'user') {
        // Clear the booking path cookie
        clearBookingPath();
        // Redirect to the saved booking path with searchId if available
        const redirectPath = bookingPath.searchId 
          ? `${bookingPath.path}?id=${bookingPath.searchId}`
          : bookingPath.path;
        try {
          router.push(redirectPath);
        } catch (error) {
          window.location.href = redirectPath;
        }
      } else {
        // Default redirect based on role
        let redirectPath = '/';
        if (userData.role === 'admin') {
          redirectPath = '/admin/dashboard';
        } else if (userData.role === 'superadmin') {
          redirectPath = '/superadmin/dashboard';
        } else {
          redirectPath = '/';
        }
        try {
          router.push(redirectPath);
        } catch (error) {
          window.location.href = redirectPath;
        }
      }
    }, 500); // Increased delay to ensure state updates
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
        // Store dummy user in localStorage (no token needed for dummy users)
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

  const loginWithGoogle = async (userData: User, token: string) => {
    setLoading(true);
    setError(null);
    
    try {
      
      // For Google users, we don't need to store token in localStorage
      // The token is handled by NextAuth and stored in cookies
      handleSuccessfulAuth(userData);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google authentication failed');
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
    
    // Clear NextAuth session (Google session) - using the direct function as requested
    try {
      await signOut({ redirect: false });
    } catch (error) {
      console.error('NextAuth signOut error:', error);
    }
    
    // Clear local state and localStorage
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
    localStorage.removeItem('user');
    
    // Reset auth check timestamp to allow immediate re-check if needed
    lastAuthCheck.current = 0;
    
    // Redirect to home page
    router.push('/');
  };

  // Test function for debugging redirect
  const testRedirect = () => {
    router.push('/');
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    isAuthenticated, 
    user,
    login, 
    loginWithGoogle,
    signup,
    logout, 
    loading, 
    error, 
    role,
    testRedirect
  }), [isAuthenticated, user, loading, error, role]);

  return (
    <AuthContext.Provider value={contextValue}>
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