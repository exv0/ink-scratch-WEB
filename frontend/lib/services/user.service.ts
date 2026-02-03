// lib/services/user.service.ts
import { API_URL } from '../config';
import { cookieUtils } from '../cookies';

export interface UpdateProfileData {
  bio?: string;
  profileImage?: File;
}

export const userService = {
  // Update logged-in user's profile - PUT /api/auth/:id
  updateProfile: async (userId: string, data: UpdateProfileData) => {
    try {
      const formData = new FormData();
      
      if (data.bio !== undefined) formData.append('bio', data.bio);
      if (data.profileImage) formData.append('profileImage', data.profileImage);

      const token = cookieUtils.getToken();
      const response = await fetch(`${API_URL}/api/auth/${userId}`, {
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
};