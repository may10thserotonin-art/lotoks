
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, RefreshCw, Terminal, X, ShieldCheck } from 'lucide-react';
import { grantDevAccess, useDevAuthRestore, DEV_PIN } from '@/hooks/useDevAuth';

// â”€â”€ Developer PIN Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    // Auto-verify when last digit filled
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
        {/* Header */}
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

        {/* Body */}
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

              {/* PIN inputs */}
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

// â”€â”€ Main Login Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function LoginPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [showDevModal, setShowDevModal] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Rehydrate dev session on mount
  useDevAuthRestore();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setView('otp');
      setCountdown(60);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setIsError(false);
    setErrorMessage('');
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData('text').slice(0, 6).split('');
    if (data.every((char) => /^\d$/.test(char))) {
      const newOtp = [...otp];
      data.forEach((char, i) => { if (i < 6) newOtp[i] = char; });
      setOtp(newOtp);
      setIsError(false);
      setErrorMessage('');
      otpRefs.current[Math.min(data.length, 5)]?.focus();
    }
  };

  const verifyOtp = () => {
    const code = otp.join('');
    if (code.length === 6 && code.endsWith('0')) {
      window.location.href = '/dashboard';
    } else {
      setIsError(true);
      setErrorMessage('Invalid verification code. Please try again.');
      setTimeout(() => {
        setIsError(false);
        setOtp(['', '', '', '', '', '']);
        setErrorMessage('');
        otpRefs.current[0]?.focus();
      }, 500);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <>
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md card p-8 bg-white border border-outline-variant/30 rounded-2xl shadow-xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">
              Lotoks<span>.</span>
            </h2>
            <p className="text-sm text-on-surface-variant font-medium">Expertise in Motion</p>
          </div>

          <AnimatePresence mode="wait">
            {view === 'email' ? (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h4 className="text-xl font-bold text-on-surface mb-6">Welcome Back</h4>
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                        placeholder="name@company.com"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-primary text-white font-bold hover:bg-primary-dim transition-all shadow-lg shadow-primary/20"
                  >
                    Send Verification Code
                  </button>
                  <p className="text-[10px] text-center text-outline-variant leading-relaxed uppercase tracking-tighter">
                    By signing in, you agree to our{' '}
                    <span className="text-primary font-bold">Terms of Service</span> and{' '}
                    <span className="text-primary font-bold">Privacy Policy</span>.
                  </p>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => setView('email')}
                  className="mb-6 flex items-center gap-2 text-xs font-bold text-outline-variant hover:text-primary transition-colors"
                >
                  <ArrowLeft size={16} /> Change Email
                </button>
                <h4 className="text-xl font-bold text-on-surface mb-2">Verify Identity</h4>
                <p className="text-sm text-on-surface-variant mb-8">
                  We&apos;ve sent a 6-digit code to{' '}
                  <span className="text-primary font-bold">{email}</span>
                </p>

                <div aria-live="polite" aria-atomic="true" className="sr-only">
                  {errorMessage}
                </div>

                <div
                  className={`flex justify-between gap-2 mb-8 ${isError ? 'shake-input' : ''}`}
                  role="group"
                  aria-label="Verification code input"
                >
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={handlePaste}
                      aria-label={`Digit ${i + 1} of verification code`}
                      aria-invalid={isError}
                      aria-describedby={isError ? 'otp-error' : undefined}
                      className={`w-12 h-14 text-center text-xl font-bold rounded-xl bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none ${
                        isError ? 'border-error text-error' : ''
                      }`}
                    />
                  ))}
                </div>

                {isError && (
                  <p id="otp-error" className="text-error text-sm text-center mb-4" role="alert">
                    Invalid code. Please check and try again.
                  </p>
                )}

                <button
                  onClick={verifyOtp}
                  className="w-full py-4 rounded-full bg-primary text-white font-bold hover:bg-primary-dim transition-all shadow-lg shadow-primary/20 mb-6"
                >
                  Verify &amp; Continue
                </button>

                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-xs text-outline-variant">
                      Resend code in <span className="text-primary font-bold">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={() => setCountdown(60)}
                      className="flex items-center gap-2 mx-auto text-xs font-bold text-primary hover:underline"
                    >
                      <RefreshCw size={14} /> Resend Code
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Developer Preview Link â€” subtle, at bottom */}
          <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <button
              onClick={() => setShowDevModal(true)}
              className="flex items-center gap-1.5 mx-auto text-xs font-medium transition-colors hover:opacity-80"
              style={{ color: 'rgba(107,114,128,0.6)' }}
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

