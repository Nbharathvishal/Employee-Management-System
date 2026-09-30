import React, { useEffect, useState } from "react";
import { Calendar, PlusCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LeaveItem {
  id: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const LeaveSection: React.FC = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState<LeaveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaveBalance, setLeaveBalance] = useState<number | null>(null);

  useEffect(() => {
    fetchLeaves();
    fetchLeaveBalance();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leaves/my-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLeaves(data.leaves || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leaves/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLeaveBalance(data.availableLeaves || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingCount = leaves.filter((l) => l.status === "PENDING").length;
  const approvedCount = leaves.filter((l) => l.status === "APPROVED").length;
  const rejectedCount = leaves.filter((l) => l.status === "REJECTED").length;

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="text-indigo-400" size={20} />
            Leave & Time Off
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage leave requests and check balance</p>
        </div>

        <button
          onClick={() => navigate("/employee/apply-leave")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle size={16} />
          <span>Apply Leave</span>
        </button>
      </div>

      {/* Leave Balance Banner */}
      <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Available Annual Leaves</p>
          <p className="text-xs text-slate-400">Paid time off allowance</p>
        </div>
        <div className="text-right">
          <span className="text-2xl sm:text-3xl font-black text-indigo-400">
            {leaveBalance !== null ? leaveBalance : "--"}
          </span>
          <span className="text-xs font-medium text-slate-400 ml-1">Days</span>
        </div>
      </div>

      {/* Leave Status Counters Bento */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
          <div className="flex items-center justify-center text-amber-400">
            <Clock size={16} />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{loading ? "-" : pendingCount}</p>
          <p className="text-[11px] font-medium text-amber-400">Pending</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
          <div className="flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={16} />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{loading ? "-" : approvedCount}</p>
          <p className="text-[11px] font-medium text-emerald-400">Approved</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-1">
          <div className="flex items-center justify-center text-rose-400">
            <XCircle size={16} />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{loading ? "-" : rejectedCount}</p>
          <p className="text-[11px] font-medium text-rose-400">Rejected</p>
        </div>
      </div>
    </div>
  );
};

export default LeaveSection;
