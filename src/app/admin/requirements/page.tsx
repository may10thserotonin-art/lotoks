"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, GraduationCap, Briefcase, Home, ExternalLink, Pencil, AlertCircle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface RequirementSet {
  id: number;
  service_type: string;
  name: string;
  description?: string;
  category_count?: number;
  last_updated: string;
}

const serviceIcons: Record<string, React.ElementType> = {
  visa: Globe,
  education: GraduationCap,
  jobs: Briefcase,
  residence: Home,
};

const serviceColors: Record<string, string> = {
  visa: "from-blue-600 to-blue-700",
  education: "from-emerald-600 to-emerald-700",
  jobs: "from-amber-600 to-amber-700",
  residence: "from-purple-600 to-purple-700",
};

const serviceLabels: Record<string, string> = {
  visa: "Visa Sponsorship",
  education: "Education & Scholarship",
  jobs: "Job Placement",
  residence: "Permanent Residence",
};

async function fetchRequirementSets(): Promise<RequirementSet[]> {
  const res = await fetch("/api/admin/requirements");
  if (!res.ok) throw new Error("Failed to load requirement sets");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default function AdminRequirementsPage() {
  const { data: sets, isLoading, error } = useQuery<RequirementSet[]>({
    queryKey: ["admin", "requirements"],
    queryFn: fetchRequirementSets,
  });
  const queryClient = useQueryClient();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500 gap-3">
        <AlertCircle size={32} />
        <p className="text-sm font-medium">Failed to load requirements</p>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ["admin", "requirements"] })}
          className="text-xs px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Requirements Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Manage document checklists for each service</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(serviceLabels).map(([key, label], i) => {
          const set = sets?.find((s) => s.service_type === key);
          const Icon = serviceIcons[key] || Globe;
          const color = serviceColors[key] || "from-blue-600 to-blue-700";

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/admin/requirements/${key}`}
                className="block group"
              >
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className={`p-6 text-white bg-gradient-to-br ${color}`}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                        <Icon size={28} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{label}</h3>
                        <p className="text-white/70 text-sm mt-0.5">
                          {set?.last_updated ? `Last updated: ${new Date(set.last_updated).toLocaleDateString()}` : "Not configured"}
                        </p>
                      </div>
                      <ExternalLink size={18} className="text-white/50 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span className="font-medium">Categories: {set?.category_count ?? 0}</span>
                    </div>
                    <span className="text-xs font-medium text-blue-600 group-hover:gap-2 transition-all inline-flex items-center gap-1">
                      <Pencil size={12} />
                      Edit Requirements
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
