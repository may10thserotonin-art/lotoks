import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      {icon && (
        <div className="mb-6 p-5 rounded-full bg-white/5 text-white/30">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-heading font-semibold text-white mb-2">{title}</h3>
      {message && <p className="text-white/50 text-sm max-w-sm mb-6">{message}</p>}
      {action && <div>{action}</div>}
    </motion.div>
  );
}
