
import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

// Fade Up Animation - triggered once on scroll
export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

// Fade Up with Stagger
export const fadeUpStaggerVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

// Scale In Animation
export const scaleInVariant: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

// Slide In from Left
export const slideInLeftVariant: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

// Slide In from Right
export const slideInRightVariant: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

// Card Hover Animation
export const cardHoverVariant = {
  rest: { y: 0, scale: 1 },
  hover: { 
    y: -4, 
    scale: 1.02,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

// Button Tap Animation
export const buttonTapVariant = {
  rest: { scale: 1 },
  tap: { scale: 0.97, transition: { duration: 0.1 } },
  hover: { scale: 1.05, transition: { duration: 0.2 } }
};

// Number Counter Animation
export const numberCounterVariant: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 1, ease: 'easeOut' }
  }
};

// Stagger container for multiple children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Page transition variants
export const pageTransitionVariant: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

// Bounce animation for floating elements
export const bounceVariant: Variants = {
  rest: { y: 0 },
  animate: {
    y: [0, -8, 0],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'easeInOut'
    }
  }
};

// Pulse animation for CTAs
export const pulseVariant: Variants = {
  rest: { scale: 1 },
  animate: {
    scale: [1, 1.02, 1],
    boxShadow: [
      '0 0 0 0 rgba(201, 164, 75, 0)',
      '0 0 0 8px rgba(201, 164, 75, 0)',
      '0 0 0 0 rgba(201, 164, 75, 0)'
    ],
    transition: {
      repeat: Infinity,
      duration: 2
    }
  }
};

// Gradient border animation
export const gradientBorderVariant: Variants = {
  rest: { backgroundPosition: '0% 50%' },
  hover: { 
    backgroundPosition: '100% 50%',
    transition: { duration: 0.5 }
  }
};

// Skeleton loading variant
export const skeletonVariant: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'easeInOut'
    }
  }
};

// Motion components for common use
interface MotionProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
}

export function FadeInUp({ children, className, variants, delay = 0 }: MotionProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants || fadeUpVariant}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className, variants, delay = 0 }: MotionProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants || scaleInVariant}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
}

export function SlideInLeft({ children, className, variants, delay = 0 }: MotionProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants || slideInLeftVariant}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
}

export function SlideInRight({ children, className, variants, delay = 0 }: MotionProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants || slideInRightVariant}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
}