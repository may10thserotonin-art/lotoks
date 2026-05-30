"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Save, Plus, Trash2, GripVertical, 
  FolderOpen
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface Document {
  doc_key: string;
  label: string;
  description: string;
  required: boolean;
  display_order: number;
}

interface Category {
  category_key: string;
  category_name: string;
  display_order: number;
  documents: Document[];
}

interface RequirementSet {
  service_type: string;
  name: string;
  description: string;
  categories: Category[];
}

interface SavePayload {
  name: string;
  description: string;
  categories: Category[];
}

const serviceLabels: Record<string, string> = {
  visa: "Visa Sponsorship",
  education: "Education & Scholarship",
  jobs: "Job Placement",
  residence: "Permanent Residence",
};

async function fetchRequirementSet(service: string): Promise<RequirementSet> {
  const res = await fetch(`/api/admin/requirements/${service}`);
  if (res.ok) {
    return res.json();
  }
  // If 404, create default
  return {
    service_type: service,
    name: serviceLabels[service] || service,
    description: "",
    categories: [],
  };
}

async function saveRequirementSet(service: string, payload: SavePayload): Promise<void> {
  const res = await fetch(`/api/admin/requirements/${service}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: "Failed to save" }));
    throw new Error(data.error || "Failed to save");
  }
}

export default function ServiceRequirementsEditor({ params }: { params: Promise<{ service: string }> }) {
  const { service } = use(params);
  const queryClient = useQueryClient();

  const { data: set, isLoading } = useQuery<RequirementSet>({
    queryKey: ["admin", "requirements", service],
    queryFn: () => fetchRequirementSet(service),
  });

  // Local editing state: clone of set when it loads
  const [localSet, setLocalSet] = useState<RequirementSet | null>(null);

  // Sync local state when server data changes
  React.useEffect(() => {
    if (set && !localSet) {
      setLocalSet(JSON.parse(JSON.stringify(set)));
    }
  }, [set, localSet]);

  const saveMutation = useMutation({
    mutationFn: (payload: SavePayload) => saveRequirementSet(service, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "requirements"] });
      toast.success("Requirements saved successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const current = localSet ?? set;

  const addCategory = () => {
    if (!current) return;
    setLocalSet({
      ...current,
      categories: [
        ...current.categories,
        {
          category_key: `cat_${Date.now()}`,
          category_name: "",
          display_order: current.categories.length,
          documents: [],
        },
      ],
    });
  };

  const updateCategory = (index: number, field: string, value: any) => {
    if (!current) return;
    const categories = [...current.categories];
    (categories[index] as any)[field] = value;
    setLocalSet({ ...current, categories });
  };

  const removeCategory = (index: number) => {
    if (!current) return;
    setLocalSet({
      ...current,
      categories: current.categories.filter((_, i) => i !== index),
    });
  };

  const addDocument = (catIndex: number) => {
    if (!current) return;
    const categories = [...current.categories];
    categories[catIndex].documents.push({
      doc_key: `doc_${Date.now()}`,
      label: "",
      description: "",
      required: true,
      display_order: categories[catIndex].documents.length,
    });
    setLocalSet({ ...current, categories });
  };

  const updateDocument = (catIndex: number, docIndex: number, field: string, value: any) => {
    if (!current) return;
    const categories = [...current.categories];
    (categories[catIndex].documents[docIndex] as any)[field] = value;
    setLocalSet({ ...current, categories });
  };

  const removeDocument = (catIndex: number, docIndex: number) => {
    if (!current) return;
    const categories = [...current.categories];
    categories[catIndex].documents = categories[catIndex].documents.filter((_, i) => i !== docIndex);
    setLocalSet({ ...current, categories });
  };

  const handleSave = () => {
    if (!current) return;
    saveMutation.mutate({
      name: current.name,
      description: current.description,
      categories: current.categories.map((cat, ci) => ({
        ...cat,
        display_order: ci,
        documents: cat.documents.map((doc, di) => ({
          ...doc,
          display_order: di,
        })),
      })),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!current) {
    return <div className="text-center py-12 text-gray-500">Service not found</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/requirements" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-navy">{current.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {current.categories.length} categories, {current.categories.reduce((s, c) => s + c.documents.length, 0)} documents
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saveMutation.isPending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save
        </button>
      </div>

      {/* Message via toast */}

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Service Description</label>
        <textarea
          value={current.description}
          onChange={(e) => setLocalSet({ ...current, description: e.target.value })}
          rows={2}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 text-sm resize-none"
          placeholder="Describe what this service covers..."
        />
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {current.categories.map((category, catIndex) => (
          <motion.div
            key={category.category_key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          >
            {/* Category Header */}
            <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
              <FolderOpen size={18} className="text-blue-600 shrink-0" />
              <input
                type="text"
                value={category.category_name}
                onChange={(e) => updateCategory(catIndex, 'category_name', e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-sm font-medium"
                placeholder="Category name (e.g. Identity Documents)"
              />
              <span className="text-xs text-gray-400">{category.documents.length} items</span>
              <button
                onClick={() => removeCategory(catIndex)}
                className="p-1.5 rounded-lg hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Documents */}
            <div className="p-4 space-y-3">
              {category.documents.map((doc, docIndex) => (
                <div key={doc.doc_key} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100">
                  <div className="mt-0.5 text-gray-300">
                    <GripVertical size={16} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={doc.label}
                        onChange={(e) => updateDocument(catIndex, docIndex, 'label', e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-sm"
                        placeholder="Document label (e.g. Valid Passport)"
                      />
                      <input
                        type="text"
                        value={doc.doc_key}
                        onChange={(e) => updateDocument(catIndex, docIndex, 'doc_key', e.target.value)}
                        className="w-28 px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-xs text-gray-500"
                        placeholder="key_name"
                      />
                    </div>
                    <textarea
                      value={doc.description}
                      onChange={(e) => updateDocument(catIndex, docIndex, 'description', e.target.value)}
                      rows={1}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-xs resize-none"
                      placeholder="Optional description..."
                    />
                    <label className="flex items-center gap-2 text-xs text-gray-500">
                      <input
                        type="checkbox"
                        checked={doc.required}
                        onChange={(e) => updateDocument(catIndex, docIndex, 'required', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      Required document
                    </label>
                  </div>
                  <button
                    onClick={() => removeDocument(catIndex, docIndex)}
                    className="p-1.5 rounded-lg hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors mt-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              <button
                onClick={() => addDocument(catIndex)}
                className="w-full py-2 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={14} />
                Add Document
              </button>
            </div>
          </motion.div>
        ))}

        {/* Add Category */}
        <button
          onClick={addCategory}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Bottom Save */}
      <div className="sticky bottom-6 mt-6 flex justify-center">
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
        >
          {saveMutation.isPending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Save All Changes
        </button>
      </div>
    </div>
  );
}
