import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Mail,
  Lock,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Terminal,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/Button';
import { grantDevAccess, useDevAuthRestore, DEV_PIN } from '@/hooks/useDevAuth';
import { validateEmail } from '@/lib/validation';

// ── Developer PIN Modal (preserved from original) ──
function DevPinModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setTimeout(() => pinRefs.current[0]?.focus(), 100);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...pin];
    next[index] = value.slice(-1);
    setPin(next);
    setIsError(false);
    if (value && index < 5) pinRefs.current[index + 1]?.focus();
    if (index === 5 && value) {
      const code = [...next.slice(0, 5), value].join('');
      verify(code);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    const next = [...pin];
    data.forEach((d, i) => { if (i < 6) next[i] = d; });
    setPin(next);
    pinRefs.current[Math.min(data.length, 5)]?.focus();
    if (data.length === 6) verify(data.join(''));
  };

  const verify = (code: string) => {
    if (code === DEV_PIN) {
      setIsSuccess(true);
      grantDevAccess();
      setTimeout(() => navigate('/dashboard'), 800);
    } else {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        setPin(['', '', '', '', '', '']);
        pinRefs.current[0]?.focus();
      }, 600);
    }
  };

  const handleSubmit = () => verify(pin.join(''));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(11,29,58,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0B1D3A', border: '1px solid rgba(201,164,75,0.3)' }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(201,164,75,0.15)' }}
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4" style={{ color: '#C9A44B' }} />
            <span className="text-sm font-semibold" style={{ color: '#C9A44B' }}>
              Developer Preview
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-8 text-center">
          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <ShieldCheck className="w-12 h-12" style={{ color: '#C9A44B' }} />
              <p className="text-white font-semibold">Access Granted</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Redirecting to dashboard...
              </p>
            </motion.div>
          ) : (
            <>
              <p className="text-white font-semibold mb-1">Enter Developer PIN</p>
              <p className="text-xs mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
                6-digit access code required
              </p>

              <div
                className={`flex justify-center gap-2 mb-6 ${isError ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}
              >
                {pin.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { pinRefs.current[i] = el; }}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    aria-label={`PIN digit ${i + 1}`}
                    className="w-11 h-13 text-center text-lg font-bold rounded-lg outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: `2px solid ${isError ? '#D14B4B' : digit ? '#C9A44B' : 'rgba(255,255,255,0.15)'}`,
                      color: '#FFFFFF',
                      height: '3.25rem',
                    }}
                  />
                ))}
              </div>

              {isError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs mb-4 font-medium"
                  style={{ color: '#D14B4B' }}
                >
                  Incorrect PIN. Please try again.
                </motion.p>
              )}

              <button
                onClick={handleSubmit}
                disabled={pin.some((d) => !d)}
                className="w-full py-3 rounded-full text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: '#C9A44B', color: '#0B1D3A' }}
              >
                Unlock Preview
              </button>

              <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
                For internal use only
              </p>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Login Page ──
export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const { login, user, isLoading, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Rehydrate dev session on mount
  useDevAuthRestore();

  // Redirect if already logged in
  const isEmailValid = email === '' || validateEmail(email);

  React.useEffect(() => {
    if (user && !isLoading) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, isLoading, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
              Welcome Back
            </h2>
            <p className="text-sm text-white/60 text-center mb-8">
              Sign in to your account to continue
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

            {/* Login Form */}
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

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-white/70">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-gold hover:underline font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold transition-colors"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full flex items-center justify-center"
                disabled={isSubmitting || email === '' || password === '' || !validateEmail(email)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white/50">
                Don&apos;t have an account?{' '}
                <Link to={`/register${redirectTo !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="text-gold hover:underline font-medium">
                  Sign Up
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
            <div className="mt-3 text-center">
              <Link
                to="/admin/login"
                className="text-xs text-white/30 hover:text-gold transition-colors"
              >
                Admin Login
              </Link>
            </div>
          </motion.div>

          {/* Developer Preview Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowDevModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              <Terminal className="w-3 h-3" />
              Developer Preview
            </button>
          </div>
        </motion.div>
      </div>

      {/* Developer PIN Modal */}
      <AnimatePresence>
        {showDevModal && <DevPinModal onClose={() => setShowDevModal(false)} />}
      </AnimatePresence>
    </>
  );
}
