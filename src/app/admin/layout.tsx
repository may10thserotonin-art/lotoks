"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Sidebar, MobileAdminMenu } from "@/components/Navigation";

const publicAdminPaths = ['/admin/login', '/admin/signup'];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;
    const isPublicPage = publicAdminPaths.some(p => pathname.startsWith(p));
    if (!isAuthenticated && !isPublicPage) {
      router.push('/admin/login');
    }
    if (isAuthenticated && isPublicPage) {
      router.push('/admin/queue');
    }
  }, [isAuthenticated, isLoading, pathname, router, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const isPublicPage = publicAdminPaths.some(p => pathname.startsWith(p));

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="hidden md:block">
        <Sidebar isAdmin={true} />
      </div>
      <MobileAdminMenu />
      <main className="md:pl-64 min-h-screen">
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
