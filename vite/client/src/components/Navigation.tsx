
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  PlusCircle, 
  FolderOpen, 
  Search, 
  User, 
  LogOut,
  ListTodo,
  Briefcase,
  CreditCard,
  Users,
  Settings,
  Languages,
  Menu,
  X,
  Bell,
  ChevronDown,
  DollarSign
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "@/store/auth";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

function SidebarLink({ href, icon: Icon, label, active }: SidebarLinkProps) {
  return (
    <Link
      to={href}
      className={cn(
        "group relative flex items-center gap-3 px-6 py-3 rounded-md transition-all duration-200",
        active 
          ? "bg-blue-600/10 text-white" 
          : "text-white/60 hover:bg-white/5 hover:text-white"
      )}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 w-1 h-7 bg-blue-600 rounded-r-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <Icon size={20} className={cn("transition-colors", active ? "text-white" : "text-white/60 group-hover:text-white")} />
      <span className="font-semibold text-sm">{label}</span>
    </Link>
  );
}

export function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const { pathname: pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = isAdmin ? [
    { href: "/admin/queue", icon: ListTodo, label: "Queue" },
    { href: "/admin/listings", icon: Briefcase, label: "Listings" },
    { href: "/admin/payments", icon: CreditCard, label: "Payments" },
    { href: "/admin/staff", icon: Users, label: "Staff" },
    { href: "/admin/config", icon: Settings, label: "System Config", mt: "mt-auto" },
    { href: "/admin/languages", icon: Languages, label: "i18n" },
  ] : [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/apply", icon: PlusCircle, label: "Apply New" },
    { href: "/documents", icon: FolderOpen, label: "My Documents" },
    { href: "/payment", icon: DollarSign, label: "Payments" },
    { href: "/opportunities", icon: Search, label: "Opportunities" },
    { href: "/profile", icon: User, label: "Profile", mt: "mt-auto" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#1a1a2e] flex flex-col py-6 px-4 z-40 border-r border-white/5">
      <div className="mb-10 px-4">
        <Link to="/" className="text-2xl font-bold text-white">
          Lotoks<span className="text-blue-500">.</span>
        </Link>
        {isAdmin && <div className="mt-2 px-2 py-0.5 rounded-full bg-blue-500/20 text-[8px] font-bold text-blue-400 uppercase tracking-widest inline-block">Admin Portal</div>}
      </div>
      
      <nav className="flex flex-col gap-1 flex-grow">
        {links.map((link) => (
          <div key={link.href} className={link.mt}>
            <SidebarLink 
              href={link.href} 
              icon={link.icon} 
              label={link.label} 
              active={pathname === link.href} 
            />
          </div>
        ))}
        <button onClick={handleLogout} className="mt-4 flex items-center gap-3 px-4 py-3 rounded-md text-outline-variant hover:bg-red-500/10 hover:text-red-400 transition-all duration-200">
          <LogOut size={20} />
          <span className="font-semibold text-sm">Logout</span>
        </button>
      </nav>
    </aside>
  );
}

export function MobileTabBar() {
  const { pathname: pathname } = useLocation();
  
  const tabs = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { href: "/apply", icon: PlusCircle, label: "Apply" },
    { href: "/documents", icon: FolderOpen, label: "Files" },
    { href: "/payment", icon: DollarSign, label: "Pay" },
    { href: "/opportunities", icon: Search, label: "Jobs" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass z-50 flex items-center justify-around px-4">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link key={tab.href} to={tab.href} className="flex flex-col items-center gap-1">
            <div className={cn("p-2 rounded-full transition-colors", active ? "text-primary bg-primary/10" : "text-outline-variant")}>
              <tab.icon size={20} />
            </div>
            <span className={cn("text-[10px] font-bold", active ? "text-primary" : "text-outline-variant")}>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname: pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/apply", icon: PlusCircle, label: "Apply New" },
    { href: "/documents", icon: FolderOpen, label: "My Documents" },
    { href: "/payment", icon: DollarSign, label: "Payments" },
    { href: "/opportunities", icon: Search, label: "Opportunities" },
  ];

  const adminLinks = [
    { href: "/admin/queue", icon: ListTodo, label: "Queue" },
    { href: "/admin/listings", icon: Briefcase, label: "Listings" },
    { href: "/admin/payments", icon: CreditCard, label: "Payments" },
    { href: "/admin/staff", icon: Users, label: "Staff" },
    { href: "/admin/config", icon: Settings, label: "System Config" },
    { href: "/admin/languages", icon: Languages, label: "i18n" },
  ];

  const links = pathname.startsWith("/admin") ? adminLinks : userLinks;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-white shadow-lg text-slate-700"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed top-0 left-0 h-full w-60 bg-[#1a1a2e] z-50 p-4"
            >
              <div className="flex justify-between items-center mb-8">
                <Link to="/" className="text-xl font-bold text-white">
                  Lotoks<span className="text-blue-500">.</span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-white/60"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {links.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200",
                        active 
                          ? "bg-blue-600/10 text-white" 
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {active && (
                        <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" />
                      )}
                      <link.icon size={18} className={active ? "text-white" : "text-white/60"} />
                      <span className="font-medium text-sm">{link.label}</span>
                    </Link>
                  );
                })}
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-md text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 mt-4">
                  <LogOut size={18} />
                  <span className="font-medium text-sm">Logout</span>
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function MobileAdminMenu() {
  return <MobileMenu />;
}
