
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, CreditCard, CheckCircle2, XCircle, Clock } from "lucide-react";

const payments = [
  { id: "PAY-001", user: "John Doe", email: "john@example.com", amount: 299, status: "completed", date: "2026-05-10" },
  { id: "PAY-002", user: "Jane Smith", email: "jane@example.com", amount: 499, status: "pending", date: "2026-05-11" },
  { id: "PAY-003", user: "Bob Wilson", email: "bob@example.com", amount: 199, status: "failed", date: "2026-05-09" },
  { id: "PAY-004", user: "Alice Brown", email: "alice@example.com", amount: 399, status: "completed", date: "2026-05-11" },
];

export default function AdminPaymentsPage() {
  const statusIcon = { completed: CheckCircle2, pending: Clock, failed: XCircle };
  const statusColor = { completed: "text-green-600", pending: "text-orange-600", failed: "text-red-600" };

  const totalRevenue = payments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Payment Transactions</h2>
          <p className="text-sm text-on-surface-variant font-medium mt-1">Track and manage all payment transactions</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-outline-variant uppercase tracking-widest">Total Revenue</p>
          <p className="text-3xl font-bold text-primary">${totalRevenue}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
          <input 
            type="text" 
            placeholder="Search payments..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {payments.map((payment, idx) => {
          const StatusIcon = statusIcon[payment.status as keyof typeof statusIcon] || Clock;
          const colorClass = statusColor[payment.status as keyof typeof statusColor] || "text-outline-variant";
          
          return (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-6 bg-white border border-outline-variant/30 rounded-2xl hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h5 className="font-bold text-on-surface">{payment.user}</h5>
                  <p className="text-sm text-primary font-medium">{payment.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs font-bold text-outline-variant uppercase tracking-widest">Amount</p>
                  <p className="text-xl font-bold text-on-surface">${payment.amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-outline-variant uppercase tracking-widest">Date</p>
                  <p className="text-sm font-medium text-on-surface">{payment.date}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${colorClass} bg-current/10`}>
                  <StatusIcon size={14} />
                  {payment.status}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}