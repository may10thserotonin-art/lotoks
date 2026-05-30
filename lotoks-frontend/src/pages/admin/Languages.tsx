import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Languages, Save, Search, Loader2, AlertTriangle } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/shared/Toast';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
  { code: 'ar', label: 'Arabic' },
  { code: 'yo', label: 'Yoruba' },
  { code: 'sw', label: 'Swahili' },
];

type Translations = Record<string, Record<string, string>>;

function flattenObj(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null) {
      Object.assign(result, flattenObj(v as Record<string, unknown>, key));
    } else {
      result[key] = String(v);
    }
  }
  return result;
}

export function AdminLanguagesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [activeLang, setActiveLang] = useState('fr');
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const { data, isLoading, error } = useQuery<Translations>({
    queryKey: ['adminLanguages'],
    queryFn: async () => {
      try {
        const res = await apiFetch('/admin/languages');
        if (res.ok) return res.json();
      } catch { /* fall through to static */ }
      // Fallback: load locale files from public folder
      const langs: Translations = {};
      for (const l of LANGS) {
        try {
          const r = await fetch(`/locales/${l.code}.json`);
          if (r.ok) langs[l.code] = flattenObj(await r.json());
        } catch { langs[l.code] = {}; }
      }
      return langs;
    },
  });

  const enKeys = Object.keys(data?.en ?? {});
  const filteredKeys = enKeys.filter(
    (k) => !search || k.toLowerCase().includes(search.toLowerCase()) || (data?.en?.[k] ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const getValue = (key: string) =>
    edits[key] !== undefined ? edits[key] : (data?.[activeLang]?.[key] ?? '');

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiFetch('/admin/languages', {
        method: 'PUT',
        body: JSON.stringify({ lang: activeLang, translations: edits }),
      });
      if (!res.ok) throw new Error();
      toast.success(`${LANGS.find((l) => l.code === activeLang)?.label} translations saved!`);
      setEdits({});
      qc.invalidateQueries({ queryKey: ['adminLanguages'] });
    } catch {
      toast.error('Failed to save translations. Check backend connection.');
    } finally {
      setSaving(false);
    }
  };

  const pendingCount = Object.keys(edits).length;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-6 lg:p-8">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Language Manager</h1>
          <p className="text-white/50 text-sm mt-1">Edit translation strings for each supported language.</p>
        </div>
        {pendingCount > 0 && (
          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving} icon={<Save className="w-4 h-4" />}>
            {saving ? 'Saving…' : `Save ${pendingCount} change${pendingCount > 1 ? 's' : ''}`}
          </Button>
        )}
      </div>

      {/* Language tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {LANGS.slice(1).map((l) => (
          <button
            key={l.code}
            onClick={() => { setActiveLang(l.code); setEdits({}); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeLang === l.code
                ? 'bg-gold text-navy shadow-md'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search keys…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>
      ) : error ? (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red/10 border border-red/20 text-red/80">
          <AlertTriangle className="w-5 h-5" /><span className="text-sm">Failed to load translations.</span>
        </div>
      ) : (
        <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-0 border-b border-white/10 bg-white/5 px-5 py-3.5">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Key</span>
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">English (source)</span>
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider capitalize">
              {LANGS.find((l) => l.code === activeLang)?.label}
            </span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5 max-h-[60vh] overflow-y-auto">
            {filteredKeys.map((key) => (
              <div key={key} className="grid grid-cols-[1fr_1fr_1fr] gap-0 px-5 py-3 hover:bg-white/5 group">
                <div className="pr-4 flex items-center">
                  <span className="text-white/40 text-xs font-mono break-all">{key}</span>
                </div>
                <div className="pr-4 flex items-center">
                  <span className="text-white/60 text-sm">{data?.en?.[key] ?? ''}</span>
                </div>
                <div>
                  <input
                    value={getValue(key)}
                    onChange={(e) => setEdits((prev) => ({ ...prev, [key]: e.target.value }))}
                    className={`w-full px-3 py-1.5 rounded-lg text-sm bg-transparent border transition-colors focus:outline-none ${
                      edits[key] !== undefined
                        ? 'border-gold/50 text-white bg-gold/5'
                        : 'border-transparent text-white/70 focus:border-white/20 hover:border-white/10'
                    }`}
                    placeholder="Enter translation…"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
