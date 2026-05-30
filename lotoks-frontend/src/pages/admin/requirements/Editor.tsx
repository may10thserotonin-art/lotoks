import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, Save, Trash2, ChevronUp, ChevronDown,
  GripVertical, Loader2, AlertTriangle, FileText, CheckSquare, Square
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/shared/Toast';

interface Doc {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

interface Category {
  id: string;
  name: string;
  documents: Doc[];
}

interface RequirementSet {
  serviceType: string;
  categories: Category[];
}

const SERVICE_LABELS: Record<string, string> = {
  visa: 'Visa Sponsorship',
  education: 'Education & Scholarships',
  job: 'Job Placement',
  residence: 'Permanent Residence',
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function AdminRequirementsEditorPage() {
  const { serviceType = '' } = useParams<{ serviceType: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { isLoading, error } = useQuery<RequirementSet>({
    queryKey: ['adminRequirements', serviceType],
    queryFn: async () => {
      const res = await apiFetch(`/admin/requirements/${serviceType}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const cats: Category[] = (data.categories ?? []).map((c: Category) => ({
        ...c,
        id: c.id ?? uid(),
        documents: (c.documents ?? []).map((d: Doc) => ({ ...d, id: d.id ?? uid() })),
      }));
      setCategories(cats);
      setLoaded(true);
      return data;
    },
    enabled: !!serviceType,
  });

  // ── Category helpers ─────────────────────────────────────────
  const addCategory = () =>
    setCategories((prev) => [...prev, { id: uid(), name: 'New Category', documents: [] }]);

  const removeCategory = (cid: string) =>
    setCategories((prev) => prev.filter((c) => c.id !== cid));

  const updateCategoryName = (cid: string, name: string) =>
    setCategories((prev) => prev.map((c) => (c.id === cid ? { ...c, name } : c)));

  const moveCategory = (cid: string, dir: -1 | 1) =>
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === cid);
      if (idx + dir < 0 || idx + dir >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
      return next;
    });

  // ── Document helpers ─────────────────────────────────────────
  const addDoc = (cid: string) =>
    setCategories((prev) =>
      prev.map((c) =>
        c.id === cid
          ? { ...c, documents: [...c.documents, { id: uid(), name: 'New Document', description: '', required: true }] }
          : c
      )
    );

  const removeDoc = (cid: string, did: string) =>
    setCategories((prev) =>
      prev.map((c) => (c.id === cid ? { ...c, documents: c.documents.filter((d) => d.id !== did) } : c))
    );

  const updateDoc = (cid: string, did: string, patch: Partial<Doc>) =>
    setCategories((prev) =>
      prev.map((c) =>
        c.id === cid
          ? { ...c, documents: c.documents.map((d) => (d.id === did ? { ...d, ...patch } : d)) }
          : c
      )
    );

  const moveDoc = (cid: string, did: string, dir: -1 | 1) =>
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== cid) return c;
        const docs = [...c.documents];
        const idx = docs.findIndex((d) => d.id === did);
        if (idx + dir < 0 || idx + dir >= docs.length) return c;
        [docs[idx], docs[idx + dir]] = [docs[idx + dir], docs[idx]];
        return { ...c, documents: docs };
      })
    );

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiFetch(`/admin/requirements/${serviceType}`, {
        method: 'PUT',
        body: JSON.stringify({ categories }),
      });
      if (!res.ok) throw new Error();
      toast.success('Requirements saved!');
      qc.invalidateQueries({ queryKey: ['adminRequirements'] });
    } catch {
      toast.error('Failed to save requirements.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>;
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red/10 border border-red/20 text-red/80">
          <AlertTriangle className="w-5 h-5" /><span className="text-sm">Failed to load requirements.</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/requirements')}
            className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Requirements Editor</p>
            <h1 className="text-2xl font-heading font-bold text-white">
              {SERVICE_LABELS[serviceType] ?? serviceType}
            </h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={addCategory} icon={<Plus className="w-4 h-4" />}>
            Add Category
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving} icon={<Save className="w-4 h-4" />}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-5">
        <AnimatePresence>
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-4">
                <GripVertical className="w-4 h-4 text-white/20 flex-shrink-0" />
                <input
                  value={cat.name}
                  onChange={(e) => updateCategoryName(cat.id, e.target.value)}
                  className="flex-1 bg-transparent text-white font-heading font-semibold text-lg focus:outline-none border-b border-transparent hover:border-white/20 focus:border-gold/50 pb-0.5 transition-colors"
                />
                <button onClick={() => moveCategory(cat.id, -1)} disabled={ci === 0} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={() => moveCategory(cat.id, 1)} disabled={ci === categories.length - 1} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button onClick={() => removeCategory(cat.id)} className="p-1.5 rounded-lg text-white/20 hover:text-red hover:bg-red/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Documents */}
              <div className="space-y-2 ml-7">
                <AnimatePresence>
                  {cat.documents.map((doc, di) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 group transition-colors"
                    >
                      <FileText className="w-4 h-4 text-gold/60 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0 space-y-1">
                        <input
                          value={doc.name}
                          onChange={(e) => updateDoc(cat.id, doc.id, { name: e.target.value })}
                          className="w-full bg-transparent text-white text-sm font-medium focus:outline-none border-b border-transparent hover:border-white/20 focus:border-gold/50 transition-colors pb-0.5"
                          placeholder="Document name…"
                        />
                        <input
                          value={doc.description}
                          onChange={(e) => updateDoc(cat.id, doc.id, { description: e.target.value })}
                          className="w-full bg-transparent text-white/50 text-xs focus:outline-none border-b border-transparent hover:border-white/10 focus:border-gold/30 transition-colors pb-0.5"
                          placeholder="Description (optional)…"
                        />
                      </div>
                      {/* Required toggle */}
                      <button
                        onClick={() => updateDoc(cat.id, doc.id, { required: !doc.required })}
                        className={`flex items-center gap-1 text-xs font-medium transition-colors flex-shrink-0 ${doc.required ? 'text-gold' : 'text-white/30 hover:text-white/60'}`}
                        title={doc.required ? 'Required' : 'Optional'}
                      >
                        {doc.required ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                        <span className="hidden sm:inline">{doc.required ? 'Required' : 'Optional'}</span>
                      </button>
                      {/* Reorder */}
                      <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => moveDoc(cat.id, doc.id, -1)} disabled={di === 0} className="p-0.5 text-white/30 hover:text-white disabled:opacity-20">
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button onClick={() => moveDoc(cat.id, doc.id, 1)} disabled={di === cat.documents.length - 1} className="p-0.5 text-white/30 hover:text-white disabled:opacity-20">
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                      <button onClick={() => removeDoc(cat.id, doc.id)} className="p-1 rounded-lg text-white/20 hover:text-red hover:bg-red/10 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  onClick={() => addDoc(cat.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 text-sm transition-colors w-full"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add document
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {categories.length === 0 && (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
            <p className="text-white/40 text-sm mb-3">No categories yet.</p>
            <Button variant="secondary" size="sm" onClick={addCategory} icon={<Plus className="w-4 h-4" />}>
              Add First Category
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
