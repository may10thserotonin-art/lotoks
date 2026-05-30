

import React, { useState, useId } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="relative">
      {label && (
        <label 
          htmlFor={inputId} 
          className={`
            block text-sm font-medium mb-2 transition-colors duration-200
            ${isFocused ? 'text-gold' : 'text-navy/70'}
          `}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full px-4 py-3 rounded-lg
            bg-white border-2 
            transition-all duration-200
            ${icon ? 'pl-12' : ''}
            ${error 
              ? 'border-red focus:border-red focus:ring-2 focus:ring-red/20' 
              : isFocused 
                ? 'border-gold focus:border-gold focus:ring-2 focus:ring-gold/20' 
                : 'border-navy/20 hover:border-navy/30 focus:border-gold'
            }
            focus:outline-none focus:ring-2 focus:ring-gold/20
            placeholder:text-navy/40
            text-navy
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red text-sm mt-1 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className = '',
  id,
  ...props
}: TextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <div className="relative">
      {label && (
        <label 
          htmlFor={textareaId} 
          className={`
            block text-sm font-medium mb-2 transition-colors duration-200
            ${isFocused ? 'text-gold' : 'text-navy/70'}
          `}
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`
          w-full px-4 py-3 rounded-lg
          bg-white border-2 
          transition-all duration-200
          resize-none
          ${error 
            ? 'border-red focus:border-red focus:ring-2 focus:ring-red/20' 
            : isFocused 
              ? 'border-gold focus:border-gold focus:ring-2 focus:ring-gold/20' 
              : 'border-navy/20 hover:border-navy/30 focus:border-gold'
          }
          focus:outline-none focus:ring-2 focus:ring-gold/20
          placeholder:text-navy/40
          text-navy
          ${className}
        `}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red text-sm mt-1 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder = 'Select an option',
  className = '',
  id,
  ...props
}: SelectProps) {
  const [isFocused, setIsFocused] = useState(false);
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className="relative">
      {label && (
        <label 
          htmlFor={selectId} 
          className={`
            block text-sm font-medium mb-2 transition-colors duration-200
            ${isFocused ? 'text-gold' : 'text-navy/70'}
          `}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`
            w-full px-4 py-3 rounded-lg appearance-none
            bg-white border-2 
            transition-all duration-200
            cursor-pointer
            ${error 
              ? 'border-red focus:border-red' 
              : isFocused 
                ? 'border-gold focus:border-gold' 
                : 'border-navy/20 hover:border-navy/30 focus:border-gold'
            }
            focus:outline-none focus:ring-2 focus:ring-gold/20
            text-navy
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
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
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}
    </div>
  );
}

// Checkbox component
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export function Checkbox({ label, className = '', id, ...props }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id || generatedId;

  return (
    <label 
      htmlFor={checkboxId} 
      className={`flex items-center gap-3 cursor-pointer group ${className}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          id={checkboxId}
          className="sr-only peer"
          {...props}
        />
        <div className="w-5 h-5 border-2 border-navy/30 rounded transition-all duration-200 peer-checked:border-gold peer-checked:bg-gold group-hover:border-gold/50">
          <svg 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-navy opacity-0 peer-checked:opacity-100 transition-opacity" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <span className="text-navy/80 text-sm group-hover:text-navy transition-colors">
        {label}
      </span>
    </label>
  );
}

// Radio Group component
interface RadioGroupProps {
  name: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
}

export function RadioGroup({
  name,
  options,
  selectedValue,
  onChange,
  label,
  error,
}: RadioGroupProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-3 text-navy/70">
          {label}
        </label>
      )}
      <div className="space-y-3">
        {options.map((option) => (
          <label 
            key={option.value} 
            className={`
              flex items-center gap-3 cursor-pointer group
              p-3 rounded-lg border-2 transition-all duration-200
              ${selectedValue === option.value 
                ? 'border-gold bg-gold/5' 
                : 'border-navy/20 hover:border-gold/30'
              }
            `}
          >
            <div className="relative">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => onChange(option.value)}
                className="sr-only peer"
              />
              <div className={`
                w-5 h-5 rounded-full border-2 transition-all duration-200
                ${selectedValue === option.value 
                  ? 'border-gold' 
                  : 'border-navy/30 group-hover:border-gold/50'
                }
              `}>
                {selectedValue === option.value && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gold" />
                )}
              </div>
            </div>
            <span className="text-navy/80 text-sm group-hover:text-navy transition-colors">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

// Form Field wrapper with animation
interface FormFieldProps {
  children: ReactNode;
  className?: string;
}

export function FormField({ children, className = '' }: FormFieldProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}