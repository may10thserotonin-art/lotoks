"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Download, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Search,
  Plus
} from "lucide-react";
import DashboardLayout from "@/app/dashboard/layout";

const docs = [
  { id: 1, name: "Visa Approval Letter", date: "05 May 2026", size: "1.2 MB", status: "ready" },
  { id: 2, name: "Sponsorship Certificate", date: "02 May 2026", size: "850 KB", status: "ready" },
  { id: 3, name: "Payment Receipt #RT-4421", date: "15 Apr 2026", size: "240 KB", status: "ready" },
  { id: 4, name: "Identity Verification", date: "12 Apr 2026", size: "--", status: "processing" },
];

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-on-surface mb-1">My Documents</h1>
            <p className="text-sm text-outline-variant font-medium">Access and download your sponsorship files and certificates.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dim transition-all shadow-lg shadow-primary/20">
            <Plus size={16} /> Upload New File
          </button>
        </header>

        <div className="card bg-white border border-outline-variant/30 rounded-2xl shadow-sm">
          <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
              <input 
                type="text" 
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 outline-none text-xs font-medium"
              />
            </div>
          </div>

          <div className="divide-y divide-outline-variant/10">
            {docs.map((doc, idx) => (
              <motion.div 
                key={doc.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-red-500">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h6 className="font-bold text-on-surface mb-0.5">{doc.name}</h6>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">{doc.date}</span>
                      <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">·</span>
                      <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">{doc.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {doc.status === "ready" ? (
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-full bg-surface-container text-on-surface hover:bg-primary hover:text-white transition-all shadow-sm">
                        <Download size={18} />
                      </button>
                      <button className="p-2 rounded-full bg-surface-container text-on-surface hover:bg-primary hover:text-white transition-all shadow-sm">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-widest">
                      <Clock size={12} /> Processing
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h6 className="font-bold text-on-surface text-sm mb-1">Authenticated Documents</h6>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              All documents generated on the Lotoks platform are cryptographically signed and can be verified by 
              scanning the QR code on the physical printout or using the unique verification ID.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
