import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  User,
  FileText,
  Search,
  PlusCircle,
  LogOut,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Sidebar, MobileTabBar, MobileMenu } from '@/components/Navigation';
import { apiFetch, apiJson } from '@/lib/api';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, logout } = useAuthStore();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await apiFetch('/user/stats');
      return apiJson<{
        applications: number;
        documents: number;
        opportunities: number;
        recentApplication: { id: number; sponsorship_type: string; status: string; created_at: string } | null;
      }>(res);
    },
    enabled: isAuthenticated,
    staleTime: 30_000,
  });

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-white/60 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Menu Toggle */}
      <MobileMenu />

      {/* Main Content */}
      <div className="lg:ml-60 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-navy/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-xl font-heading font-bold text-white">
                Dashboard
              </h1>
              <p className="text-xs text-white/40">
                Welcome back, {user?.name || 'User'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <Bell className="w-5 h-5 text-white/60" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full" />
              </button>
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 max-w-5xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {/* Welcome Banner */}
            <motion.div variants={item}>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-gold/20 to-navy border border-gold/20">
                <h2 className="text-2xl font-heading font-bold text-white mb-2">
                  Welcome to Lotoks
                </h2>
                <p className="text-white/70 text-sm max-w-lg">
                  Your gateway to global opportunities. Track your applications,
                  upload documents, and manage your journey all in one place.
                </p>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={item}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-sm text-white/40 font-medium">Applications</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats?.applications ?? '—'}</p>
                  <p className="text-xs text-white/40 mt-1">Active applications</p>
                </div>

                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-teal-500/20">
                      <CheckCircle2 className="w-5 h-5 text-teal-400" />
                    </div>
                    <span className="text-sm text-white/40 font-medium">Documents</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats?.documents ?? '—'}</p>
                  <p className="text-xs text-white/40 mt-1">Uploaded documents</p>
                </div>

                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gold/20">
                      <Search className="w-5 h-5 text-gold" />
                    </div>
                    <span className="text-sm text-white/40 font-medium">Opportunities</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats?.opportunities ?? '—'}</p>
                  <p className="text-xs text-white/40 mt-1">Available listings</p>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={item}>
              <h3 className="text-lg font-heading font-bold text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Link
                  to="/apply"
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-white/10 transition-all group"
                >
                  <PlusCircle className="w-8 h-8 text-gold mb-3" />
                  <p className="text-white font-semibold text-sm mb-1">New Application</p>
                  <p className="text-white/40 text-xs">Start a new visa or job application</p>
                </Link>

                <Link
                  to="/documents"
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-white/10 transition-all group"
                >
                  <FileText className="w-8 h-8 text-blue-400 mb-3" />
                  <p className="text-white font-semibold text-sm mb-1">My Documents</p>
                  <p className="text-white/40 text-xs">Upload and manage your documents</p>
                </Link>

                <Link
                  to="/opportunities"
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-white/10 transition-all group"
                >
                  <Search className="w-8 h-8 text-purple-400 mb-3" />
                  <p className="text-white font-semibold text-sm mb-1">Opportunities</p>
                  <p className="text-white/40 text-xs">Browse job and visa listings</p>
                </Link>
              </div>
            </motion.div>

            {/* Account Info */}
            <motion.div variants={item}>
              <h3 className="text-lg font-heading font-bold text-white mb-4">
                Account Information
              </h3>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-gold/20">
                    <User className="w-6 h-6 text-gold" />
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Name</p>
                        <p className="text-white font-medium">{user?.name || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Email</p>
                        <p className="text-white font-medium">{user?.email || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Country</p>
                        <p className="text-white font-medium">{user?.country || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Member Since</p>
                        <p className="text-white font-medium">
                          {user?.created_at
                            ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                            : 'Today'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={item}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-heading font-bold text-white">
                  Recent Activity
                </h3>
                {stats?.recentApplication && (
                  <Link
                    to="/apply"
                    className="text-xs text-gold hover:underline font-medium inline-flex items-center gap-1"
                  >
                    View All <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
              {stats?.recentApplication ? (
                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold capitalize">
                        {stats.recentApplication.sponsorship_type.replace('_', ' ')} Application
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        {new Date(stats.recentApplication.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      stats.recentApplication.status === 'submitted'
                        ? 'bg-blue-500/10 text-blue-400'
                        : stats.recentApplication.status === 'approved'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {stats.recentApplication.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center">
                  <AlertCircle className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">No recent activity</p>
                  <p className="text-white/20 text-xs mt-1">
                    Start by submitting your first application
                  </p>
                  <Link
                    to="/apply"
                    className="inline-block mt-4 px-6 py-2.5 rounded-full bg-gold text-navy font-bold text-sm hover:bg-gold/90 transition-colors"
                  >
                    Apply Now
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <MobileTabBar />
    </div>
  );
}
