
import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Clock, Search, CheckCircle2, AlertCircle } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
    submitted:    { label: "Submitted",    color: "text-blue-700",   bgColor: "bg-blue-50",   icon: Clock },
    under_review: { label: "Under Review", color: "text-amber-700",  bgColor: "bg-amber-50",  icon: Search },
    approved:     { label: "Approved",     color: "text-green-700",  bgColor: "bg-green-50",  icon: CheckCircle2 },
    rejected:     { label: "Rejected",     color: "text-red-700",    bgColor: "bg-red-50",    icon: AlertCircle },
    more_info:    { label: "More Info",    color: "text-orange-700", bgColor: "bg-orange-50", icon: AlertCircle },
  };

  const config = configs[status] ?? configs.submitted;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
        config.color,
        config.bgColor
      )}
    >
      <Icon size={12} />
      {config.label}
    </div>
  );
}
