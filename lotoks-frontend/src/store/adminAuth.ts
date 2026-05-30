import { create } from 'zustand';

interface Admin {
  id: number;
  email: string;
  name: string;
  role: 'super_admin' | 'reviewer' | 'finance' | 'recruiter';
}

interface AdminAuthState {
  admin: Admin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAdminAuth = create<AdminAuthState>((set, get) => ({
  admin: null,
  isLoading: true,
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        set({ admin: data.admin, isLoading: false });
      } else {
        let msg = 'Invalid credentials';
        try {
          const errData = await res.json();
          if (errData && errData.message) msg = errData.message;
        } catch (_) {}
        throw new Error(msg);
      }
    } catch (error) {
      set({ admin: null, isLoading: false });
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      // Ignore error
    }
    set({ admin: null, isLoading: false });
  },
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/admin/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        set({ admin: data.admin, isLoading: false });
      } else {
        set({ admin: null, isLoading: false });
      }
    } catch (error) {
      set({ admin: null, isLoading: false });
    }
  }
}));

// Initialize auth on load
export async function initAdminAuth() {
  await useAdminAuth.getState().checkAuth();
}