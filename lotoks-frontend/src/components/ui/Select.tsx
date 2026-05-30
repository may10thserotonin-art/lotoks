import { useId, useState } from 'react';
import { motion } from 'framer-motion';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  /** Radix-UI style callback – receives the selected value string */
  onValueChange?: (value: string) => void;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder = 'Select an option',
  value,
  onValueChange,
  onChange,
  className = '',
  disabled = false,
  id,
}: SelectProps) {
  const [isFocused, setIsFocused] = useState(false);
  const generatedId = useId();
  const selectId = id || generatedId;

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    onChange?.(e);
    onValueChange?.(e.target.value);
  };

  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={selectId}
          className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
            isFocused ? 'text-gold' : 'text-navy/70'
          }`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-3 rounded-lg appearance-none
            bg-white border-2
            transition-all duration-200 cursor-pointer
            ${
              error
                ? 'border-red focus:border-red'
                : isFocused
                ? 'border-gold focus:border-gold'
                : 'border-navy/20 hover:border-navy/30 focus:border-gold'
            }
            focus:outline-none focus:ring-2 focus:ring-gold/20
            text-navy disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-navy/40">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red text-sm mt-1 flex items-center gap-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
