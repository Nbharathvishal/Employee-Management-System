import React, { useEffect, useState } from "react";
import { LogOut, Sunrise, Sun, Moon, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  employeeName: string;
}

const Header: React.FC<HeaderProps> = ({ employeeName }) => {
  const [greeting, setGreeting] = useState("Good Morning");
  const { logout } = useAuth();

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting("Good Morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good Afternoon");
      } else if (hour >= 17 && hour < 21) {
        setGreeting("Good Evening");
      } else {
        setGreeting("Good Night");
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return <Sunrise className="text-amber-400" size={20} />;
    if (hour >= 12 && hour < 17) return <Sun className="text-amber-400" size={20} />;
    return <Moon className="text-indigo-300" size={20} />;
  };

  return (
    <header className="rounded-3xl bg-slate-900 border border-slate-800/80 p-5 sm:p-6 shadow-xl shadow-slate-950/40">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Branding & Welcome Greeting */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <ShieldCheck className="text-white" size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                Employee Hub
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
              {getGreetingIcon()}
              {greeting}, <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">{employeeName}</span>
            </h1>
          </div>
        </div>

        {/* Right: Employee Profile Badge & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
              {employeeName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-white leading-tight">{employeeName}</p>
              <p className="text-[11px] text-slate-400 font-medium">Verified Staff</p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all duration-200 text-sm font-semibold shadow-sm group"
            title="Logout"
          >
            <LogOut size={17} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
