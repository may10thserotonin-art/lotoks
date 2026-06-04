import { create } from 'zustand';
import { apiFetch, apiJson } from '@/lib/api';

interface Admin {
  id: number;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
}

interface AdminAuthState {
  admin: Admin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  switchRole: (role: string) => Promise<void>;
  restoreRole: () => Promise<void>;
}

export const useAdminAuth = create<AdminAuthState>((set) => ({
  admin: null,
  isLoading: true,
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await apiFetch('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      interface LoginResponse { admin: Admin; message?: string }
      const data = await apiJson<LoginResponse>(res);
      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }
      set({ admin: data.admin, isLoading: false });
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
      const res = await apiFetch('/admin/me');
      if (res.ok) {
        interface MeResponse { admin: Admin }
        const data = await apiJson<MeResponse>(res);
        set({ admin: data.admin, isLoading: false });
      } else {
        set({ admin: null, isLoading: false });
      }
    } catch (error) {
      set({ admin: null, isLoading: false });
    }
  },
  switchRole: async (role: string) => {
    const res = await apiFetch('/admin/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    interface SwitchResponse { message: string; admin: Admin }
    const data = await apiJson<SwitchResponse>(res);
    if (res.ok) {
      set({ admin: data.admin });
    } else {
      throw new Error((data as any).message || 'Failed to switch role');
    }
  },
  restoreRole: async () => {
    const res = await apiFetch('/admin/restore-role', { method: 'POST' });
    interface RestoreResponse { message: string; admin: Admin }
    const data = await apiJson<RestoreResponse>(res);
    if (res.ok) {
      set({ admin: data.admin });
    } else {
      throw new Error((data as any).message || 'Failed to restore role');
    }
  },
}));

// Initialize auth on load
export async function initAdminAuth() {
  await useAdminAuth.getState().checkAuth();
}