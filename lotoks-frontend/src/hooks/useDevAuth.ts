
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

const DEV_SESSION_KEY = 'lotoks_dev_preview';

import type { User } from '@/store/auth';

const DEV_USER: User = {
  id: 0,
  name: 'Developer',
  email: 'dev@lotoks.com',
};

/** Call this on app startup to rehydrate dev auth from sessionStorage */
export function useDevAuthRestore() {
  const { setUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const isUnlocked = sessionStorage.getItem(DEV_SESSION_KEY) === '1';
      if (isUnlocked) setUser(DEV_USER);
    }
  }, [isAuthenticated, setUser]);
}

/** Grant dev access — stores to sessionStorage + logs into Zustand */
export function grantDevAccess() {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(DEV_SESSION_KEY, '1');
  }
  useAuthStore.getState().setUser(DEV_USER);
}

/** Revoke dev access */
export function revokeDevAccess() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(DEV_SESSION_KEY);
  }
  useAuthStore.getState().logout();
}

export const DEV_PIN = '091344';
