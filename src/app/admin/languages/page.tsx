"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Edit2, Check, X } from "lucide-react";

const languages = [
  { code: "en", name: "English", native: "English", status: "active", isDefault: true },
  { code: "es", name: "Spanish", native: "Español", status: "active", isDefault: false },
  { code: "fr", name: "French", native: "Français", status: "active", isDefault: false },
  { code: "de", name: "German", native: "Deutsch", status: "inactive", isDefault: false },
  { code: "zh", name: "Chinese", native: "中文", status: "active", isDefault: false },
];

export default function AdminLanguagesPage() {
  const [translations, setTranslations] = useState(languages);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Internationalization (i18n)</h2>
          <p className="text-sm text-on-surface-variant font-medium mt-1">Manage languages and translations</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dim transition-all shadow-lg shadow-primary/20">
          <Globe size={18} />
          Add Language
        </button>
      </div>

      <div className="bg-white border border-outline-variant/30 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/20">
              <th className="text-left px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Language</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Native Name</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Code</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Default</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {translations.map((lang, idx) => (
              <motion.tr
                key={lang.code}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {lang.code.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-on-surface">{lang.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-on-surface-variant font-medium">{lang.native}</td>
                <td className="px-6 py-4">
                  <code className="px-2 py-1 rounded bg-surface-container text-xs font-mono">{lang.code}</code>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${lang.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                    {lang.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {lang.isDefault ? (
                    <span className="text-primary text-xs font-bold">Default</span>
                  ) : (
                    <button className="text-xs font-bold text-outline-variant hover:text-primary transition-colors">Set Default</button>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                    <Edit2 size={16} className="text-outline-variant" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}