import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Globe,
  Mail,
  Loader2,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { apiFetch, apiJson } from '@/lib/api';
import { validateEmail } from '@/lib/validation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmailValid = email === '' || validateEmail(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const res = await apiFetch('/auth/user/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      const data = await apiJson(res);
      if (res.ok) {
        setSuccess(
          data.message ||
            'If that email exists, a password reset link has been sent.'
        );
      } else {
        setError(data.message || 'Failed to process request');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Forgot Password
          </h2>
          <p className="text-sm text-white/60 text-center mb-8">
            Enter your email to receive a reset link
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
              className="mb-4 p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg flex flex-col items-start"
            >
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-teal-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-teal-200 text-sm">{success}</span>
              </div>
            </motion.div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Enter your email"
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

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full flex items-center justify-center"
                disabled={isSubmitting || email === '' || !validateEmail(email)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-sm text-gold hover:underline font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
