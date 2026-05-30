import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Inbox, FileText, Download, CheckCircle2, XCircle, MessageSquare,
  ChevronDown, Search, Loader2, AlertTriangle, User, Mail, Globe,
  Calendar, Clock
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SlidePanel } from '@/components/shared/SlidePanel';
import { EmptyState } from '@/components/shared/EmptyState';
import { toast } from '@/components/shared/Toast';

interface Application {
  id: number;
  applicantName: string;
  email: string;
  country: string;
  serviceTypes: string[];
  status: string;
  submittedAt: string;
  documents?: { name: string; url: string }[];
  note?: string;
}

const SERVICE_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'Visa Sponsorship', value: 'visa' },
  { label: 'Education', value: 'education' },
  { label: 'Job Placement', value: 'job' },
  { label: 'Permanent Residence', value: 'residence' },
];

const STATUSES = [
  { label: 'All Statuses', value: '' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'More Info', value: 'more_info' },
];

const STATUS_TIMELINE = ['submitted', 'under_review', 'approved'];

export function AdminQueuePage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selected, setSelected] = useState<Application | null>(null);
  const [actionNote, setActionNote] = useState('');
  const [actioning, setActioning] = useState(false);

  const { data, isLoading, error } = useQuery<Application[]>({
    queryKey: ['adminQueue', statusFilter, typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (typeFilter) params.set('serviceType', typeFilter);
      const res = await apiFetch(`/admin/queue?${params}`);
      if (!res.ok) throw new Error('Failed to fetch queue');
      const data = await res.json();
      return data.applications ?? data;
    },
  });

  const filtered = (data ?? []).filter(
    (a) =>
      !search ||
      a.applicantName?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase())
  );

  const doAction = async (action: 'approve' | 'reject' | 'request_info') => {
    if (!selected) return;
    setActioning(true);
    try {
      const res = await apiFetch(`/admin/queue/${selected.id}`, {
        method: 'PUT',
        body: JSON.stringify({ action, note: actionNote }),
      });
      if (!res.ok) throw new Error('Action failed');
      toast.success(
        action === 'approve'
          ? 'Application approved!'
          : action === 'reject'
          ? 'Application rejected.'
          : 'More info requested.'
      );
      qc.invalidateQueries({ queryKey: ['adminQueue'] });
      setSelected(null);
      setActionNote('');
    } catch {
      toast.error('Action failed. Please try again.');
    } finally {
      setActioning(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-8 min-h-full"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-white">Application Queue</h1>
        <p className="text-white/50 text-sm mt-1">Review and action incoming sponsorship applications.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applicant…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value} className="bg-navy">{s.label}</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer"
        >
          {SERVICE_TYPES.map((s) => (
            <option key={s.value} value={s.value} className="bg-navy">{s.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red/10 border border-red/20 text-red/80">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm">Failed to load queue. Check your connection.</span>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox className="w-10 h-10" />}
          title="No applications"
          message="No applications match the current filters."
        />
      ) : (
        <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {['Applicant', 'Country', 'Service Type(s)', 'Status', 'Submitted', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => { setSelected(app); setActionNote(''); }}
                  >
                    <td className="px-5 py-4">
                      <div className="text-white font-medium">{app.applicantName}</div>
                      <div className="text-white/40 text-xs">{app.email}</div>
                    </td>
                    <td className="px-5 py-4 text-white/70">{app.country}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(app.serviceTypes ?? []).map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-md bg-white/10 text-white/60 text-xs capitalize">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-5 py-4 text-white/50 text-xs">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(app); setActionNote(''); }}
                        className="text-gold/70 hover:text-gold text-xs font-medium transition-colors"
                      >
                        Review →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Side panel */}
      <SlidePanel
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Application Details"
        width="w-full max-w-xl"
      >
        {selected && (
          <div className="space-y-6">
            {/* Applicant info */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-white/80">
                <User className="w-4 h-4 text-gold" />
                <span className="font-semibold">{selected.applicantName}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Mail className="w-3.5 h-3.5" />
                <span>{selected.email}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Globe className="w-3.5 h-3.5" />
                <span>{selected.country}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Calendar className="w-3.5 h-3.5" />
                <span>Submitted {new Date(selected.submittedAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Services */}
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Requested Services</p>
              <div className="flex flex-wrap gap-2">
                {(selected.serviceTypes ?? []).map((t) => (
                  <span key={t} className="px-3 py-1 rounded-lg bg-gold/10 text-gold text-sm capitalize border border-gold/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Status timeline */}
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Status Timeline</p>
              <div className="flex items-center gap-0">
                {STATUS_TIMELINE.map((s, i) => {
                  const steps = ['submitted', 'under_review', 'approved'];
                  const currentIdx = steps.indexOf(selected.status);
                  const done = i <= currentIdx;
                  return (
                    <React.Fragment key={s}>
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${done ? 'bg-gold border-gold text-navy' : 'border-white/20 text-white/30'}`}>
                          {i + 1}
                        </div>
                        <span className={`text-xs mt-1 capitalize ${done ? 'text-gold' : 'text-white/30'}`}>
                          {s.replace('_', ' ')}
                        </span>
                      </div>
                      {i < STATUS_TIMELINE.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 -mt-4 ${done && i < currentIdx ? 'bg-gold' : 'bg-white/10'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Documents */}
            {(selected.documents ?? []).length > 0 && (
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Documents</p>
                <div className="space-y-2">
                  {selected.documents!.map((doc) => (
                    <a
                      key={doc.name}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-colors text-white/70 hover:text-white text-sm"
                    >
                      <FileText className="w-4 h-4 text-gold flex-shrink-0" />
                      <span className="flex-1 truncate">{doc.name}</span>
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Note */}
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                Note (optional)
              </label>
              <textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                rows={3}
                placeholder="Add a note to the applicant…"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold/50 resize-none transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="primary"
                size="sm"
                disabled={actioning}
                onClick={() => doAction('approve')}
                className="flex-1 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={actioning}
                onClick={() => doAction('request_info')}
                className="flex-1 flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                More Info
              </Button>
              <button
                disabled={actioning}
                onClick={() => doAction('reject')}
                className="flex-1 px-4 py-2 rounded-lg border-2 border-red/40 text-red/80 hover:bg-red/10 hover:text-red transition-all text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        )}
      </SlidePanel>
    </motion.div>
  );
}
