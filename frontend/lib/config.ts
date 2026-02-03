// lib/config.ts - UPDATED VERSION
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

console.log('🔥 API_URL loaded:', API_URL);

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/api/auth/login`,
    REGISTER: `${API_URL}/api/auth/register`,
    UPDATE_PROFILE: `${API_URL}/api/auth/update-profile`,
    UPDATE_BY_ID: (id: string) => `${API_URL}/api/auth/${id}`,
  },
  ADMIN: {
    USERS: `${API_URL}/api/admin/users`,
    USER_BY_ID: (id: string) => `${API_URL}/api/admin/users/${id}`,
  },
} as const;