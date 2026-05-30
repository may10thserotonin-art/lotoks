import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, GraduationCap, Briefcase, Home, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { apiFetch } from '@/lib/api';

const SERVICE_CARDS = [
  {
    type: 'visa',
    label: 'Visa Sponsorship',
    description: 'Work permit and visa application document requirements.',
    icon: Plane,
    color: 'from-blue-600/20 to-blue-800/10 border-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    type: 'education',
    label: 'Education & Scholarships',
    description: 'University admission and scholarship application documents.',
    icon: GraduationCap,
    color: 'from-purple-600/20 to-purple-800/10 border-purple-500/20',
    iconColor: 'text-purple-400',
  },
  {
    type: 'job',
    label: 'Job Placement',
    description: 'Employment and work placement documentation checklist.',
    icon: Briefcase,
    color: 'from-gold/20 to-amber-800/10 border-gold/20',
    iconColor: 'text-gold',
  },
  {
    type: 'residence',
    label: 'Permanent Residence',
    description: 'PR application requirements and supporting documents.',
    icon: Home,
    color: 'from-green-600/20 to-green-800/10 border-green-500/20',
    iconColor: 'text-green-400',
  },
];

export function AdminRequirementsListPage() {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminRequirements'],
    queryFn: async () => {
      const res = await apiFetch('/admin/requirements');
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-white">Requirements Manager</h1>
        <p className="text-white/50 text-sm mt-1">Edit required documents and categories for each service type.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>
      ) : error ? (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red/10 border border-red/20 text-red/80">
          <AlertTriangle className="w-5 h-5" /><span className="text-sm">Failed to load requirements.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {SERVICE_CARDS.map((card, i) => {
            const Icon = card.icon;
            const count = (data as Record<string, { categories?: unknown[] }>)?.[card.type]?.categories?.length ?? '—';
            return (
              <motion.button
                key={card.type}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/admin/requirements/${card.type}`)}
                className={`text-left p-6 rounded-2xl bg-gradient-to-br border transition-all group ${card.color}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-white/10 ${card.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className={`w-5 h-5 ${card.iconColor} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200`} />
                </div>
                <h2 className="text-lg font-heading font-bold text-white mb-1">{card.label}</h2>
                <p className="text-white/50 text-sm mb-4">{card.description}</p>
                <div className="flex items-center gap-1.5">
                  <span className={`text-sm font-semibold ${card.iconColor}`}>{String(count)}</span>
                  <span className="text-white/40 text-sm">categories configured</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
