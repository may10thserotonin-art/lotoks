import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Admin {
  id: number;
  email: string;
  name: string;
  role: 'super_admin' | 'reviewer' | 'finance' | 'recruiter';
}

interface AuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAdmin: (admin: Admin) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      isLoading: true,
      setAdmin: (admin) => set({ admin, isAuthenticated: true, isLoading: false }),
      logout: () => {
        fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
        set({ admin: null, isAuthenticated: false, isLoading: false });
      },
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'lotoks-auth',
      partialize: (state) => ({ admin: state.admin, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Initialize auth on load
export async function initAuth() {
  try {
    const res = await fetch('/api/auth/me');
    if (res.ok) {
      const data = await res.json();
      useAuthStore.getState().setAdmin(data.admin);
    } else {
      useAuthStore.getState().setLoading(false);
    }
  } catch {
    useAuthStore.getState().setLoading(false);
  }
}
