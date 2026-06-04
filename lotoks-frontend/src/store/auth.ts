import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch, apiJson } from '@/lib/api';

export interface User {
  id: number;
  name: string;
  email: string;
  country?: string;
  created_at?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const res = await apiFetch('/auth/user/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });
          const data = await apiJson<{ user: { id: number; name: string; email: string; country?: string }; message?: string }>(res);
          if (res.ok) {
            set({ user: data.user, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error(data.message || 'Invalid credentials');
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          throw error;
        }
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const res = await apiFetch('/auth/user/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
          });
          const data = await apiJson<{ user: { id: number; name: string; email: string }; message?: string }>(res);
          if (res.ok) {
            set({ user: data.user, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error(data.message || 'Failed to create account');
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        fetch('/api/auth/user/logout', { method: 'POST' }).catch(() => {});
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const res = await apiFetch('/auth/user/me');
          if (res.ok) {
            const data = await apiJson<{ user: { id: number; name: string; email: string; country?: string } }>(res);
            set({ user: data.user, isAuthenticated: true, isLoading: false });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      setUser: (user: User) => set({ user, isAuthenticated: true, isLoading: false }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'lotoks-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize auth on load
export async function initAuth() {
  await useAuthStore.getState().checkAuth();
}
