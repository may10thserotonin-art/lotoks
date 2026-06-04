import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Globe,
  Lock,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { apiFetch, apiJson } from '@/lib/api';
import { validatePasswordStrength } from '@/lib/validation';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rules = validatePasswordStrength(password);
  const isPasswordStrong = rules.isValid;
  const isPasswordMatching = password === confirmPassword;

  // Redirect if no token
  React.useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new one.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Missing reset token. Please request a new reset link.');
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
    setSuccess('');
    try {
      const res = await apiFetch('/auth/user/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
      const data = await apiJson(res);
      if (res.ok) {
        setSuccess('Password updated successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allFieldsFilled = password && confirmPassword;

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
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
            Reset Password
          </h2>
          <p className="text-sm text-white/60 text-center mb-8">
            Choose a new password for your account
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

          {/* Success */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg flex flex-col items-center text-center"
            >
              <CheckCircle className="w-10 h-10 text-teal-400 mb-2" />
              <span className="text-teal-200 text-sm font-medium">
                {success}
              </span>
              <span className="text-teal-300/70 text-xs mt-1">
                Redirecting to sign in...
              </span>
            </motion.div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  New Password
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
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold transition-colors"
                    disabled={isSubmitting}
                    required
                  />
                </div>
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
                  Confirm New Password
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
                    placeholder="Repeat new password"
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
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full flex items-center justify-center"
                disabled={
                  isSubmitting ||
                  !allFieldsFilled ||
                  !isPasswordStrong ||
                  !isPasswordMatching
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center border-t border-white/10 pt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-sm text-gold hover:underline font-medium"
            >
              ← Back to Sign In
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
