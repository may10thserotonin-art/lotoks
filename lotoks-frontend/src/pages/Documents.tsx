import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useAuthStore } from '@/store/auth';
import { Sidebar, MobileTabBar, MobileMenu } from '@/components/Navigation';
import { apiFetch, apiJson } from '@/lib/api';

interface UserDocument {
  id: number;
  name: string;
  filename: string;
  filesize: number;
  mime_type: string;
  category: string;
  verified: number;
  created_at: string;
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function DocumentsPage() {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Fetch documents
  const { data: docsData, isLoading: docsLoading } = useQuery({
    queryKey: ['user-documents'],
    queryFn: async () => {
      const res = await apiFetch('/user/documents');
      return apiJson<{ documents: UserDocument[] }>(res);
    },
    staleTime: 30_000,
    enabled: isAuthenticated,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (docId: number) => {
      const res = await apiFetch(`/user/documents/${docId}`, { method: 'DELETE' });
      return apiJson(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-documents'] });
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', '');

      const res = await fetch('/api/user/documents/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await apiJson<{message?: string}>(res);
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ['user-documents'] });
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const docs = docsData?.documents || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-white/60 text-sm">Loading…</p>
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

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Main Content */}
      <div className="lg:ml-60 min-h-screen pb-20 md:pb-0">
        <div className="p-6 md:p-8 space-y-10">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">My Documents</h1>
              <p className="text-sm text-white/50 font-medium">Access and manage your sponsorship files and certificates.</p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleUpload}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-navy font-bold text-xs hover:bg-gold/90 transition-all shadow-lg shadow-gold/20 disabled:opacity-50"
              >
                {isUploading ? (
                  <><Loader2 size={16} className="animate-spin" /> Uploading…</>
                ) : (
                  <><Plus size={16} /> Upload New File</>
                )}
              </button>
            </div>
          </header>

          {uploadError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-red-200 text-sm">{uploadError}</span>
            </div>
          )}

          {/* Document List */}
          {docsLoading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-white/40 text-sm">Loading documents…</p>
            </div>
          ) : docs.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-white/10 mx-auto mb-4" />
              <p className="text-white/40 font-medium">No documents yet</p>
              <p className="text-white/20 text-xs mt-1">Upload your first document to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {docs.map((doc, idx) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/[0.07] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <FileText size={24} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{doc.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-white/30">
                          {formatSize(doc.filesize)}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-xs text-white/30">
                          {formatDate(doc.created_at)}
                        </span>
                        {doc.verified === 1 && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-[10px] text-green-400 font-medium flex items-center gap-1">
                              <CheckCircle2 size={10} /> Verified
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteMutation.mutate(doc.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Info Card */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h6 className="font-bold text-white text-sm mb-1">Authenticated Documents</h6>
            <p className="text-xs text-white/40 leading-relaxed">
              All documents generated on the Lotoks platform are cryptographically signed and can be verified by 
              scanning the QR code on the physical printout or using the unique verification ID.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <MobileTabBar />
    </div>
  );
}
