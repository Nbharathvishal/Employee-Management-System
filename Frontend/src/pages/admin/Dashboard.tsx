import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getAdminDashboardAttendance,
} from "../../api/admin.api";
import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  CalendarOff,
  Clock,
  LogOut,
  TrendingUp,
  AlertCircle,
  Calendar,
  BarChart3,
  Sun,
  Moon,
  CalendarDays,
  Timer,
  PlusCircle,
  Edit3,
  List,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

type AttendanceView = "DAILY" | "WEEKLY" | "MONTHLY";

export default function AdminDashboard() {
  const [open, setOpen] = useState(false);

  /* TOP STATS */
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    pendingLeaves: 0,
  });

  /* ATTENDANCE VIEW */
  const [attendanceView, setAttendanceView] =
    useState<AttendanceView>("MONTHLY");

  /* ATTENDANCE SUMMARY */
  const [attendanceSummary, setAttendanceSummary] = useState({
    attendancePercentage: 0,
    totalPresent: 0,
    expectedAttendance: 0,
    lateCheckIns: 0,
    earlyCheckOuts: 0,
  });

  /* LOAD DASHBOARD STATS */
  useEffect(() => {
    const loadStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
    };
    loadStats();
  }, []);

  /* LOAD ATTENDANCE SUMMARY */
  useEffect(() => {
    const loadAttendance = async () => {
      const data = await getAdminDashboardAttendance();
      setAttendanceSummary(data);
    };
    loadAttendance();
  }, [attendanceView]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const menuItems = [
    { icon: <PlusCircle size={20} />, label: "Add New Employee", to: "/admin/employees/new", color: "text-blue-500" },
    { icon: <Edit3 size={20} />, label: "Edit Employee", to: "/admin/employees/edit", color: "text-green-500" },
    { icon: <List size={20} />, label: "View All Employees", to: "/admin/employees", color: "text-purple-500" },
    { icon: <FileText size={20} />, label: "Leaves Request", to: "/admin/leaves", color: "text-orange-500" },
    { icon: <Clock size={20} />, label: "Late Punch-Ins", to: "/admin/employeesLateIn", color: "text-yellow-500" },
    { icon: <LogOut size={20} />, label: "Early Punch-Outs", to: "/admin/employeesEarlyOut", color: "text-red-500" },
  ];

  const quickStats = [
    { 
      title: "Total Employees", 
      value: stats.totalEmployees, 
      icon: <Users className="text-blue-500" size={24} />,
      color: "bg-blue-50",
      trend: "+2 this month"
    },
    { 
      title: "Present Today", 
      value: stats.presentToday, 
      icon: <UserCheck className="text-green-500" size={24} />,
      color: "bg-green-50",
      trend: `${((stats.presentToday / stats.totalEmployees) * 100).toFixed(0)}% attendance`
    },
    { 
      title: "On Leave", 
      value: stats.onLeave, 
      icon: <CalendarOff className="text-orange-500" size={24} />,
      color: "bg-orange-50",
      trend: `${stats.onLeave > 0 ? 'Active leaves' : 'No leaves'}`
    },
    { 
      title: "Pending Requests", 
      value: stats.pendingLeaves, 
      icon: <AlertCircle className="text-red-500" size={24} />,
      color: "bg-red-50",
      urgent: true,
      trend: "Requires attention"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          {open ? "✕" : "☰"}
        </button>
        <h1 className="text-xl font-bold text-blue-600">Admin Portal</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:flex lg:flex-col lg:h-screen
        `}>
          {/* Sidebar Header */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-blue-600">Admin Portal</h1>
            <p className="text-sm text-gray-500 mt-1">Administrator Dashboard</p>
            <div className="mt-2 text-xs text-gray-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>

          Navigation
          <nav className="flex-1 p-4 overflow-y-auto">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h2>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className={item.color}>
                      {item.icon}
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-blue-600">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Admin Info */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                A
              </div>
              <div>
                <p className="font-medium">Administrator</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {open && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 lg:p-8 shadow-lg">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold">{getGreeting()}, Admin!</h1>
                  <p className="opacity-90 mt-2">Welcome to your administration dashboard</p>
                  <div className="flex items-center gap-2 mt-4">
                    <CalendarDays size={18} />
                    <span>{new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                    <span className="mx-2">•</span>
                    <Timer size={18} />
                    <span>{getCurrentTime()}</span>
                  </div>
                </div>
                <div className="mt-4 lg:mt-0">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    {new Date().getHours() < 12 ? <Sun size={20} /> : <Moon size={20} />}
                    <span className="font-medium">{getGreeting()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat) => (
                <div key={stat.title} className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      {stat.icon}
                    </div>
                    {stat.urgent && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                  <p className="text-gray-500 text-sm mt-1">{stat.title}</p>
                  <p className="text-xs text-gray-400 mt-2">{stat.trend}</p>
                </div>
              ))}
            </div>

            {/* Attendance Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Attendance Summary */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Attendance Overview</h2>
                  <div className="flex gap-2">
                    {(["DAILY", "WEEKLY", "MONTHLY"] as AttendanceView[]).map(
                      (type) => (
                        <button
                          key={type}
                          onClick={() => setAttendanceView(type)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                            ${
                              attendanceView === type
                                ? "bg-blue-600 text-white"
                                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                            }`}
                        >
                          {type}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Percentage Circle */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div>
                        <div className="text-4xl font-bold text-gray-800">
                          {attendanceSummary.attendancePercentage}%
                        </div>
                        <div className="text-sm text-gray-500 text-center">
                          Attendance Rate
                        </div>
                      </div>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${attendanceSummary.attendancePercentage * 2.83} 283`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                </div>

                {/* Attendance Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700 font-medium">Present</span>
                      <TrendingUp className="text-green-500" size={18} />
                    </div>
                    <div className="text-2xl font-bold text-green-800 mt-2">
                      {attendanceSummary.totalPresent}
                    </div>
                    <div className="text-sm text-green-600">
                      out of {attendanceSummary.expectedAttendance}
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-red-700 font-medium">Absent</span>
                      <ArrowDownRight className="text-red-500" size={18} />
                    </div>
                    <div className="text-2xl font-bold text-red-800 mt-2">
                      {attendanceSummary.expectedAttendance - attendanceSummary.totalPresent}
                    </div>
                    <div className="text-sm text-red-600">
                      employees absent
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Issues & Progress */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Attendance Issues</h2>
                
                <div className="space-y-6">
                  {/* Late Check-ins */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="text-yellow-500" size={20} />
                        <span className="font-medium">Late Check-ins</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-800">
                        {attendanceSummary.lateCheckIns}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${(attendanceSummary.lateCheckIns / stats.totalEmployees) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {((attendanceSummary.lateCheckIns / stats.totalEmployees) * 100).toFixed(1)}% of total employees
                    </p>
                  </div>

                  {/* Early Check-outs */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <LogOut className="text-red-500" size={20} />
                        <span className="font-medium">Early Check-outs</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-800">
                        {attendanceSummary.earlyCheckOuts}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${(attendanceSummary.earlyCheckOuts / stats.totalEmployees) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {((attendanceSummary.earlyCheckOuts / stats.totalEmployees) * 100).toFixed(1)}% of total employees
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {((stats.presentToday / stats.totalEmployees) * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-500">Today's Attendance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {stats.pendingLeaves}
                      </div>
                      <div className="text-sm text-gray-500">Pending Reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
           
          </div>
        </div>
      </div>
    </div>
  );
}