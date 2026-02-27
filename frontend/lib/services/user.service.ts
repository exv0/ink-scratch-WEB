// lib/services/user.service.ts
import { API_ENDPOINTS } from '../config';
import { cookieUtils } from '../cookies';
import type { Theme } from '@/contexts/AuthContext';

export interface UpdateProfileData {
  bio?: string;
  profileImage?: File;
}

export const userService = {
  // Update logged-in user's profile
  updateProfile: async (userId: string, data: UpdateProfileData) => {
    try {
      const formData = new FormData();

      if (data.bio !== undefined) formData.append('bio', data.bio);
      if (data.profileImage) formData.append('profileImage', data.profileImage);

      const token = cookieUtils.getToken();
      const response = await fetch(`${API_ENDPOINTS.AUTH.UPDATE_PROFILE.replace('/update-profile', '')}/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile');
      }

      return result;
    } catch (error: unknown) {
      throw new Error((error as Error).message || 'Network error occurred');
    }
  },

  // ✅ Save theme preference to user's account in DB
  updateTheme: async (userId: string, theme: Theme, token: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH.UPDATE_PROFILE.replace('/update-profile', '')}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ theme }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to update theme');
      }

      return await response.json();
    } catch (error: unknown) {
      throw new Error((error as Error).message || 'Network error occurred');
    }
  },
};