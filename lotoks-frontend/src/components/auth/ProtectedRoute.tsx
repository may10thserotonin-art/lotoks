import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { useAdminAuth } from '@/store/adminAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowedRoles?: ('super_admin' | 'admin')[];
}

export function ProtectedRoute({ children, requireAdmin, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();

  // User auth
  const { user, isLoading: userLoading, isAuthenticated } = useAuthStore();
  // Admin auth
  const { admin, isLoading: adminLoading } = useAdminAuth();

  if (requireAdmin) {
    // Admin route protection
    if (adminLoading) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-navy z-50">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
            <p className="mt-4 text-white/60 text-sm">Loading admin panel…</p>
          </div>
        </div>
      );
    }

    if (!admin) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Check for specific role requirements
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(admin.role as any)) {
      return <Navigate to="/admin/queue" replace />;
    }

    return <>{children}</>;
  }

  // User route protection
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

  if (!isAuthenticated || !user) {
    const redirect = location.pathname + location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />;
  }

  return <>{children}</>;
}
