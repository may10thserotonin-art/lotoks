
import React from "react";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { 
  Plus, 
  ArrowUpRight, 
  Calendar, 
  CheckCircle2, 
  FileText,
  Download,
  Briefcase,
  AlertCircle
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";


function ApplicationCard({ 
  id, 
  title, 
  type, 
  status, 
  date, 
  progress 
}: { 
  id: string, 
  title: string, 
  type: string, 
  status: string, 
  date: string,
  progress: number 
}) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-5">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-blue-600">
            {type === "visa" ? <FileText size={24} /> : <Briefcase size={24} />}
          </div>
          <div>
            <h6 className="font-bold text-slate-900 mb-0.5">{title}</h6>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              App ID: <span className="text-blue-600">{id}</span>
            </p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Progress Pipeline - standardized with bg-slate-100 and 6px height */}
      <div className="relative h-1.5 bg-slate-100 rounded-full mb-6 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="absolute h-full bg-blue-600 rounded-full"
          transition={{ duration: 1, ease: "easeOut" }}
        />
        {/* Pulse for current step */}
        {status === "under_review" && (
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute h-3 w-3 bg-blue-600 rounded-full -top-0.75"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar size={14} />
          Updated {date}
        </div>
        <div className="flex gap-2">
          {status === "approved" && (
            <button className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all">
              <Download size={16} />
            </button>
          )}
          <Link 
            to="/apply" 
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 active:scale-95 transition-all group"
          >
            View Details
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="pl-12 sm:pl-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
            Welcome Back, <span className="text-blue-600">Amina</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">Here is what's happening with your sponsorship applications.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-3 rounded-full bg-white border border-slate-200 text-slate-500 hover:shadow-md hover:scale-105 active:scale-95 transition-all">
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            <AlertCircle size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-600/20">
            AO
          </div>
        </div>
      </header>

      {/* Dashboard Grid - 3 columns on desktop, responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed - 2 columns on desktop */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-slate-900 text-lg">Active Applications</h5>
            <button className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline">
              View All
            </button>
          </div>
          
          <div className="grid gap-6">
            <ApplicationCard 
              id="LTK-2026-00001"
              title="Visa + Job Sponsorship"
              type="visa"
              status="under_review"
              date="2 hours ago"
              progress={45}
            />
            <ApplicationCard 
              id="LTK-2026-00002"
              title="Education Scholarship"
              type="edu"
              status="approved"
              date="15 Apr 2026"
              progress={100}
            />
          </div>
        </div>

        {/* Right Rail - 1 column on desktop */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <Link to="/apply" className="block group relative overflow-hidden rounded-2xl bg-blue-600 text-white p-6 shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Plus size={80} />
            </div>
            <h6 className="font-bold text-lg mb-2">New Application</h6>
            <p className="text-xs text-white/70 mb-6">Start your journey for Visa, Education, or Job sponsorship.</p>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 text-xs font-bold hover:bg-white/30 active:scale-95 transition-all">
              Start Now <Plus size={14} />
            </div>
          </Link>

          {/* Verification Status Card */}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <h6 className="font-bold text-slate-900 mb-4">Verification Status</h6>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Identity Verified</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Passport Level 1</p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <h6 className="font-bold text-slate-900 mb-4">Application Stats</h6>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total Applications</span>
                <span className="font-bold text-slate-900">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">In Progress</span>
                <span className="font-bold text-amber-600">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Approved</span>
                <span className="font-bold text-green-600">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Rejected</span>
                <span className="font-bold text-red-600">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}