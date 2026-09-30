import React from "react";
import { Clock, BarChart3, LogIn, LogOut, CheckCircle2 } from "lucide-react";

interface ActivityCardProps {
  checkInTime?: string | null;
  checkOutTime?: string | null;
}

const formatTimeHM = (time: string | null) => {
  if (!time) return null;
  return time.slice(0, 5);
};

const ActivityCard: React.FC<ActivityCardProps> = ({
  checkInTime = null,
  checkOutTime = null,
}) => {
  const calculateHours = () => {
    if (!checkInTime) return "0.0h";

    const inParts = formatTimeHM(checkInTime)!.split(":").map(Number);
    const inMins = inParts[0] * 60 + inParts[1];

    let outMins: number;
    if (checkOutTime) {
      const outParts = formatTimeHM(checkOutTime)!.split(":").map(Number);
      outMins = outParts[0] * 60 + outParts[1];
    } else {
      const now = new Date();
      outMins = now.getHours() * 60 + now.getMinutes();
    }

    const diff = Math.max(outMins - inMins, 0);
    return `${(diff / 60).toFixed(1)}h`;
  };

  const hoursWorked = calculateHours();
  const numericHours = parseFloat(hoursWorked) || 0;
  const targetHours = 8;
  const progressPercent = Math.min((numericHours / targetHours) * 100, 100);

  const activities = [
    {
      icon: <LogIn size={20} className="text-emerald-400" />,
      label: "Punch In",
      value: formatTimeHM(checkInTime) || "--:--",
      sub: checkInTime ? "Recorded" : "Not yet",
      color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    },
    {
      icon: <LogOut size={20} className="text-rose-400" />,
      label: "Punch Out",
      value: formatTimeHM(checkOutTime) || "--:--",
      sub: checkOutTime ? "Recorded" : "Pending",
      color: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    },
  ];

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between h-full space-y-6">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="text-indigo-400" size={20} />
              Today's Activity
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Session timestamps & hours</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Shift Tracking
          </span>
        </div>

        {/* Working Hours Hero Meter */}
        <div className="mt-5 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock size={14} className="text-indigo-400" />
              Hours Logged
            </span>
            <span className="text-xs font-medium text-slate-400">Target: 8.0h</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-white tracking-tight">{hoursWorked}</div>
            <span className="text-xs font-bold text-indigo-400">{progressPercent.toFixed(0)}%</span>
          </div>

          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Punch Time Badges */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {activities.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-800/30 border border-slate-800 flex flex-col justify-between space-y-2 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${item.color} border`}>{item.icon}</div>
                <span className="text-[11px] text-slate-400">{item.sub}</span>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">{item.label}</p>
                <p className="text-lg font-bold text-white font-mono">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-emerald-400" />
          Shift Status
        </span>
        <span className="text-slate-300 font-medium font-mono">
          {checkOutTime ? "Completed" : checkInTime ? "Active Now" : "Not Started"}
        </span>
      </div>
    </div>
  );
};

export default ActivityCard;
