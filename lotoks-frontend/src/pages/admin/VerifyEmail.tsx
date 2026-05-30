import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Globe, 
  CheckCircle,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    const performVerification = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link. Missing token parameter.");
        return;
      }

      try {
        const response = await apiFetch("/admin/verify-email", {
          method: "POST",
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        
        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          
          // Auto-redirect to login after 3 seconds
          const timer = setTimeout(() => {
            navigate("/admin/login", { replace: true });
          }, 3500);
          return () => clearTimeout(timer);
        } else {
          setStatus("error");
          setMessage(data.message || "Invalid or expired verification token.");
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Network error. Failed to reach verification server.");
      }
    };

    performVerification();
  }, [token, navigate]);

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
          Email Verification
        </h2>

        <div className="flex flex-col items-center justify-center space-y-4 mb-6">
          {status === "verifying" && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="p-3 bg-white/5 rounded-full border border-white/10"
            >
              <Loader2 className="w-10 h-10 text-gold" />
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="p-3 bg-teal-500/10 rounded-full border border-teal-500/30"
            >
              <CheckCircle className="w-12 h-12 text-teal-400" />
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="p-3 bg-red-500/10 rounded-full border border-red-500/30"
            >
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </motion.div>
          )}

          <p className="text-white/80 text-sm px-2 mt-2 leading-relaxed">
            {message}
          </p>

          {status === "success" && (
            <span className="text-xs text-white/50 italic">
              Redirecting you to login screen...
            </span>
          )}
        </div>

        {status !== "verifying" && (
          <div className="border-t border-white/10 pt-4 mt-6">
            <Link to="/admin/login">
              <Button variant="primary" className="w-full">
                Go to Login
              </Button>
            </Link>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
