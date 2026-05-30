import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Globe, 
  Lock, 
  CheckCircle,
  AlertTriangle,
  Loader2,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";
import { validatePasswordStrength } from "@/lib/validation";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength checks
  const rules = validatePasswordStrength(password);
  const isPasswordStrong = rules.isValid;
  const isPasswordMatching = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Reset token is missing. Please request a new link.");
      return;
    }
    if (!isPasswordStrong) {
      setError("Password does not meet the complexity requirements.");
      return;
    }
    if (!isPasswordMatching) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const response = await apiFetch("/admin/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(data.message || "Password updated successfully!");
        setPassword("");
        setConfirmPassword("");
        
        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/admin/login", { replace: true });
        }, 3000);
      } else {
        setError(data.message || "Invalid or expired reset token.");
      }
    } catch (err: any) {
      setError(err.message || "Network error. Failed to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center bg-navy px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl text-center"
        >
          <div className="flex justify-center mb-6">
            <Link to="/" className="flex items-center">
              <Globe className="w-8 h-8 text-gold" />
              <span className="text-2xl font-heading font-bold text-white ml-3">
                Lotoks<span className="text-gold">.</span>
              </span>
            </Link>
          </div>

          <h2 className="text-2xl font-heading font-bold text-white mb-6">
            Reset Password
          </h2>

          <div className="flex flex-col items-center justify-center space-y-4 mb-6">
            <div className="p-3 bg-red-500/10 rounded-full border border-red-500/30">
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Missing reset token. Please request a new password reset link from the login page.
            </p>
          </div>

          <div className="border-t border-white/10 pt-4">
            <Link to="/admin/login">
              <Button variant="primary" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-navy py-12 px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl"
      >
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
        <p className="text-sm text-white/60 text-center mb-6">Create a secure new password for your account.</p>

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

        <form onSubmit={handleSubmit} className="space-y-4">
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
                  setError("");
                }}
                placeholder="Enter new password"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold"
                disabled={isSubmitting}
                required
              />
            </div>
            {password.length > 0 && (
              <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10 space-y-1.5 text-xs text-white/80">
                <span className="font-semibold block mb-1">Complexity rules:</span>
                <div className="flex items-center space-x-2">
                  {rules.length ? <Check className="w-4 h-4 text-teal-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span className={rules.length ? "text-teal-200" : "text-white/60"}>At least 8 characters</span>
                </div>
                <div className="flex items-center space-x-2">
                  {rules.uppercase ? <Check className="w-4 h-4 text-teal-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span className={rules.uppercase ? "text-teal-200" : "text-white/60"}>At least one uppercase (A-Z)</span>
                </div>
                <div className="flex items-center space-x-2">
                  {rules.lowercase ? <Check className="w-4 h-4 text-teal-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span className={rules.lowercase ? "text-teal-200" : "text-white/60"}>At least one lowercase (a-z)</span>
                </div>
                <div className="flex items-center space-x-2">
                  {rules.number ? <Check className="w-4 h-4 text-teal-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span className={rules.number ? "text-teal-200" : "text-white/60"}>At least one digit (0-9)</span>
                </div>
              </div>
            )}
          </div>

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
                  setError("");
                }}
                placeholder="Verify new password"
                className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${
                  confirmPassword === "" || isPasswordMatching ? "border-white/20" : "border-red-400"
                } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold`}
                disabled={isSubmitting}
                required
              />
            </div>
            {confirmPassword !== "" && !isPasswordMatching && (
              <span className="text-red-400 text-xs mt-1 block">Passwords do not match</span>
            )}
            {confirmPassword !== "" && isPasswordMatching && isPasswordStrong && (
              <span className="text-teal-400 text-xs mt-1 block">Passwords match and strength verified</span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full flex items-center justify-center mt-6"
            disabled={isSubmitting || password === "" || confirmPassword === "" || !isPasswordStrong || !isPasswordMatching}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        {success && (
          <div className="mt-4 text-center">
            <span className="text-xs text-teal-400 italic">Redirecting to login shortly...</span>
          </div>
        )}

        <div className="mt-6 text-center text-white/50 border-t border-white/10 pt-4">
          <Link to="/admin/login" className="text-gold hover:underline text-sm font-medium">
            Return to Login
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
