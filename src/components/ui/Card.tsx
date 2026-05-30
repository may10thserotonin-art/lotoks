
import { motion, HTMLMotionProps } from 'framer-motion';
import React, { ReactNode } from 'react';

type CardVariant = 'glass' | 'elevated' | 'image' | 'stat' | 'process-step';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: CardVariant;
  hoverable?: boolean;
  clickable?: boolean;
  className?: string;
}

const cardVariants = {
  glass: 'bg-navy/70 backdrop-blur-xl border border-gold/20 text-white',
  elevated: 'bg-white shadow-lg border border-transparent hover:border-gold/30',
  image: 'relative overflow-hidden bg-navy',
  stat: 'bg-navy/5 border border-navy/10 text-center',
  'process-step': 'bg-white border-2 border-dashed border-navy/20',
};

const hoverEffects = {
  glass: 'hover:border-gold/40 hover:shadow-xl hover:shadow-gold/10',
  elevated: 'hover:shadow-xl hover:shadow-gold/20 hover:-translate-y-1',
  image: '',
  stat: 'hover:border-gold/30 hover:shadow-lg',
  'process-step': 'hover:border-gold hover:shadow-lg',
};

// Glass Card - Semi-transparent navy with backdrop blur
interface GlassCardProps extends CardProps {
  variant?: 'glass';
}

export function GlassCard({ 
  children, 
  variant = 'glass', 
  hoverable = true,
  className = '',
  ...props 
}: GlassCardProps) {
  return (
    <motion.div
      className={`
        rounded-2xl p-6 md:p-8 
        ${cardVariants[variant]} 
        ${hoverable ? hoverEffects[variant] : ''}
        transition-all duration-300
        ${className}
      `}
      whileHover={hoverable ? { y: -4, transition: { duration: 0.3 } } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Elevated White Card - White background with navy shadow
interface ElevatedCardProps extends CardProps {
  variant?: 'elevated';
}

export function ElevatedCard({ 
  children, 
  variant = 'elevated', 
  hoverable = true,
  className = '',
  ...props 
}: ElevatedCardProps) {
  return (
    <motion.div
      className={`
        rounded-2xl p-6 md:p-8 
        ${cardVariants[variant]} 
        ${hoverable ? hoverEffects[variant] : ''}
        transition-all duration-300
        ${className}
      `}
      whileHover={hoverable ? { y: -4, transition: { duration: 0.3 } } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Image Card - With background image and overlay
interface ImageCardProps extends CardProps {
  variant?: 'image';
  imageUrl?: string;
  overlay?: boolean;
}

export function ImageCard({ 
  children, 
  variant = 'image',
  imageUrl,
  overlay = true,
  hoverable = true,
  className = '',
  ...props 
}: ImageCardProps) {
  return (
    <motion.div
      className={`
        rounded-2xl overflow-hidden relative
        ${cardVariants[variant]}
        ${hoverable ? 'cursor-pointer' : ''}
        group
        ${className}
      `}
      whileHover={hoverable ? { y: -4, transition: { duration: 0.3 } } : undefined}
      {...props}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
      )}
      <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-end">
        {children}
      </div>
    </motion.div>
  );
}

// Stat Card - Minimal with large number
type StatCardProps = {
  children?: React.ReactNode;
  variant?: 'stat';
  number: React.ReactNode;
  label: string;
  suffix?: string;
  hoverable?: boolean;
  className?: string;
} & Omit<HTMLMotionProps<'div'>, 'children'>;

export function StatCard({ 
  children, 
  variant = 'stat',
  number,
  label,
  suffix,
  hoverable = false,
  className = '',
  ...props 
}: StatCardProps) {
  return (
    <motion.div
      className={`
        rounded-2xl p-6 md:p-8 
        ${cardVariants[variant]} 
        ${hoverable ? hoverEffects[variant] : ''}
        transition-all duration-300
        ${className}
      `}
      {...props}
    >
      <div className="text-4xl md:text-5xl font-bold text-gold mb-2">
        {number}{suffix && <span className="text-2xl">{suffix}</span>}
      </div>
      <div className="text-navy/70 font-medium">{label}</div>
    </motion.div>
  );
}

// Process Step Card - Numbered with connecting line
interface ProcessStepCardProps extends CardProps {
  variant?: 'process-step';
  stepNumber: number;
  title: string;
  description: string;
  isLast?: boolean;
}

export function ProcessStepCard({ 
  children, 
  variant = 'process-step',
  stepNumber,
  title,
  description,
  isLast = false,
  className = '',
  ...props 
}: ProcessStepCardProps) {
  return (
    <div className={`relative flex gap-6 ${className}`}>
      {/* Number Circle */}
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold text-navy font-bold flex items-center justify-center text-lg shadow-lg shadow-gold/30">
        {stepNumber}
      </div>
      
      {/* Content */}
      <motion.div
        className={`
          rounded-xl p-5 flex-1
          ${cardVariants[variant]}
          ${hoverEffects[variant]}
          transition-all duration-300
        `}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        {...props}
      >
        <h4 className="font-heading font-bold text-navy text-lg mb-2">{title}</h4>
        <p className="text-navy/70 text-sm">{description}</p>
      </motion.div>
    </div>
  );
}

// Main Card component that renders the appropriate variant
interface MainCardProps extends CardProps {
  variant?: CardVariant;
  imageUrl?: string;
  overlay?: boolean;
}

export function Card({ 
  children, 
  variant = 'glass',
  hoverable = true,
  className = '',
  ...props 
}: MainCardProps) {
  switch (variant) {
    case 'glass':
      return <GlassCard variant="glass" hoverable={hoverable} className={className} {...props}>{children}</GlassCard>;
    case 'elevated':
      return <ElevatedCard variant="elevated" hoverable={hoverable} className={className} {...props}>{children}</ElevatedCard>;
    case 'image':
      return <ImageCard variant="image" hoverable={hoverable} className={className} {...props}>{children}</ImageCard>;
    default:
      return <GlassCard variant="glass" hoverable={hoverable} className={className} {...props}>{children}</GlassCard>;
  }
}