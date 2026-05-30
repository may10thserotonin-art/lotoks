"use client";

import React from "react";
import { Sidebar, MobileTabBar, MobileMenu } from "@/components/Navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar - fixed 240px (w-60 = 240px) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Mobile Menu - hamburger */}
      <MobileMenu />
      
      {/* Main Content Area - responsive grid */}
      <main className="lg:pl-60 min-h-screen pb-20 lg:pb-0">
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Tab Bar */}
      <MobileTabBar />
    </div>
  );
}
