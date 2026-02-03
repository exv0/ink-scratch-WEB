// lib/services/auth.service.ts
import { API_ENDPOINTS } from '../config';
import { cookieUtils } from '../cookies';

// Types matching your backend response
interface AuthResponse {
  success: boolean;
  message: string;
  data: unknown;
  token: string;
}

// Register data type matching backend DTO
export interface RegisterData {
  fullName: string;
  phoneNumber: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

// Login data type
export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  // Register user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server is not responding. Please make sure the backend is running.');
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      return result;
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Please check if backend is running.');
      }
      throw new Error(err.message || 'Network error occurred');
    }
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server is not responding. Please make sure the backend is running.');
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      return result;
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Please check if backend is running.');
      }
      throw new Error(err.message || 'Network error occurred');
    }
  },

  // Logout user
  logout: () => {
    cookieUtils.clearAuth();
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    return cookieUtils.isAuthenticated();
  },

  // Get current user
  getCurrentUser: () => {
    return cookieUtils.getUser();
  },

  // Get auth token
  getToken: (): string | undefined => {
    return cookieUtils.getToken();
  },
};