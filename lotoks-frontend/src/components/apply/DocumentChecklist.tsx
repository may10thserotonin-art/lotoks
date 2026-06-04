import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';

export interface RequiredDoc {
  id: string;
  name: string;
  description: string;
  required: boolean;
  accepted: string;
}

interface DocumentChecklistProps {
  documents: RequiredDoc[];
  uploadedFiles: Record<string, { name: string; size: number; status: 'uploading' | 'done' | 'error' }>;
  onUpload: (docId: string, file: File) => void;
  onRemove: (docId: string) => void;
}

export default function DocumentChecklist({
  documents,
  uploadedFiles,
  onUpload,
  onRemove,
}: DocumentChecklistProps) {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileSelect = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(docId, file);
      // Reset input so same file can be re-selected
      e.target.value = '';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const allRequired = documents.filter((d) => d.required);
  const uploadedCount = allRequired.filter((d) => uploadedFiles[d.id]?.status === 'done').length;

  return (
    <div className="space-y-6">
      {/* Progress summary */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-gold" />
          <span className="text-sm text-white/80">
            {uploadedCount} of {allRequired.length} required documents uploaded
          </span>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
          uploadedCount === allRequired.length
            ? 'bg-green-500/10 text-green-400'
            : 'bg-gold/10 text-gold'
        }`}>
          {uploadedCount === allRequired.length ? 'Complete' : `${Math.round((uploadedCount / allRequired.length) * 100)}%`}
        </span>
      </div>

      {/* Document list */}
      <div className="space-y-3">
        {documents.map((doc) => {
          const upload = uploadedFiles[doc.id];
          const isUploaded = upload?.status === 'done';
          const isUploading = upload?.status === 'uploading';
          const hasError = upload?.status === 'error';

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border transition-all ${
                isUploaded
                  ? 'bg-green-500/5 border-green-500/30'
                  : hasError
                  ? 'bg-red-500/5 border-red-500/30'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {doc.name}
                    </span>
                    {doc.required && (
                      <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    )}
                    {!doc.required && (
                      <span className="text-[10px] font-bold text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                        Optional
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-1">{doc.description}</p>
                  <p className="text-[10px] text-white/20 mt-0.5">Accepted: {doc.accepted}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isUploaded ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-400 truncate max-w-[120px]">
                        {upload.name}
                      </span>
                      <button
                        onClick={() => onRemove(doc.id)}
                        className="p-1 rounded-full hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
                        title="Remove file"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : isUploading ? (
                    <Loader2 size={20} className="text-gold animate-spin" />
                  ) : (
                    <button
                      onClick={() => fileInputRefs.current[doc.id]?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-semibold hover:bg-gold/20 transition-colors"
                    >
                      <Upload size={14} />
                      Upload
                    </button>
                  )}
                </div>
              </div>

              {hasError && (
                <div className="mt-2 flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle size={12} />
                  Upload failed. Please try again.
                </div>
              )}

              <input
                ref={(el) => { fileInputRefs.current[doc.id] = el; }}
                type="file"
                accept={doc.accepted}
                className="hidden"
                onChange={(e) => handleFileSelect(doc.id, e)}
              />
            </motion.div>
          );
        })}
      </div>

      {documents.length === 0 && (
        <div className="text-center py-8 text-white/40">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No documents required for this selection.</p>
        </div>
      )}
    </div>
  );
}
