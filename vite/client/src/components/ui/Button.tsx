
import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'text' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

const variantStyles = {
  primary: `
    bg-gold text-navy font-semibold
    hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/30
    active:bg-gold/80
  `,
  secondary: `
    border-2 border-gold text-gold font-semibold
    hover:bg-gold/10 hover:border-gold
    active:bg-gold/20
  `,
  text: `
    text-gold underline underline-offset-4
    hover:text-gold/80 hover:underline
    active:text-gold/70
  `,
  ghost: `
    bg-transparent text-navy/80 font-medium
    hover:bg-navy/5 hover:text-navy
    active:bg-navy/10
  `,
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm rounded-md gap-2',
  md: 'px-6 py-3 text-base rounded-lg gap-2',
  lg: 'px-8 py-4 text-lg rounded-lg gap-3',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={`
        inline-flex items-center justify-center
        font-heading font-semibold
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      whileHover={!disabled ? { scale: variant === 'primary' ? 1.02 : 1 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg 
          className="animate-spin h-5 w-5" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </motion.button>
  );
}

// Icon Button for small actions
interface IconButtonProps extends HTMLMotionProps<'button'> {
  icon: ReactNode;
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const iconSizeStyles = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <motion.button
      className={`
        inline-flex items-center justify-center rounded-full
        ${variantStyles[variant]}
        ${iconSizeStyles[size]}
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
      {...props}
    >
      {icon}
    </motion.button>
  );
}

// Link button styled as text link
interface LinkButtonProps extends HTMLMotionProps<'a'> {
  children: ReactNode;
  variant?: 'text' | 'primary';
  className?: string;
}

export function LinkButton({
  children,
  variant = 'text',
  className = '',
  ...props
}: LinkButtonProps) {
  return (
    <motion.a
      className={`
        inline-flex items-center gap-2 font-medium
        ${variant === 'text' ? 'text-gold underline-offset-4 hover:underline' : 'text-gold'}
        ${className}
      `}
      whileHover={{ x: 4 }}
      {...props}
    >
      {children}
    </motion.a>
  );
}

// Floating Action Button
interface FABProps extends HTMLMotionProps<'button'> {
  icon: ReactNode;
  label: string;
  className?: string;
}

export function FAB({
  icon,
  label,
  className = '',
  ...props
}: FABProps) {
  return (
    <motion.button
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full bg-gold text-navy
        shadow-lg shadow-gold/30
        flex items-center justify-center
        hover:shadow-xl hover:shadow-gold/40
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
      {...props}
    >
      {icon}
    </motion.button>
  );
}