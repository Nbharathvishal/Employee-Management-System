import React, { useEffect, useState } from "react";
import { Clock, Calendar, Sparkles } from "lucide-react";

const TimeDisplay: React.FC = () => {
  const [time, setTime] = useState("");
  const [seconds, setSeconds] = useState("");
  const [day, setDay] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const secs = now.getSeconds().toString().padStart(2, "0");
      
      setTime(`${hours}:${minutes}`);
      setSeconds(secs);

      const dayString = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric"
      });
      setDay(dayString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 sm:p-7 text-white shadow-2xl shadow-indigo-950/40 border border-indigo-500/30">
      {/* Background glow effects */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-500/30 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-500/30 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-100">
            <Clock size={14} className="text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            <span>LIVE WORKSTATION TIME</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-indigo-200 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
            <Sparkles size={13} className="text-amber-300" />
            <span>Real-time Sync</span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2 font-mono">
            <h3 className="text-5xl sm:text-6xl font-black tracking-tight drop-shadow-md">
              {time || "00:00"}
            </h3>
            <span className="text-2xl sm:text-3xl font-bold text-indigo-200">
              :{seconds || "00"}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-indigo-100/90 text-sm font-medium">
            <Calendar size={16} className="text-indigo-300" />
            <span>{day || "Loading date..."}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeDisplay;
