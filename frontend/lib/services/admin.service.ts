// lib/services/admin.service.ts
import { API_URL } from '../config';
import { cookieUtils } from '../cookies';

export interface CreateUserData {
  fullName: string;
  phoneNumber: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'admin';
  profileImage?: File;
}

export interface UpdateUserData {
  fullName?: string;
  phoneNumber?: string;
  gender?: 'male' | 'female' | 'other';
  email?: string;
  username?: string;
  bio?: string;
  role?: 'user' | 'admin';
  profileImage?: File;
}

class AdminService {
  private getAuthHeaders(): HeadersInit {
    const token = cookieUtils.getToken();
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async getAllUsers() {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: 'GET',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch users');
      }

      return result;
    } catch (error: unknown) {
      throw new Error((error as Error).message || 'Network error occurred');
    }
  }

  async getUserById(userId: string) {
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'GET',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch user');
      }

      return result;
    } catch (error: unknown) {
      throw new Error((error as Error).message || 'Network error occurred');
    }
  }

  async createUser(data: CreateUserData) {
    try {
      const formData = new FormData();
      
      formData.append('fullName', data.fullName);
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('gender', data.gender);
      formData.append('email', data.email);
      formData.append('username', data.username);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);
      formData.append('role', data.role);
      
      if (data.profileImage) {
        formData.append('profileImage', data.profileImage);
      }

      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create user');
      }

      return result;
    } catch (error: unknown) {
      throw new Error((error as Error).message || 'Network error occurred');
    }
  }

  async updateUser(userId: string, data: UpdateUserData) {
    try {
      const formData = new FormData();
      
      if (data.fullName) formData.append('fullName', data.fullName);
      if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
      if (data.gender) formData.append('gender', data.gender);
      if (data.email) formData.append('email', data.email);
      if (data.username) formData.append('username', data.username);
      if (data.bio !== undefined) formData.append('bio', data.bio);
      if (data.role) formData.append('role', data.role);
      if (data.profileImage) formData.append('profileImage', data.profileImage);

      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update user');
      }

      return result;
    } catch (error: unknown) {
      throw new Error((error as Error).message || 'Network error occurred');
    }
  }

  async deleteUser(userId: string) {
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete user');
      }

      return result;
    } catch (error: unknown) {
      throw new Error((error as Error).message || 'Network error occurred');
    }
  }
}

export const adminService = new AdminService();