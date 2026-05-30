"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, MoreVertical, Briefcase, GraduationCap, Globe } from "lucide-react";

const listings = [
  { id: 1, title: "Registered Nurse", type: "job", country: "UK", status: "active", applicants: 45 },
  { id: 2, title: "MSc Computer Science", type: "edu", country: "Australia", status: "active", applicants: 23 },
  { id: 3, title: "Software Engineer", type: "job", country: "Canada", status: "active", applicants: 67 },
  { id: 4, title: "PhD Scholarship", type: "edu", country: "USA", status: "paused", applicants: 12 },
];

export default function AdminListingsPage() {
  const [filter, setFilter] = useState("all");

  const typeIcon = { job: Briefcase, edu: GraduationCap, visa: Globe };
  const typeColor = { job: "bg-primary/10 text-primary", edu: "bg-tertiary/10 text-tertiary", visa: "bg-green-500/10 text-green-600" };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Sponsorship Listings</h2>
          <p className="text-sm text-on-surface-variant font-medium mt-1">Manage job, education, and visa opportunities</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dim transition-all shadow-lg shadow-primary/20">
          <Plus size={18} />
          New Listing
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
          <input 
            type="text" 
            placeholder="Search listings..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {listings.map((item, idx) => {
          const Icon = typeIcon[item.type as keyof typeof typeIcon] || Briefcase;
          const colorClass = typeColor[item.type as keyof typeof typeColor] || typeColor.job;
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-6 bg-white border border-outline-variant/30 rounded-2xl hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h5 className="font-bold text-on-surface">{item.title}</h5>
                  <p className="text-sm text-primary font-medium">{item.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs font-bold text-outline-variant uppercase tracking-widest">Applicants</p>
                  <p className="font-bold text-on-surface">{item.applicants}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-orange-500/10 text-orange-600'}`}>
                  {item.status}
                </span>
                <button className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                  <MoreVertical size={18} className="text-outline-variant" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}