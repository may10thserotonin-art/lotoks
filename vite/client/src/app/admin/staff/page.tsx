
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Mail, Shield } from "lucide-react";

const staff = [
  { id: 1, name: "Sarah Johnson", email: "sarah@lotoks.com", role: "Admin", status: "active" },
  { id: 2, name: "Mike Chen", email: "mike@lotoks.com", role: "Reviewer", status: "active" },
  { id: 3, name: "Emma Wilson", email: "emma@lotoks.com", role: "Support", status: "active" },
  { id: 4, name: "David Lee", email: "david@lotoks.com", role: "Reviewer", status: "inactive" },
];

export default function AdminStaffPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Staff Management</h2>
          <p className="text-sm text-on-surface-variant font-medium mt-1">Manage team members and their roles</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dim transition-all shadow-lg shadow-primary/20">
          <Plus size={18} />
          Add Staff
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
          <input 
            type="text" 
            placeholder="Search staff..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {staff.map((member, idx) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center justify-between p-6 bg-white border border-outline-variant/30 rounded-2xl hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                {member.name.charAt(0)}
              </div>
              <div>
                <h5 className="font-bold text-on-surface">{member.name}</h5>
                <p className="text-sm text-primary font-medium flex items-center gap-1">
                  <Mail size={14} /> {member.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-xs font-bold">
                <Shield size={14} className="text-primary" />
                {member.role}
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${member.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                {member.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}