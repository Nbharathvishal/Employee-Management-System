import React from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface StatusCardProps {
  status: "NOT_CHECKED_IN" | "CHECKED_IN" | "CHECKED_OUT" | string;
}

const StatusCard: React.FC<StatusCardProps> = ({ status }) => {
  const normalized = status.toUpperCase().replace(/\s+/g, "_");

  const getStatusConfig = () => {
    switch (normalized) {
      case "CHECKED_IN":
        return {
          label: "Active & Checked In",
          desc: "Shift in progress",
          badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          dotColor: "bg-emerald-400",
          icon: <CheckCircle2 size={16} className="text-emerald-400" />,
        };
      case "CHECKED_OUT":
        return {
          label: "Checked Out",
          desc: "Shift completed for today",
          badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
          dotColor: "bg-rose-400",
          icon: <Clock size={16} className="text-rose-400" />,
        };
      case "NOT_CHECKED_IN":
      default:
        return {
          label: "Not Checked In",
          desc: "Ready to start your work session",
          badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          dotColor: "bg-amber-400",
          icon: <AlertCircle size={16} className="text-amber-400" />,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
      <div className="flex items-center gap-3">
        <div className={`relative flex items-center justify-center w-8 h-8 rounded-xl ${config.badgeColor} border`}>
          {config.icon}
          <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${config.dotColor} animate-ping`}></span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-tight">{config.label}</span>
          </div>
          <p className="text-xs text-slate-400">{config.desc}</p>
        </div>
      </div>

      <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${config.badgeColor}`}>
        <span className={`w-2 h-2 rounded-full ${config.dotColor}`}></span>
        <span>{normalized.replace(/_/g, " ")}</span>
      </div>
    </div>
  );
};

export default StatusCard;