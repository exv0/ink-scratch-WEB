// lib/config.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

console.log('🔥 API_URL loaded:', API_URL);

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/api/auth/login`,
    REGISTER: `${API_URL}/api/auth/register`,
  },
} as const;