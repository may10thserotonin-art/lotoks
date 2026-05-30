import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Globe,
  List,
  CreditCard,
  Users,
  UserCog,
  Award,
  Settings,
  Languages,
  LogOut,
} from 'lucide-react';

interface Admin {
  id: number;
  email: string;
  name: string;
  role: 'super_admin' | 'reviewer' | 'finance' | 'recruiter';
}

interface AdminSidebarProps {
  admin: Admin;
  onLogout: () => void;
}

const baseItems = [
  { name: 'Queue', href: '/admin/queue', icon: List },
  { name: 'Listings', href: '/admin/listings', icon: Globe },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Requirements', href: '/admin/requirements', icon: Award },
];

const superAdminItems = [
  { name: 'Staff', href: '/admin/staff', icon: UserCog },
  { name: 'Config', href: '/admin/config', icon: Settings },
  { name: 'Languages', href: '/admin/languages', icon: Languages },
];

function AdminSidebar({ admin, onLogout }: AdminSidebarProps) {
  const location = useLocation();

  const navItems = [
    ...baseItems,
    ...(admin.role === 'super_admin' ? superAdminItems : []),
  ];

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-navy border-r border-white/10 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center">
          <span className="text-navy font-bold text-lg leading-none">L</span>
        </div>
        <div>
          <span className="text-white font-heading font-bold text-base">Lotoks</span>
          <span className="text-gold font-bold text-base">.</span>
          <p className="text-white/40 text-xs -mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Admin info */}
      <div className="px-5 py-4 border-b border-white/10">
        <p className="text-white/90 text-sm font-medium truncate">{admin.name || admin.email}</p>
        <p className="text-gold/70 text-xs mt-0.5 capitalize">{admin.role.replace('_', ' ')}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-gold text-navy shadow-md shadow-gold/20'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
              }`}
            >
              <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t border-white/10 pt-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red/80 hover:text-red hover:bg-red/10 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
