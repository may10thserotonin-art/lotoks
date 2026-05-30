/**
 * Shared authentication input validation helpers.
 */

/**
 * Validates whether an email address format is correct.
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export interface PasswordRules {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  isValid: boolean;
}

/**
 * Validates password strength requirements:
 * - At least 8 characters long
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 numeric digit
 */
export function validatePasswordStrength(password: string): PasswordRules {
  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isValid = rules.length && rules.uppercase && rules.lowercase && rules.number;

  return {
    ...rules,
    isValid,
  };
}
