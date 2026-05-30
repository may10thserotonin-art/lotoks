

import React from "react";
import { Sidebar, MobileAdminMenu } from "@/components/Navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      {/* Desktop Sidebar (Admin) */}
      <div className="hidden md:block">
        <Sidebar isAdmin={true} />
      </div>
      
      {/* Mobile Admin Menu */}
      <MobileAdminMenu />
      
      {/* Main Content Area */}
      <main className="md:pl-64 min-h-screen">
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
