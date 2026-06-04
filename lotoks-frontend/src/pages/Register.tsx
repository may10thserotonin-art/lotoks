import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Globe,
  Mail,
  Lock,
  User,
  Loader2,
  AlertTriangle,
  Check,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/Button';
import { validateEmail, validatePasswordStrength } from '@/lib/validation';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const { signup, user, isLoading } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rules = validatePasswordStrength(password);
  const isPasswordStrong = rules.isValid;
  const isPasswordMatching = password === confirmPassword;
  const isEmailValid = email === '' || validateEmail(email);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user && !isLoading) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, isLoading, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!isPasswordStrong) {
      setError('Password does not meet all strength requirements.');
      return;
    }
    if (!isPasswordMatching) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await signup(fullName.trim(), email, password);
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allFieldsFilled = fullName && email && password && confirmPassword;

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link to="/" className="flex items-center">
              <Globe className="w-8 h-8 text-gold" />
              <span className="text-2xl font-heading font-bold text-white ml-3">
                Lotoks<span className="text-gold">.</span>
              </span>
            </Link>
          </div>

          <h2 className="text-2xl font-heading font-bold text-white mb-2 text-center">
            Create Your Account
          </h2>
          <p className="text-sm text-white/60 text-center mb-8">
            Join Lotoks and start your global journey
          </p>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start"
            >
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-red-200 text-sm">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setError('');
                  }}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold transition-colors"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${
                    isEmailValid ? 'border-white/20' : 'border-red-400'
                  } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold transition-colors`}
                  disabled={isSubmitting}
                  required
                />
              </div>
              {!isEmailValid && (
                <span className="text-red-400 text-xs mt-1 block">
                  Please enter a valid email address
                </span>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold transition-colors"
                  disabled={isSubmitting}
                  required
                />
              </div>
              {/* Real-time strength tracker */}
              {password.length > 0 && (
                <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10 space-y-1.5 text-xs text-white/80">
                  <span className="font-semibold block mb-1">Password requirements:</span>
                  <div className="flex items-center space-x-2">
                    {rules.length ? <Check className="w-4 h-4 text-teal-400" /> : <X className="w-4 h-4 text-red-400" />}
                    <span className={rules.length ? 'text-teal-200' : 'text-white/60'}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {rules.uppercase ? <Check className="w-4 h-4 text-teal-400" /> : <X className="w-4 h-4 text-red-400" />}
                    <span className={rules.uppercase ? 'text-teal-200' : 'text-white/60'}>At least one uppercase letter (A-Z)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {rules.lowercase ? <Check className="w-4 h-4 text-teal-400" /> : <X className="w-4 h-4 text-red-400" />}
                    <span className={rules.lowercase ? 'text-teal-200' : 'text-white/60'}>At least one lowercase letter (a-z)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {rules.number ? <Check className="w-4 h-4 text-teal-400" /> : <X className="w-4 h-4 text-red-400" />}
                    <span className={rules.number ? 'text-teal-200' : 'text-white/60'}>At least one number (0-9)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Repeat your password"
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${
                    confirmPassword === '' || isPasswordMatching ? 'border-white/20' : 'border-red-400'
                  } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold transition-colors`}
                  disabled={isSubmitting}
                  required
                />
              </div>
              {confirmPassword !== '' && !isPasswordMatching && (
                <span className="text-red-400 text-xs mt-1 block">Passwords do not match</span>
              )}
              {confirmPassword !== '' && isPasswordMatching && isPasswordStrong && (
                <span className="text-teal-400 text-xs mt-1 block">Passwords match ✓</span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center mt-6"
              disabled={
                isSubmitting ||
                !allFieldsFilled ||
                !validateEmail(email) ||
                !isPasswordStrong ||
                !isPasswordMatching
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white/50">
              Already have an account?{' '}
              <Link to={`/login${redirectTo !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="text-gold hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-white/40 hover:text-white/70 transition-colors font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
