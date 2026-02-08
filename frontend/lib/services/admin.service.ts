// lib/services/admin.service.ts
import { API_ENDPOINTS } from '../config';
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

export interface PaginatedUsersResponse {
  success: boolean;
  message: string;
  data: unknown[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
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
      const response = await fetch(API_ENDPOINTS.ADMIN.USERS, {
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

  /**
   * ✅ NEW: Get users with pagination
   */
  async getUsersPaginated(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedUsersResponse> {
    const token = cookieUtils.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Build query string
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = `${API_ENDPOINTS.ADMIN.USERS}/paginated${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch users');
    }

    return result;
  }

  async getUserById(userId: string) {
    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`, {
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

      const response = await fetch(API_ENDPOINTS.ADMIN.USERS, {
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

      const response = await fetch(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`, {
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
      const response = await fetch(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`, {
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