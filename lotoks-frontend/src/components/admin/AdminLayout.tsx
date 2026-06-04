import React from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/store/adminAuth';
import AdminSidebar from './AdminSidebar';
import AdminMobileNav from './AdminMobileNav';
import { motion } from 'framer-motion';

export function AdminLayout() {
  const { admin, isLoading, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await (logout as () => Promise<void>)();
    navigate('/admin/login', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-navy z-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-white/60 text-sm">Loading admin panel…</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex bg-navy">
      {/* Desktop sidebar */}
      <AdminSidebar admin={admin} onLogout={handleLogout} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <AdminMobileNav admin={admin} onLogout={handleLogout} />

        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-y-auto"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}

export default AdminLayout;
