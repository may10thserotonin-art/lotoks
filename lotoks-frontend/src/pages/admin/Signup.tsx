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
  Loader2,
  Check,
  X,
  User
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiFetch, apiJson } from "@/lib/api";
import { validateEmail, validatePasswordStrength } from "@/lib/validation";

export function AdminSignupPage() {
  const { admin } = useAdminAuth(); // We need to check if the current user is super admin
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("admin"); // default role
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength checks
  const rules = validatePasswordStrength(password);
  const isPasswordStrong = rules.isValid;
  const isPasswordMatching = password === confirmPassword;

  const isEmailValid = email === "" || validateEmail(email);

  // Redirect if not super admin
  React.useEffect(() => {
    if (admin && admin.role !== "super_admin") {
      navigate("/admin/queue", { replace: true });
    }
  }, [admin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isPasswordStrong) {
      setError("Password does not meet all strength requirements.");
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
      const response = await apiFetch("/admin/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      });
      const data = await apiJson<{ message?: string }>(response);
      if (response.ok) {
        setSuccess("Staff admin created successfully! Verification email generated.");
        // Clear form
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRole("admin");
      } else {
        setError(data.message || "Failed to create admin");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!admin) {
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
            Admin Signup
          </h2>
          
          <div className="text-center text-white/70 space-y-4">
            <p className="text-sm">You must be logged in as a super admin to register new staff accounts.</p>
            <Link to="/admin/login">
              <Button variant="primary" className="w-full mt-2">
                Go to Login
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
          Create Staff Account
        </h2>
        <p className="text-sm text-white/60 text-center mb-6">Signed up admins will need to verify their email before logging in.</p>
        
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
                placeholder="staff@lotoks.com"
                className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${
                  isEmailValid ? "border-white/20" : "border-red-400"
                } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold`}
                disabled={isSubmitting}
                required
              />
            </div>
            {!isEmailValid && (
              <span className="text-red-400 text-xs mt-1 block">Please enter a valid email address</span>
            )}
          </div>

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
                  setError("");
                }}
                placeholder="Enter strong password"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold"
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
                  <span className={rules.length ? "text-teal-200" : "text-white/60"}>At least 8 characters</span>
                </div>
                <div className="flex items-center space-x-2">
                  {rules.uppercase ? <Check className="w-4 h-4 text-teal-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span className={rules.uppercase ? "text-teal-200" : "text-white/60"}>At least one uppercase letter (A-Z)</span>
                </div>
                <div className="flex items-center space-x-2">
                  {rules.lowercase ? <Check className="w-4 h-4 text-teal-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span className={rules.lowercase ? "text-teal-200" : "text-white/60"}>At least one lowercase letter (a-z)</span>
                </div>
                <div className="flex items-center space-x-2">
                  {rules.number ? <Check className="w-4 h-4 text-teal-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span className={rules.number ? "text-teal-200" : "text-white/60"}>At least one number (0-9)</span>
                </div>
              </div>
            )}
          </div>

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
                  setError("");
                }}
                placeholder="Verify password"
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
              <span className="text-teal-400 text-xs mt-1 block">Passwords match and criteria met</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Assigned Role
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-white/40" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold appearance-none [&>option]:bg-navy [&>option]:text-white"
                disabled={isSubmitting}
              >
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full flex items-center justify-center mt-6"
            disabled={isSubmitting || email === "" || password === "" || confirmPassword === "" || !validateEmail(email) || !isPasswordStrong || !isPasswordMatching}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              "Create Admin"
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-white/50 border-t border-white/10 pt-4">
          <Link to="/admin/staff" className="text-gold hover:underline text-sm font-medium">
            ← Back to Staff Directory
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
