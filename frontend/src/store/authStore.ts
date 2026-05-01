import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '@/types';

interface AuthState {
  token: string | null;
  user: {
    email: string;
    fullName: string;
    role: UserRole;
    departmentId?: number;
  } | null;
  pendingEmail: string | null; // For 2FA flow
  isAuthenticated: boolean;
  login: (token: string, email: string, fullName: string, role: UserRole, departmentId?: number) => void;
  setPendingEmail: (email: string) => void;
  logout: () => void;
}

const TOKEN_COOKIE = 'planify-token';
const COOKIE_MAX_AGE = 86400; // 24 hours, matches JWT_EXPIRATION

const setTokenCookie = (token: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Strict`;
  }
};

const clearTokenCookie = () => {
  if (typeof document !== 'undefined') {
    document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Strict`;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      pendingEmail: null,
      isAuthenticated: false,
      login: (token, email, fullName, role, departmentId) => {
        setTokenCookie(token);
        set({
          token,
          user: { email, fullName, role, departmentId },
          isAuthenticated: true,
          pendingEmail: null,
        });
      },
      setPendingEmail: (email) => set({ pendingEmail: email }),
      logout: () => {
        clearTokenCookie();
        set({ token: null, user: null, isAuthenticated: false, pendingEmail: null });
      },
    }),
    {
      name: 'planify-auth',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
