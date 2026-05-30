import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/store/adminAuth";
import { motion } from "framer-motion";
import { 
  Globe, 
  Mail, 
  Lock, 
  CheckCircle,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";
import { validateEmail } from "@/lib/validation";

export function AdminLoginPage() {
  const { login, isLoading, admin } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);

  const isEmailValid = email === "" || validateEmail(email);

  // Redirect if already logged in
  React.useEffect(() => {
    if (admin && !isLoading) {
      navigate("/admin/queue", { replace: true });
    }
  }, [admin, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await login(email, password);
      navigate("/admin/queue", { replace: true });
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await apiFetch("/admin/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message || "Reset link generated.");
      } else {
        setError(data.message || "Failed to process request");
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-navy"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center">
            <Globe className="w-8 h-8 text-gold" />
            <span className="text-2xl font-heading font-bold text-white ml-3">
              Lotoks<span className="text-gold">.</span>
            </span>
          </Link>
        </div>
        
        <h2 className="text-2xl font-heading font-bold text-white mb-6 text-center">
          {isForgotMode ? "Forgot Password" : "Admin Login"}
        </h2>
        
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

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg flex items-start"
          >
            <CheckCircle className="w-5 h-5 text-teal-400 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-teal-200 text-sm">{success}</span>
          </motion.div>
        )}
        
        {!isForgotMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${
                    isEmailValid ? "border-white/20" : "border-red-400"
                  } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold`}
                  disabled={isSubmitting}
                />
              </div>
              {!isEmailValid && (
                <span className="text-red-400 text-xs mt-1 block">Please enter a valid email address</span>
              )}
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-white/70">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(true);
                    setError("");
                    setSuccess("");
                  }}
                  className="text-xs text-gold hover:underline font-medium"
                  disabled={isSubmitting}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center"
              disabled={isSubmitting || email === "" || password === "" || !validateEmail(email)}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
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
                    setError("");
                  }}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${
                    isEmailValid ? "border-white/20" : "border-red-400"
                  } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold`}
                  disabled={isSubmitting}
                />
              </div>
              {!isEmailValid && (
                <span className="text-red-400 text-xs mt-1 block">Please enter a valid email address</span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center"
              disabled={isSubmitting || email === "" || !validateEmail(email)}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Requesting...
                </>
              ) : (
                "Request Reset Link"
              )}
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsForgotMode(false);
                  setError("");
                  setSuccess("");
                }}
                className="text-sm text-white/70 hover:text-white font-medium"
                disabled={isSubmitting}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
        
        <div className="mt-6 text-center text-white/50 border-t border-white/10 pt-4">
          <Link to="/login" className="text-white/60 hover:text-white text-sm">
            ← Back to User Login
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}