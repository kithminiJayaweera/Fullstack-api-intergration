import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser, logout as apiLogout, AuthUser, LoginCredentials, RegisterData } from '@/api/auth.api';
import { toast } from 'sonner';
import { useCookieMonitor } from '@/features/auth/hooks/useCookieMonitor';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount (via HTTP-only cookie)
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to get current user - the cookie will be sent automatically
        const response = await getCurrentUser();
        setUser(response.user);
      } catch {
        // No valid session/cookie - this is normal on first visit
        setUser(null);
      } finally {
        // Always set loading to false, regardless of success or failure
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Monitor auth_token cookie - logout if it's manually cleared
  // Works now because cookie is non-httpOnly (for tutorial purposes)
  useCookieMonitor({
    cookieName: 'auth_token',
    onCookieCleared: () => {
      if (user) {
        setUser(null);
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      }
    },
    checkInterval: 5000,
    enabled: user !== null,
  });

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await apiLogin(credentials);
      
      // No need to store in localStorage - cookie is set automatically by server
      // The browser will send the cookie automatically with every request
      
      setUser(response.user);
      toast.success(`Welcome back, ${response.user.firstName}!`);
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await apiRegister(data);
      
      // No need to store in localStorage - cookie is set automatically by server
      // The browser will send the cookie automatically with every request
      
      setUser(response.user);
      toast.success(`Welcome, ${response.user.firstName}!`);
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiLogout(); // This clears the HTTP-only cookie on the server
      setUser(null); // Clear user state immediately
      toast.success('Logged out successfully');
    } catch {
      // Even if logout fails, clear local user state
      setUser(null);
      toast.error('Logout failed, but you were logged out locally');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
