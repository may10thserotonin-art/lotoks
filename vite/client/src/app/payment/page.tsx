
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  Lock,
  ArrowLeft,
  Download
} from "lucide-react";
import { Link } from 'react-router-dom';

export default function PaymentPage() {
  const [status, setStatus] = useState<"form" | "processing" | "success">("form");

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("processing");
    setTimeout(() => setStatus("success"), 3000);
  };

  return (
    <div className="min-h-screen bg-surface py-12 px-6 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-bold text-on-surface mb-2">Secure <span className="text-primary">Payment.</span></h2>
          <p className="text-sm text-outline-variant font-medium">Complete your sponsorship application fee.</p>
        </header>

        <AnimatePresence mode="wait">
          {status === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="card p-8 bg-white border border-outline-variant/30 rounded-2xl shadow-xl"
            >
              <div className="flex items-center justify-between mb-8 p-4 bg-surface-container-low rounded-xl">
                <div>
                  <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">Application Fee</p>
                  <h4 className="text-2xl font-bold text-on-surface">$250.00</h4>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                  Visa Sponsorship
                </div>
              </div>

              <form onSubmit={handlePay} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Cardholder Name</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:border-primary outline-none" placeholder="Amina Okafor" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
                    <input type="text" required className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:border-primary outline-none" placeholder="**** **** **** 1234" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Expiry</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:border-primary outline-none" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">CVV</label>
                    <input type="password" required className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:border-primary outline-none" placeholder="***" />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-outline-variant py-2">
                  <Lock size={14} /> Encrypted with 256-bit SSL
                </div>

                <button type="submit" className="w-full py-4 rounded-full bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary-dim transition-all shadow-lg shadow-primary/20">
                  Pay $250.00
                </button>
              </form>
            </motion.div>
          )}

          {status === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-12 bg-white border border-outline-variant/30 rounded-2xl shadow-xl flex flex-col items-center text-center"
            >
              <div className="relative mb-8">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <CreditCard size={24} className="text-primary" />
                </motion.div>
              </div>
              <h4 className="text-xl font-bold text-on-surface mb-2">Processing Payment</h4>
              <p className="text-sm text-on-surface-variant font-medium">Please do not refresh the page...</p>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-12 bg-white border border-outline-variant/30 rounded-2xl shadow-xl flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 mb-8">
                <CheckCircle2 size={48} />
              </div>
              <h4 className="text-3xl font-bold text-on-surface mb-4">Payment Successful!</h4>
              <p className="text-on-surface-variant mb-10 font-medium">Your application <span className="text-primary font-bold">#LTK-2026-00042</span> has been submitted for review.</p>
              
              <div className="grid gap-3 w-full">
                <Link to="/dashboard" className="w-full py-4 rounded-full bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary-dim transition-all shadow-lg shadow-primary/20">
                  Go to Dashboard
                  <ArrowRight size={18} />
                </Link>
                <button className="flex items-center justify-center gap-2 text-xs font-bold text-primary hover:underline">
                  <Download size={14} /> Download Receipt
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
