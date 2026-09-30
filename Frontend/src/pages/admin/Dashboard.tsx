import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getAdminDashboardAttendance,
} from "../../api/admin.api";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  UserCheck,
  CalendarOff,
  Clock,
  LogOut,
  TrendingUp,
  AlertCircle,
  Sun,
  Moon,
  Sunrise,
  CalendarDays,
  PlusCircle,
  Edit3,
  List,
  FileText,
  ArrowDownRight,
  Menu,
  X,
  Shield,
  Activity,
  CheckCircle2,
  Sparkles
} from "lucide-react";

type AttendanceView = "DAILY" | "WEEKLY" | "MONTHLY";

export default function AdminDashboard() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  /* TOP STATS */
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    pendingLeaves: 0,
  });

  /* ATTENDANCE VIEW */
  const [attendanceView, setAttendanceView] = useState<AttendanceView>("DAILY");

  /* ATTENDANCE SUMMARY */
  const [attendanceSummary, setAttendanceSummary] = useState({
    attendancePercentage: 0,
    totalPresent: 0,
    expectedAttendance: 0,
    lateCheckIns: 0,
    earlyCheckOuts: 0,
  });

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  /* LOAD DASHBOARD STATS */
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        if (data) setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };
    loadStats();
  }, []);

  /* LOAD ATTENDANCE SUMMARY */
  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const data = await getAdminDashboardAttendance(attendanceView);
        if (data) setAttendanceSummary(data);
      } catch (err) {
        console.error("Failed to load attendance", err);
      }
    };
    loadAttendance();
  }, [attendanceView]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: "Good Morning", icon: <Sunrise className="text-amber-300" size={22} /> };
    if (hour >= 12 && hour < 18) return { text: "Good Afternoon", icon: <Sun className="text-amber-400" size={22} /> };
    return { text: "Good Evening", icon: <Moon className="text-indigo-200" size={22} /> };
  };

  const greeting = getGreeting();

  const menuItems = [
    { icon: <PlusCircle size={19} />, label: "Add Employee", to: "/admin/employees/new" },
    { icon: <Edit3 size={19} />, label: "Edit Employee", to: "/admin/employees/edit" },
    { icon: <List size={19} />, label: "All Employees", to: "/admin/employees" },
    { icon: <FileText size={19} />, label: "Leave Requests", to: "/admin/leaves", badge: stats.pendingLeaves > 0 ? stats.pendingLeaves : undefined },
    { icon: <Clock size={19} />, label: "Late Punch-Ins", to: "/admin/employeesLateIn" },
    { icon: <LogOut size={19} />, label: "Early Punch-Outs", to: "/admin/employeesEarlyOut" },
  ];

  const quickStats = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: <Users size={22} className="text-blue-600" />,
      bg: "bg-blue-50/80 border-blue-100",
      accent: "from-blue-600 to-indigo-600",
      trend: "+2 this month",
      trendUp: true,
    },
    {
      title: "Present Today",
      value: stats.presentToday,
      icon: <UserCheck size={22} className="text-emerald-600" />,
      bg: "bg-emerald-50/80 border-emerald-100",
      accent: "from-emerald-600 to-teal-600",
      trend: `${stats.totalEmployees > 0 ? ((stats.presentToday / stats.totalEmployees) * 100).toFixed(0) : 0}% attendance`,
      trendUp: true,
    },
    {
      title: "On Leave",
      value: stats.onLeave,
      icon: <CalendarOff size={22} className="text-amber-600" />,
      bg: "bg-amber-50/80 border-amber-100",
      accent: "from-amber-500 to-orange-600",
      trend: stats.onLeave > 0 ? `${stats.onLeave} active` : "All on duty",
      trendUp: false,
    },
    {
      title: "Pending Requests",
      value: stats.pendingLeaves,
      icon: <AlertCircle size={22} className="text-rose-600" />,
      bg: "bg-rose-50/80 border-rose-100",
      accent: "from-rose-500 to-pink-600",
      urgent: stats.pendingLeaves > 0,
      trend: stats.pendingLeaves > 0 ? "Requires review" : "Up to date",
      trendUp: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased font-sans selection:bg-indigo-500 selection:text-white">
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">Admin Hub</h1>
            <p className="text-[11px] text-slate-400">Management Suite</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed lg:sticky top-0 inset-y-0 left-0 z-50
          w-72 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out lg:translate-x-0 h-screen
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div>
          {/* Logo Branding */}
          <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Shield size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                  EMS Admin
                  <span className="text-[10px] uppercase font-semibold tracking-wider bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">PRO</span>
                </h1>
                <p className="text-xs text-slate-400">Enterprise Suite</p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <div className="px-4 py-5 space-y-1">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Main Navigation</span>
              <Activity size={13} className="text-slate-400" />
            </div>

            <Link
              to="/admin/dashboard"
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                location.pathname === "/admin/dashboard"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Activity size={19} className={location.pathname === "/admin/dashboard" ? "text-white" : "text-indigo-400"} />
                <span>Dashboard</span>
              </div>
            </Link>

            <div className="pt-4 pb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Management
            </div>

            {menuItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400 transition-colors"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Profile & Logout Section */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
                  A
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">Administrator</p>
                <p className="text-[11px] text-slate-400">Super Admin</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for Mobile Sidebar */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-slate-900/40 p-4 lg:p-8 space-y-6 overflow-y-auto">
        {/* Modern Hero Greeting Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-6 lg:p-8 shadow-2xl shadow-indigo-950/50 border border-indigo-500/30">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-white/90">
                <Sparkles size={14} className="text-amber-300" />
                <span>Executive Management Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                {greeting.text}, Admin!
              </h1>
              <p className="text-indigo-100/80 text-sm sm:text-base max-w-xl">
                Here is an overview of employee attendance, workforce operations, and team requests for today.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 text-white shadow-inner">
                <CalendarDays size={18} className="text-indigo-200" />
                <span className="text-sm font-medium">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </span>
              </div>

              <div className="bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 text-white font-mono font-semibold tracking-wider text-sm shadow-inner">
                <Clock size={18} className="text-amber-300 animate-pulse" />
                <span>{currentTime || "Loading..."}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Bento Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickStats.map((stat, i) => (
            <div
              key={i}
              className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 p-5 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg} border shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className={`font-medium ${stat.urgent ? "text-rose-400 font-semibold flex items-center gap-1" : "text-slate-400"}`}>
                  {stat.urgent && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block"></span>}
                  {stat.trend}
                </span>
                <span className="text-[11px] text-slate-400">Live Metric</span>
              </div>
            </div>
          ))}
        </div>

        {/* Attendance Analytics & Issues Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Attendance Overview Ring */}
          <div className="lg:col-span-6 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 lg:p-7 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Activity size={20} className="text-indigo-400" />
                  Attendance Rate
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Real-time presence tracking</p>
              </div>

              {/* View Period Segment Controls */}
              <div className="inline-flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
                {(["DAILY", "WEEKLY", "MONTHLY"] as AttendanceView[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setAttendanceView(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      attendanceView === type
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Circular Gauge Display */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="url(#attendanceGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(attendanceSummary.attendancePercentage / 100) * 314.15} 314.15`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="attendanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-white tracking-tight">
                    {attendanceSummary.attendancePercentage}%
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
                    Attended
                  </span>
                </div>
              </div>

              {/* Stat breakdown pills */}
              <div className="w-full sm:w-auto flex-1 space-y-3">
                <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-300 font-semibold">Present</p>
                      <p className="text-lg font-bold text-white">{attendanceSummary.totalPresent}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    / {attendanceSummary.expectedAttendance} {attendanceView === "DAILY" ? "staff" : "shifts"}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                      <ArrowDownRight size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-rose-300 font-semibold">Absent</p>
                      <p className="text-lg font-bold text-white">
                        {Math.max(attendanceSummary.expectedAttendance - attendanceSummary.totalPresent, 0)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {attendanceView === "DAILY" ? "absent" : "missed"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                Target threshold: 90%
              </span>
              <span className="text-indigo-400 font-medium">Auto-updated</span>
            </div>
          </div>

          {/* Right Column: Attendance Issues */}
          <div className="lg:col-span-6 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 lg:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <AlertCircle size={20} className="text-amber-400" />
                    Punctuality & Exceptions
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Late check-ins and early check-outs</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700">
                  Today
                </span>
              </div>

              <div className="space-y-6">
                {/* Late Check-ins */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 font-medium flex items-center gap-2">
                      <Clock size={16} className="text-amber-400" />
                      Late Punch-Ins
                    </span>
                    <span className="font-bold text-white text-base">
                      {attendanceSummary.lateCheckIns}
                      <span className="text-xs font-normal text-slate-400 ml-1.5">
                        ({stats.totalEmployees > 0 ? ((attendanceSummary.lateCheckIns / stats.totalEmployees) * 100).toFixed(1) : 0}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700"
                      style={{
                        width: `${stats.totalEmployees > 0 ? Math.min((attendanceSummary.lateCheckIns / stats.totalEmployees) * 100, 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Early Check-outs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 font-medium flex items-center gap-2">
                      <LogOut size={16} className="text-rose-400" />
                      Early Punch-Outs
                    </span>
                    <span className="font-bold text-white text-base">
                      {attendanceSummary.earlyCheckOuts}
                      <span className="text-xs font-normal text-slate-400 ml-1.5">
                        ({stats.totalEmployees > 0 ? ((attendanceSummary.earlyCheckOuts / stats.totalEmployees) * 100).toFixed(1) : 0}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-700"
                      style={{
                        width: `${stats.totalEmployees > 0 ? Math.min((attendanceSummary.earlyCheckOuts / stats.totalEmployees) * 100, 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Quick Mini-Stats */}
            <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-slate-800/80">
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-center">
                <p className="text-2xl font-black text-indigo-400">
                  {stats.totalEmployees > 0 ? ((stats.presentToday / stats.totalEmployees) * 100).toFixed(0) : 0}%
                </p>
                <p className="text-xs font-medium text-slate-400 mt-1">Attendance Ratio</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-center">
                <p className="text-2xl font-black text-rose-400">{stats.pendingLeaves}</p>
                <p className="text-xs font-medium text-slate-400 mt-1">Pending Leave Actions</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
