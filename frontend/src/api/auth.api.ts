import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CRITICAL: Send cookies automatically with every request
});

// Handle 401 errors (token expired/invalid)
// BUT: Don't redirect during initial auth check (getCurrentUser on mount)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if:
    // 1. It's a 401 error
    // 2. It's NOT the initial /auth/me check (which AuthContext handles)
    // 3. User is not already on login/signup page
    const isAuthMeRequest = error.config?.url?.includes('/auth/me');
    const isOnAuthPage = window.location.pathname === '/login' || window.location.pathname === '/signup';
    
    if (error.response?.status === 401 && !isAuthMeRequest && !isOnAuthPage) {
      // Cookie expired or invalid - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// TypeScript interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
  role?: 'user' | 'admin'; // optional - defaults to 'user'
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  profilePicture?: string;
  createdAt?: string;
  phone?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}

export interface UserResponse {
  success: boolean;
  user: AuthUser;
}

// Auth API functions
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await api.get('/auth/me');
  return response.data;
};