import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users, Search, ShieldCheck, ShieldOff, Loader2, AlertTriangle, UserX
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { EmptyState } from '@/components/shared/EmptyState';
import { toast } from '@/components/shared/Toast';

interface User {
  id: number;
  name: string;
  email: string;
  country: string;
  verified: boolean;
  createdAt: string;
}

export function AdminUsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');

  const { data, isLoading, error } = useQuery<User[]>({
    queryKey: ['adminUsers', verifiedFilter],
    queryFn: async () => {
      const p = new URLSearchParams();
      if (verifiedFilter) p.set('verified', verifiedFilter);
      const res = await apiFetch(`/admin/users?${p}`);
      if (!res.ok) throw new Error('Failed');
      const d = await res.json();
      return d.users ?? d;
    },
  });

  const toggleVerify = async (user: User) => {
    try {
      const res = await apiFetch(`/admin/users/${user.id}/verify`, {
        method: 'PUT',
        body: JSON.stringify({ verified: !user.verified }),
      });
      if (!res.ok) throw new Error();
      toast.success(user.verified ? 'User unverified.' : 'User verified!');
      qc.invalidateQueries({ queryKey: ['adminUsers'] });
    } catch {
      toast.error('Failed to update verification.');
    }
  };

  const filtered = (data ?? []).filter(
    (u) =>
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-white">User Management</h1>
        <p className="text-white/50 text-sm mt-1">View all registered users and manage verification.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <select
          value={verifiedFilter}
          onChange={(e) => setVerifiedFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold/50 appearance-none cursor-pointer"
        >
          <option value="" className="bg-navy">All Users</option>
          <option value="true" className="bg-navy">Verified</option>
          <option value="false" className="bg-navy">Unverified</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Users', value: data?.length ?? '—', color: 'text-white' },
          { label: 'Verified', value: data?.filter((u) => u.verified).length ?? '—', color: 'text-green-400' },
          { label: 'Unverified', value: data?.filter((u) => !u.verified).length ?? '—', color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/40 text-xs uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-heading font-bold mt-1 ${s.color}`}>{String(s.value)}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>
      ) : error ? (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red/10 border border-red/20 text-red/80">
          <AlertTriangle className="w-5 h-5" /><span className="text-sm">Failed to load users.</span>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<UserX className="w-10 h-10" />} title="No users found" message="No users match the current filters." />
      ) : (
        <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {['Name', 'Email', 'Country', 'Verified', 'Registered', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 text-white font-medium">{user.name}</td>
                    <td className="px-5 py-4 text-white/60">{user.email}</td>
                    <td className="px-5 py-4 text-white/60">{user.country}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${user.verified ? 'bg-green-500/15 text-green-400' : 'bg-amber-500/15 text-amber-400'}`}>
                        {user.verified ? <ShieldCheck className="w-3 h-3" /> : <ShieldOff className="w-3 h-3" />}
                        {user.verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/50 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleVerify(user)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                          user.verified
                            ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                            : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                        }`}
                      >
                        {user.verified ? 'Unverify' : 'Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
