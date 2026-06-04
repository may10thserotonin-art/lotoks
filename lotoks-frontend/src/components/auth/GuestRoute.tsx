import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { useAdminAuth } from '@/store/adminAuth';
import { Loader2 } from 'lucide-react';

interface GuestRouteProps {
  children: React.ReactNode;
  /** If true, checks admin auth instead of user auth */
  adminOnly?: boolean;
}

/**
 * GuestRoute – redirects authenticated users away from login/signup pages.
 * For admin: redirects to /admin/queue
 * For user: redirects to /dashboard
 */
export function GuestRoute({ children, adminOnly }: GuestRouteProps) {
  const { user, isLoading: userLoading, isAuthenticated } = useAuthStore();
  const { admin, isLoading: adminLoading } = useAdminAuth();

  if (adminOnly) {
    if (adminLoading) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-navy z-50">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
            <p className="mt-4 text-white/60 text-sm">Loading…</p>
          </div>
        </div>
      );
    }
    if (admin) {
      return <Navigate to="/admin/queue" replace />;
    }
    return <>{children}</>;
  }

  // User guest route
  if (userLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-navy z-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
          <p className="mt-4 text-white/60 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
