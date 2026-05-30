
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Download, 
  X, 
  User, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  MoreVertical
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

const queue = [
  { id: "LTK-2026-00001", name: "Amina Okafor", country: "Nigeria", type: "Visa + Job", date: "08 May", status: "under_review" },
  { id: "LTK-2026-00003", name: "John Doe", country: "Ghana", type: "Education", date: "07 May", status: "submitted" },
  { id: "LTK-2026-00004", name: "Sarah Smith", country: "Kenya", type: "Job", date: "06 May", status: "more_info" },
];

export default function AdminQueue() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = queue.find(a => a.id === selectedId);

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-1">Application Queue</h1>
          <p className="text-sm text-outline-variant font-medium">Review and process incoming sponsorship requests.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-outline-variant/30 font-bold text-xs hover:bg-surface-container transition-all">
          <Download size={16} /> Export CSV
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Pending", value: "124", color: "border-primary" },
          { label: "Requires Info", value: "12", color: "border-tertiary" },
          { label: "Approved Today", value: "45", color: "border-green-500" },
          { label: "Rejected", value: "8", color: "border-red-500" }
        ].map((stat) => (
          <div key={stat.label} className={`card p-4 bg-white border-l-4 ${stat.color} rounded-xl shadow-sm`}>
            <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-on-surface">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card bg-white border border-outline-variant/30 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-outline-variant/10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
            <input 
              type="text" 
              placeholder="Search applicant, country, or ID..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 outline-none text-xs font-medium"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-low text-xs font-bold hover:bg-surface-container transition-all">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-outline-variant uppercase tracking-widest">Applicant</th>
                <th className="px-6 py-4 text-[10px] font-bold text-outline-variant uppercase tracking-widest">App ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-outline-variant uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-outline-variant uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-outline-variant uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {queue.map((app) => (
                <tr key={app.id} className="hover:bg-primary/5 transition-colors group cursor-pointer" onClick={() => setSelectedId(app.id)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                        {app.name.charAt(0)}
                      </div>
                      <div className="font-bold text-sm text-on-surface">{app.name} <span className="block text-[10px] text-outline-variant font-medium">{app.country}</span></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-primary">{app.id}</td>
                  <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">{app.type}</td>
                  <td className="px-6 py-4 text-xs text-outline-variant">{app.date}</td>
                  <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-4 py-2 rounded-full bg-primary text-white text-[10px] font-bold hover:bg-primary-dim transition-all">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel Review */}
      <AnimatePresence>
        {selectedId && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-[60] overflow-y-auto"
            >
              <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md">
                <h5 className="font-bold text-on-surface">Review Application</h5>
                <button onClick={() => setSelectedId(null)} className="p-2 rounded-full hover:bg-surface-container transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-primary/20">
                    {selected?.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-on-surface">{selected?.name}</h4>
                    <p className="text-sm text-outline-variant font-medium">amina@example.com · {selected?.country}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-surface-container-low">
                    <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">Application Type</p>
                    <p className="text-sm font-bold text-on-surface">{selected?.type}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-low">
                    <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">Destination</p>
                    <p className="text-sm font-bold text-on-surface">United Kingdom 🇬🇧</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h6 className="text-xs font-bold text-outline-variant uppercase tracking-widest">Submitted Documents</h6>
                  {["Passport_Amina.pdf", "IELTS_Result.pdf", "CV_Amina.pdf"].map((doc) => (
                    <div key={doc} className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 hover:border-primary transition-all group">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-red-500" />
                        <span className="text-sm font-bold text-on-surface">{doc}</span>
                      </div>
                      <button className="text-xs font-bold text-primary group-hover:underline">Preview</button>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-outline-variant/10 space-y-4">
                  <div className="flex gap-2">
                    <button className="flex-grow py-4 rounded-full bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary-dim shadow-lg shadow-primary/20">
                      <CheckCircle2 size={18} /> Approve
                    </button>
                    <button className="flex-grow py-4 rounded-full bg-tertiary text-white font-bold flex items-center justify-center gap-2 hover:bg-tertiary-dim shadow-lg shadow-tertiary/20">
                      <HelpCircle size={18} /> Info Request
                    </button>
                  </div>
                  <button className="w-full py-4 rounded-full bg-red-500/10 text-red-600 font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all">
                    <XCircle size={18} /> Reject Application
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
