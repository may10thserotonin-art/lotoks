import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCog, Plus, Loader2, AlertTriangle, Trash2, Mail, Shield } from 'lucide-react';
import { apiFetch, apiJson } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/shared/Modal';
import { EmptyState } from '@/components/shared/EmptyState';
import { toast } from '@/components/shared/Toast';

interface StaffMember {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-gold/15 text-gold border-gold/20',
  admin: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
};

export function AdminStaffPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState('admin');
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading, error } = useQuery<StaffMember[]>({
    queryKey: ['adminStaff'],
    queryFn: async () => {
      const res = await apiFetch('/admin/staff');
      if (!res.ok) throw new Error('Failed');
      const d = await apiJson(res);
      return d.staff ?? d;
    },
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiFetch('/admin/signup', {
        method: 'POST',
        body: JSON.stringify({ email: formEmail, password: formPassword, role: formRole }),
      });
      if (!res.ok) {
        const err = await apiJson(res);
        throw new Error(err.message || 'Failed to create admin');
      }
      toast.success('Admin account created!');
      qc.invalidateQueries({ queryKey: ['adminStaff'] });
      setModalOpen(false);
      setFormEmail(''); setFormPassword(''); setFormRole('admin');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create admin.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this staff member?')) return;
    try {
      const res = await apiFetch(`/admin/staff/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Staff member removed.');
      qc.invalidateQueries({ queryKey: ['adminStaff'] });
    } catch {
      toast.error('Failed to remove staff member.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-6 lg:p-8">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Staff Management</h1>
          <p className="text-white/50 text-sm mt-1">Create and manage admin accounts.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
          Add Admin
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>
      ) : error ? (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red/10 border border-red/20 text-red/80">
          <AlertTriangle className="w-5 h-5" /><span className="text-sm">Failed to load staff.</span>
        </div>
      ) : (data ?? []).length === 0 ? (
        <EmptyState icon={<UserCog className="w-10 h-10" />} title="No staff yet" message="Add admin accounts to get started." />
      ) : (
        <div className="grid gap-3">
          {(data ?? []).map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{member.name || member.email}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Mail className="w-3 h-3 text-white/30" />
                  <span className="text-white/50 text-xs truncate">{member.email}</span>
                </div>
              </div>
              <span className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-semibold capitalize ${ROLE_COLORS[member.role] ?? 'bg-white/10 text-white/50 border-white/10'}`}>
                {member.role.replace('_', ' ')}
              </span>
              <span className="text-white/30 text-xs hidden md:block">
                {new Date(member.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => handleDelete(member.id)}
                className="p-2 rounded-lg text-white/30 hover:text-red hover:bg-red/10 transition-colors flex-shrink-0"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Admin Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Admin">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Email</label>
            <input
              type="email"
              required
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="admin@lotoks.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 text-sm"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 text-sm"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Role</label>
            <select
              value={formRole}
              onChange={(e) => setFormRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-navy border border-white/10 text-white focus:outline-none focus:border-gold/50 text-sm appearance-none cursor-pointer"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" size="sm" className="flex-1 text-white/60" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="flex-1" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create Admin'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
