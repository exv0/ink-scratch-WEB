// lib/cookies.ts
import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const cookieUtils = {
  // Set token with expiry (7 days for "remember me", session otherwise)
  setToken: (token: string, rememberMe: boolean = false) => {
    if (rememberMe) {
      Cookies.set(TOKEN_KEY, token, { expires: 7 }); // 7 days
    } else {
      Cookies.set(TOKEN_KEY, token); // Session cookie
    }
  },

  // Get token
  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
  },

  // Remove token
  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },

  // Set user data
  setUser: (user: unknown, rememberMe: boolean = false) => {
    const userJson = JSON.stringify(user);
    if (rememberMe) {
      Cookies.set(USER_KEY, userJson, { expires: 7 });
    } else {
      Cookies.set(USER_KEY, userJson);
    }
  },

  // Get user data
  getUser: (): unknown | null => {
    const userJson = Cookies.get(USER_KEY);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  },

  // Remove user data
  removeUser: () => {
    Cookies.remove(USER_KEY);
  },

  // Clear all auth data
  clearAuth: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!Cookies.get(TOKEN_KEY);
  },
};