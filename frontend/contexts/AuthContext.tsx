// contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authService } from '@/lib/services/auth.service';
import { cookieUtils } from '@/lib/cookies';

export type Theme = 'light' | 'dark' | 'system';

interface User {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  gender: string;
  role: string;
  profilePicture?: string;
  bio?: string;
  theme?: Theme;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  theme: Theme;
  resolvedTheme: 'light' | 'dark'; // always light or dark (never system)
  setTheme: (theme: Theme) => Promise<void>;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Helpers ──────────────────────────────────────────────────────────────────

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeToDom(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', resolved);
  }
  return resolved;
}

const LS_KEY = 'is-theme'; // localStorage key

// ─────────────────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  // ── Apply theme + update resolved ──────────────────────────────────────────
  const applyTheme = useCallback((t: Theme) => {
    const resolved = applyThemeToDom(t);
    setThemeState(t);
    setResolvedTheme(resolved);
    // Always persist to localStorage so layout.tsx script can read on next load
    try { localStorage.setItem(LS_KEY, t); } catch {}
  }, []);

  // ── Bootstrap auth + theme ─────────────────────────────────────────────────
  const refreshAuth = useCallback(() => {
    const storedToken = cookieUtils.getToken();
    const storedUser = cookieUtils.getUser() as User | null;

    setToken(storedToken || null);
    setUser(storedUser);

    // Priority: user's DB theme → localStorage fallback → system
    const dbTheme = storedUser?.theme as Theme | undefined;
    const lsTheme = (() => { try { return localStorage.getItem(LS_KEY) as Theme | null; } catch { return null; } })();
    const resolved = dbTheme || lsTheme || 'system';

    applyTheme(resolved);
  }, [applyTheme]);

  useEffect(() => {
    refreshAuth();
    setIsLoading(false);
  }, [refreshAuth]);

  // ── Listen to system preference changes when theme = 'system' ──────────────
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, applyTheme]);

  // ── Public setTheme — saves to DB if logged in ─────────────────────────────
  const setTheme = useCallback(async (newTheme: Theme) => {
    applyTheme(newTheme);

    // Update cookie-stored user so refreshAuth picks it up next time
    if (user) {
      const updatedUser = { ...user, theme: newTheme };
      cookieUtils.setUser(updatedUser, true);
      setUser(updatedUser);
    }

    // Persist to DB if authenticated
    if (token && user?._id) {
      try {
        const { userService } = await import('@/lib/services/user.service');
        await userService.updateTheme(user._id, newTheme, token);
      } catch (err) {
        console.error('Failed to save theme to DB:', err);
        // Non-fatal — localStorage already saved it
      }
    }
  }, [applyTheme, user, token]);

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    // Keep the theme preference after logout (use localStorage fallback)
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        isLoading,
        theme,
        resolvedTheme,
        setTheme,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}