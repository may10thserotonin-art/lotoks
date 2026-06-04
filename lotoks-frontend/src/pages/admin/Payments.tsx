import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  CreditCard, TrendingUp, DollarSign, Download, Loader2,
  AlertTriangle, Search, RefreshCw
} from 'lucide-react';
import { apiFetch, apiJson } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';

interface Payment {
  id: string;
  transactionId: string;
  applicantName: string;
  amount: number;
  currency: string;
  gateway: string;
  status: string;
  createdAt: string;
}

interface PaymentSummary {
  todayRevenue: number;
  monthRevenue: number;
  totalTransactions: number;
  byGateway: Record<string, number>;
}

const GATEWAYS = ['', 'stripe', 'paypal', 'flutterwave'];
const STATUSES = ['', 'success', 'pending', 'failed', 'refunded'];

function StatCard({ label, value, icon: Icon, accent = false }: { label: string; value: string; icon: React.ElementType; accent?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-2xl border flex items-start gap-4 ${accent ? 'bg-gold/10 border-gold/20' : 'bg-white/5 border-white/10'}`}
    >
      <div className={`p-2.5 rounded-xl ${accent ? 'bg-gold/20' : 'bg-white/10'}`}>
        <Icon className={`w-5 h-5 ${accent ? 'text-gold' : 'text-white/60'}`} />
      </div>
      <div>
        <p className="text-white/50 text-xs uppercase tracking-wider">{label}</p>
        <p className={`text-2xl font-heading font-bold mt-0.5 ${accent ? 'text-gold' : 'text-white'}`}>{value}</p>
      </div>
    </motion.div>
  );
}

export function AdminPaymentsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [gateway, setGateway] = useState('');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [exporting, setExporting] = useState(false);

  const { data, isLoading, error, refetch } = useQuery<{ payments: Payment[]; summary: PaymentSummary }>({
    queryKey: ['adminPayments', gateway, status, dateFrom, dateTo],
    queryFn: async () => {
      const p = new URLSearchParams();
      if (gateway) p.set('gateway', gateway);
      if (status) p.set('status', status);
      if (dateFrom) p.set('from', dateFrom);
      if (dateTo) p.set('to', dateTo);
      const res = await apiFetch(`/admin/payments?${p}`);
      if (!res.ok) throw new Error('Failed to load');
      return apiJson(res);
    },
  });

  const payments = data?.payments ?? [];
  const summary = data?.summary;

  const filtered = payments.filter(
    (p) =>
      !search ||
      p.applicantName?.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId?.includes(search)
  );

  const handleExport = async () => {
    setExporting(true);
    try {
      const p = new URLSearchParams();
      if (gateway) p.set('gateway', gateway);
      if (status) p.set('status', status);
      if (dateFrom) p.set('from', dateFrom);
      if (dateTo) p.set('to', dateTo);
      const res = await apiFetch(`/admin/payments/export?${p}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Export failed.');
    } finally {
      setExporting(false);
    }
  };

  const fmt = (n: number) => `$${(n ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Payment Reports</h1>
          <p className="text-white/50 text-sm mt-1">Track revenue, transactions, and export data.</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExport}
          disabled={exporting}
          icon={<Download className="w-4 h-4" />}
        >
          {exporting ? 'Exporting…' : 'Export CSV'}
        </Button>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Today's Revenue" value={fmt(summary.todayRevenue)} icon={TrendingUp} accent />
          <StatCard label="This Month" value={fmt(summary.monthRevenue)} icon={DollarSign} />
          <StatCard label="Total Transactions" value={String(summary.totalTransactions)} icon={CreditCard} />
          {Object.entries(summary.byGateway ?? {}).slice(0, 1).map(([gw, amt]) => (
            <StatCard key={gw} label={`${gw} Revenue`} value={fmt(amt as number)} icon={CreditCard} />
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transaction / name…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>

        {[
          { value: gateway, set: setGateway, options: GATEWAYS, placeholder: 'All Gateways' },
          { value: status, set: setStatus, options: STATUSES, placeholder: 'All Statuses' },
        ].map((f, i) => (
          <select
            key={i}
            value={f.value}
            onChange={(e) => f.set(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold/50 appearance-none cursor-pointer"
          >
            <option value="" className="bg-navy">{f.placeholder}</option>
            {f.options.filter(Boolean).map((o) => (
              <option key={o} value={o} className="bg-navy capitalize">{o}</option>
            ))}
          </select>
        ))}

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold/50"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold/50"
        />

        <button
          onClick={() => refetch()}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-gold/30 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>
      ) : error ? (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red/10 border border-red/20 text-red/80">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm">Failed to load payments.</span>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<CreditCard className="w-10 h-10" />} title="No payments found" message="Try adjusting your filters." />
      ) : (
        <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {['Transaction ID', 'Applicant', 'Amount', 'Gateway', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 font-mono text-white/60 text-xs">{p.transactionId}</td>
                    <td className="px-5 py-4 text-white">{p.applicantName}</td>
                    <td className="px-5 py-4 text-gold font-semibold">{fmt(p.amount)}</td>
                    <td className="px-5 py-4 text-white/60 capitalize">{p.gateway}</td>
                    <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-4 text-white/50 text-xs">{new Date(p.createdAt).toLocaleString()}</td>
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
