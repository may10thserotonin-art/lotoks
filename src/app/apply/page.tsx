"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Upload, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  ArrowRight, 
  ChevronLeft,
  CheckCircle2,
  DollarSign,
  User
} from "lucide-react";
import DashboardLayout from "@/app/dashboard/layout";

const applicationSteps = [
  { id: "type", title: "Sponsorship Type", icon: Briefcase },
  { id: "details", title: "Personal Details", icon: User },
  { id: "docs", title: "Document Upload", icon: Upload },
  { id: "payment", title: "Fee Payment", icon: DollarSign }
];

export default function ApplyWizard() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    type: "",
    country: "",
    firstName: "",
    lastName: "",
    email: "",
    files: [] as File[]
  });

  const nextStep = () => setStep(s => Math.min(s + 1, applicationSteps.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-6">
        <header className="mb-12">
          <h2 className="text-3xl font-bold text-on-surface mb-2">New <span className="text-primary">Application.</span></h2>
          <p className="text-sm text-outline-variant font-medium">Complete the 4 steps to submit your sponsorship request.</p>
        </header>

        {/* Stepper Header */}
        <div className="flex justify-between items-center mb-12 relative px-4">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-surface-container -translate-y-1/2 z-0 mx-8" />
          {applicationSteps.map((s, i) => {
            const active = i <= step;
            const current = i === step;
            const Icon = s.icon;
            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${active ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-outline-variant border border-outline-variant/30"}`}>
                  {i < step ? <CheckCircle2 size={24} /> : <Icon size={20} />}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? "text-primary" : "text-outline-variant"}`}>{s.title}</span>
              </div>
            );
          })}
        </div>

        <div className="card p-8 bg-white border border-outline-variant/30 rounded-2xl shadow-xl min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h4 className="text-xl font-bold text-on-surface">Select Sponsorship Pathway</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: "visa", label: "Visa Sponsorship", desc: "Expert support for work and family visas.", icon: MapPin },
                    { id: "job", label: "Job Sponsorship", desc: "Connect with employers providing certificates.", icon: Briefcase },
                    { id: "edu", label: "Education Scholarship", desc: "Full or partial funding for global studies.", icon: GraduationCap }
                  ].map((path) => (
                    <button
                      key={path.id}
                      onClick={() => { setFormData({...formData, type: path.id}); nextStep(); }}
                      className={`p-6 text-left rounded-xl border-2 transition-all ${formData.type === path.id ? "border-primary bg-primary/5" : "border-outline-variant/10 hover:border-primary/50"}`}
                    >
                      <path.icon className="text-primary mb-4" size={32} />
                      <h6 className="font-bold text-on-surface mb-1">{path.label}</h6>
                      <p className="text-xs text-on-surface-variant font-medium">{path.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h4 className="text-xl font-bold text-on-surface">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">First Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:border-primary outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:border-primary outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:border-primary outline-none" />
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <button onClick={prevStep} className="px-8 py-3 rounded-full border border-outline-variant/30 font-bold text-sm">Back</button>
                  <button onClick={nextStep} className="flex-grow py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20">Next Step</button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h4 className="text-xl font-bold text-on-surface">Required Documents</h4>
                <div className="space-y-4">
                  {[
                    { label: "Valid Passport", req: true },
                    { label: "Educational Certificate", req: true },
                    { label: "Proof of Experience", req: false }
                  ].map((doc) => (
                    <div key={doc.label} className="p-4 rounded-xl border-2 border-dashed border-outline-variant/30 flex items-center justify-between hover:border-primary transition-all group">
                      <div className="flex items-center gap-3">
                        <FileText size={24} className="text-primary" />
                        <div>
                          <p className="text-sm font-bold text-on-surface">{doc.label}</p>
                          <p className="text-[10px] text-outline-variant uppercase tracking-widest">{doc.req ? "Required" : "Optional"}</p>
                        </div>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-xs font-bold group-hover:bg-primary group-hover:text-white transition-all">
                        <Upload size={14} /> Upload
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 pt-6">
                  <button onClick={prevStep} className="px-8 py-3 rounded-full border border-outline-variant/30 font-bold text-sm">Back</button>
                  <button onClick={nextStep} className="flex-grow py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20">Review & Pay</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
