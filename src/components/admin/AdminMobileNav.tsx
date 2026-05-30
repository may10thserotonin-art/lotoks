import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp,
  Users,
  List,
  CreditCard,
  Sliders,
  Languages,
  Globe,
  Award,
  Settings,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminMobileNavProps {
  admin: {
    id: number;
    email: string;
    name: string;
    role: 'super_admin' | 'reviewer' | 'finance' | 'recruiter';
  } | null;
  onLogout: () => void;
}

export function AdminMobileNav({ admin, onLogout }: AdminMobileNavProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const sidebarItems = [
    { name: 'Queue', href: '/admin/queue', icon: List },
    { name: 'Listings', href: '/admin/listings', icon: Globe },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Users', href: '/admin/users', icon: Users },
    ...(admin && admin.role === 'super_admin' ? [
      { name: 'Staff', href: '/admin/staff', icon: Users },
      { name: 'Requirements', href: '/admin/requirements', icon: Award },
      { name: 'Config', href: '/admin/config', icon: Settings },
      { name: 'Languages', href: '/admin/languages', icon: Languages },
    ] : [
      { name: 'Requirements', href: '/admin/requirements', icon: Award },
    ]),
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-3 bg-white/5 hover:bg-white/10 text-navy"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ translateX: '-100%' }}
            animate={{ translateX: '0%' }}
            exit={{ translateX: '-100%' }}
            className="fixed top-0 left-0 h-full w-64 bg-white border-r border-white/20 z-50"
          >
            <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden">
                  <div className="w-full h-full bg-navy flex items-center justify-center text-white font-bold">
                    L
                  </div>
                </div>
                <span className="text-navy font-semibold text-lg hidden md:block">Lotoks Admin</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-2 rounded-lg text-navy hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="mt-4 space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex w-full items-center gap-3 px-4 py-3 text-navy/60 hover:bg-white/10 hover:text-navy/80 transition-colors
                    ${pathname === item.href ? 'bg-white/5 text-navy font-medium' : ''}
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto pb-6">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="whitespace-nowrap">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}