import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Globe,
  List,
  CreditCard,
  Users,
  UserCog,
  Award,
  Settings,
  Languages,
  LogOut,
  Shield,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Admin {
  id: number;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
}

interface AdminMobileNavProps {
  admin: Admin | null;
  onLogout: () => void;
}

const roleIcons: Record<string, React.ElementType> = {
  super_admin: Shield,
  admin: Users,
};

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

function AdminMobileNav({ admin, onLogout }: AdminMobileNavProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  React.useEffect(() => { setOpen(false); }, [location.pathname]);

  if (!admin) return null;

  const isSuperAdmin = admin.role === 'super_admin';
  const RoleIcon = roleIcons[admin.role] || Shield;

  const navItems = [
    ...baseItems,
    ...(isSuperAdmin ? superAdminItems : []),
  ];

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <>
      {/* Top bar – mobile only */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-navy border-b border-white/10 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center">
            <span className="text-navy font-bold text-sm leading-none">L</span>
          </div>
          <span className="text-white font-heading font-bold text-sm">
            Lotoks<span className="text-gold">.</span>
          </span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="fixed top-0 left-0 h-full w-72 z-50 flex flex-col bg-navy border-r border-white/10 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                    <span className="text-navy font-bold leading-none">L</span>
                  </div>
                  <span className="text-white font-heading font-bold">
                    Lotoks<span className="text-gold">.</span>
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Admin info */}
              <div className="px-5 py-3 border-b border-white/10 space-y-2">
                <p className="text-white/90 text-sm font-medium truncate">{admin.name || admin.email}</p>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    isSuperAdmin
                      ? 'bg-gold/10 text-gold'
                      : 'bg-white/10 text-white/60'
                  }`}>
                    <RoleIcon size={10} />
                    {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </div>
                </div>
              </div>

              {/* Nav */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? 'bg-gold text-navy'
                          : 'text-white/60 hover:text-white hover:bg-white/8'
                      }`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="px-3 pb-6 border-t border-white/10 pt-3">
                <button
                  onClick={onLogout}
                  className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red/80 hover:text-red hover:bg-red/10 transition-all"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default AdminMobileNav;
