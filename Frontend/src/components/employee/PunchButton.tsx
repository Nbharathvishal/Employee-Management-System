import React, { useEffect, useState } from "react";
import { LogIn, LogOut, Loader2, AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface AttendanceStatus {
  status: "NOT_CHECKED_IN" | "CHECKED_IN" | "CHECKED_OUT";
  checkInTime: string | null;
  checkOutTime: string | null;
}

interface PunchButtonProps {
  onPunchSuccess?: () => void;
}

const formatTimeHM = (time: string | null) => {
  if (!time) return null;
  return time.slice(0, 5);
};

const PunchButton: React.FC<PunchButtonProps> = ({ onPunchSuccess }) => {
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({
    status: "NOT_CHECKED_IN",
    checkInTime: null,
    checkOutTime: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchTodayStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/attendance/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setAttendanceStatus({
          status: data.status,
          checkInTime: data.checkInTime,
          checkOutTime: data.checkOutTime,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  const handlePunch = async () => {
    setLoading(true);
    setError("");
    setSuccessMsg("");

    const token = localStorage.getItem("token");
    const isCheckingOut = attendanceStatus.status === "CHECKED_IN";
    const endpoint = isCheckingOut
      ? `${import.meta.env.VITE_API_BASE_URL}/attendance/check-out`
      : `${import.meta.env.VITE_API_BASE_URL}/attendance/check-in`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setSuccessMsg(isCheckingOut ? "Checked out successfully!" : "Checked in successfully!");
        await fetchTodayStatus();
        if (onPunchSuccess) onPunchSuccess();
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || "Attendance action failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const isCheckedIn = attendanceStatus.status === "CHECKED_IN";
  const isCheckedOut = attendanceStatus.status === "CHECKED_OUT";

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="text-indigo-400" size={20} />
            Punch Terminal
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Record shift check-in & check-out</p>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border ${
            isCheckedIn
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : isCheckedOut
              ? "bg-slate-800 text-slate-400 border-slate-700"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          }`}
        >
          {isCheckedIn ? "Active Shift" : isCheckedOut ? "Completed" : "Ready"}
        </span>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm flex items-center gap-2.5">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Interactive Action Button */}
      <div>
        <button
          disabled={loading || isCheckedOut}
          onClick={handlePunch}
          className={`w-full py-5 px-6 rounded-2xl font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-xl select-none ${
            isCheckedOut
              ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700 shadow-none"
              : isCheckedIn
              ? "bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-900/30 active:scale-[0.99]"
              : "bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/30 active:scale-[0.99]"
          }`}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={22} />
              <span>Recording Timestamp...</span>
            </div>
          ) : isCheckedOut ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 size={22} className="text-slate-400" />
              <span>Shift Completed for Today</span>
            </div>
          ) : isCheckedIn ? (
            <div className="flex items-center gap-2.5">
              <LogOut size={22} />
              <span>PUNCH OUT (END SHIFT)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <LogIn size={22} />
              <span>PUNCH IN (START SHIFT)</span>
            </div>
          )}
        </button>
      </div>

      {/* Status Timestamp Details */}
      {(attendanceStatus.checkInTime || attendanceStatus.checkOutTime) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {attendanceStatus.checkInTime && (
            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Punch In Time:</span>
              <span className="font-mono font-bold text-emerald-400">
                {formatTimeHM(attendanceStatus.checkInTime)}
              </span>
            </div>
          )}
          {attendanceStatus.checkOutTime && (
            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Punch Out Time:</span>
              <span className="font-mono font-bold text-rose-400">
                {formatTimeHM(attendanceStatus.checkOutTime)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PunchButton;
