
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const router = useNavigate();
  const { login } = useAuthStore();
  const [view, setView] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);



  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setView("otp");
      setCountdown(60);
    }
  };

   const handleOtpChange = (index: number, value: string) => {
     if (!/^\d*$/.test(value)) return;
     
     const newOtp = [...otp];
     newOtp[index] = value.slice(-1);
     setOtp(newOtp);
     // Clear error state on any input change
     setIsError(false);
     setErrorMessage("");

     if (value && index < 5) {
       otpRefs.current[index + 1]?.focus();
     }
   };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

   const handlePaste = (e: React.ClipboardEvent) => {
     const data = e.clipboardData.getData("text").slice(0, 6).split("");
     if (data.every(char => /^\d$/.test(char))) {
       const newOtp = [...otp];
       data.forEach((char, i) => {
         if (i < 6) newOtp[i] = char;
       });
       setOtp(newOtp);
       setIsError(false);
       setErrorMessage("");
       otpRefs.current[Math.min(data.length, 5)]?.focus();
     }
   };

   const verifyOtp = () => {
     const code = otp.join("");
     if (code.length === 6 && code.endsWith("0")) {
       // Mock Success
       window.location.href = "/dashboard";
     } else {
       setIsError(true);
       setErrorMessage("Invalid verification code. Please try again.");
       setTimeout(() => {
         setIsError(false);
         setOtp(["", "", "", "", "", ""]);
         setErrorMessage("");
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
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md card p-8 bg-white border border-outline-variant/30 rounded-2xl shadow-xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">Lotoks<span>.</span></h2>
          <p className="text-sm text-on-surface-variant font-medium">Expertise in Motion</p>
        </div>

        <AnimatePresence mode="wait">
          {view === "email" ? (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h4 className="text-xl font-bold text-on-surface mb-6">Welcome Back</h4>
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Email Address</label>
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
                <button type="submit" className="w-full py-4 rounded-full bg-primary text-white font-bold hover:bg-primary-dim transition-all shadow-lg shadow-primary/20">
                  Send Verification Code
                </button>
                <p className="text-[10px] text-center text-outline-variant leading-relaxed uppercase tracking-tighter">
                  By signing in, you agree to our <span className="text-primary font-bold">Terms of Service</span> and <span className="text-primary font-bold">Privacy Policy</span>.
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
              <button onClick={() => setView("email")} className="mb-6 flex items-center gap-2 text-xs font-bold text-outline-variant hover:text-primary transition-colors">
                <ArrowLeft size={16} /> Change Email
              </button>
               <h4 className="text-xl font-bold text-on-surface mb-2">Verify Identity</h4>
               <p className="text-sm text-on-surface-variant mb-8">We've sent a 6-digit code to <span className="text-primary font-bold">{email}</span></p>
               
               {/* Screen reader live region for error announcements */}
               <div 
                 aria-live="polite" 
                 aria-atomic="true" 
                 className="sr-only"
               >
                 {errorMessage}
               </div>

               <div 
                 className={`flex justify-between gap-2 mb-8 ${isError ? "shake-input" : ""}`}
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
                     aria-describedby={isError ? "otp-error" : undefined}
                     className={`w-12 h-14 text-center text-xl font-bold rounded-xl bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none ${isError ? "border-error text-error" : ""}`}
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
                Verify & Continue
              </button>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-xs text-outline-variant">Resend code in <span className="text-primary font-bold">{countdown}s</span></p>
                ) : (
                  <button onClick={() => setCountdown(60)} className="flex items-center gap-2 mx-auto text-xs font-bold text-primary hover:underline">
                    <RefreshCw size={14} /> Resend Code
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
