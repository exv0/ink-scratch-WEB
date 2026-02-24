export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER:           `${API_BASE_URL}/api/auth/register`,
    LOGIN:              `${API_BASE_URL}/api/auth/login`,
    UPDATE_PROFILE:     `${API_BASE_URL}/api/auth/update-profile`,
    FORGOT_PASSWORD:    `${API_BASE_URL}/api/auth/forgot-password`,
    RESET_PASSWORD:     `${API_BASE_URL}/api/auth/reset-password`,
    VERIFY_RESET_TOKEN: `${API_BASE_URL}/api/auth/verify-reset-token`,
  },
  ADMIN: {
    USERS: `${API_BASE_URL}/api/admin/users`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/api/user/profile`,
  },
  MANGA: {
    BASE:    `${API_BASE_URL}/api/manga`,
    SEARCH:  `${API_BASE_URL}/api/manga/search`,
    IMPORT:  `${API_BASE_URL}/api/manga/import`,
    BY_ID:         (id: string)          => `${API_BASE_URL}/api/manga/${id}`,
    CHAPTERS:      (id: string)          => `${API_BASE_URL}/api/manga/${id}/chapters`,
    CHAPTER_PAGES: (chapterId: string)   => `${API_BASE_URL}/api/manga/chapters/${chapterId}`,
  },
};