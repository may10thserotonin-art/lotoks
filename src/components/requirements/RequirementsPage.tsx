'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Globe, GraduationCap, Briefcase, Home, ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';
import { GlassCard } from '@/components/ui/Card';
import { fadeUpVariant, staggerContainer } from '@/components/ui/AnimationUtils';

const REQUIREMENTS = [
  {
    id: 'visa',
    icon: Globe,
    title: 'Visa Sponsorship',
    color: 'text-teal',
    accent: 'border-teal/30',
    bg: 'bg-teal/10',
    description: 'Documents required to apply for a sponsored work or travel visa through Lotoks.',
    items: [
      'Valid international passport (minimum 6 months validity)',
      'Recent passport-size photographs (white background)',
      'Completed Lotoks visa application form',
      'Proof of employment / offer letter from sponsor',
      'Bank statements (last 3–6 months)',
      'Educational certificates and transcripts',
      'CV / résumé (updated)',
      'Medical fitness certificate',
      'Police clearance / background check',
      'Proof of accommodation in destination country',
    ],
  },
  {
    id: 'education',
    icon: GraduationCap,
    title: 'Education Scholarship',
    color: 'text-gold',
    accent: 'border-gold/30',
    bg: 'bg-gold/10',
    description: 'Requirements for scholarship and university admission applications facilitated by Lotoks.',
    items: [
      'Valid international passport',
      'Official academic transcripts (certified copies)',
      'Secondary school / university leaving certificate',
      'Statement of Purpose (SOP) — 500–1 000 words',
      'Two academic reference letters',
      'English language proficiency result (IELTS / TOEFL)',
      'CV / résumé',
      'Research proposal (postgraduate applicants)',
      'Financial sponsorship evidence or scholarship award letter',
      'Completed institution application form',
    ],
  },
  {
    id: 'job',
    icon: Briefcase,
    title: 'Job Placement',
    color: 'text-primary',
    accent: 'border-primary/30',
    bg: 'bg-primary/10',
    description: 'Documents needed to be matched with international employers offering work sponsorship.',
    items: [
      'Valid international passport',
      'Updated CV / résumé (Lotoks template recommended)',
      'Cover letter tailored to target role',
      'Educational certificates and professional qualifications',
      'Work experience letters / employment history',
      'Professional reference letters (at least 2)',
      'LinkedIn profile URL (optional but recommended)',
      'Trade test or skills assessment certificate (where applicable)',
      'Medical fitness certificate',
      'Police clearance / background check',
    ],
  },
  {
    id: 'residence',
    icon: Home,
    title: 'Permanent Residence',
    color: 'text-secondary',
    accent: 'border-secondary/30',
    bg: 'bg-secondary/10',
    description: 'Checklist for applicants pursuing permanent residency or citizenship pathways.',
    items: [
      'Valid international passport (all previous passports if available)',
      'Birth certificate (original or certified copy)',
      'Marriage / divorce certificate (if applicable)',
      'Police clearance from all countries of residence (past 10 years)',
      'Medical examination report from approved physician',
      'Proof of language proficiency',
      'Employment or business records (last 5 years)',
      'Tax returns / proof of income',
      'Bank statements and proof of funds',
      'Biometric data (fingerprints and photograph)',
    ],
  },
];

function RequirementCard({ req, index }: { req: typeof REQUIREMENTS[0]; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const Icon = req.icon;

  return (
    <motion.div
      variants={fadeUpVariant}
      className="w-full"
    >
      <GlassCard className="overflow-hidden p-0">
        {/* Header */}
        <button
          onClick={() => setOpen((o) => !o)}
          className={`w-full flex items-center gap-4 p-6 text-left transition-colors hover:bg-white/5 ${open ? 'border-b border-white/10' : ''}`}
        >
          <div className={`w-12 h-12 rounded-xl ${req.bg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${req.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-heading font-bold text-white">{req.title}</h2>
            <p className="text-white/50 text-sm mt-0.5">{req.description}</p>
          </div>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <ChevronDown className="w-5 h-5 text-white/40" />
          </motion.div>
        </button>

        {/* Checklist */}
        {open && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {req.items.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-start gap-3 text-sm text-white/75"
              >
                <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${req.color}`} />
                {item}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </GlassCard>
    </motion.div>
  );
}

export default function RequirementsPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />

      {/* Page Hero */}
      <section className="pt-32 pb-16 px-4 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-navy/90" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6"
          >
            <CheckCircle className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold">Document Checklist</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-4"
          >
            Application <span className="text-gold">Requirements</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg"
          >
            Complete document checklists for every programme we offer. Prepare your documents in advance to speed up your application.
          </motion.p>
        </div>
      </section>

      {/* Requirements List */}
      <section className="py-16 px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto flex flex-col gap-6"
        >
          {REQUIREMENTS.map((req, index) => (
            <RequirementCard key={req.id} req={req} index={index} />
          ))}
        </motion.div>
      </section>

      {/* Note */}
      <section className="pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="border-gold/20 bg-gold/5">
            <p className="text-white/70 text-sm leading-relaxed">
              <span className="text-gold font-semibold">Note: </span>
              Requirements may vary depending on your nationality and the destination country. Our team will provide a personalised checklist after reviewing your application.
              For questions, visit our{' '}
              <a href="/contact" className="text-gold underline hover:text-gold/80 transition-colors">Contact page</a>
              {' '}or use the live chat support below.
            </p>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </main>
  );
}
