import React from "react"; // Add this import
import { ShieldCheck, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <ShieldCheck className="text-blue-500" size={24} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-blue-600 mb-2">
          Employee Management System
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Select your role to continue
        </p>

        {/* Admin Card */}
        <div className="bg-slate-50 border rounded-xl p-5 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <ShieldCheck className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">
                Admin Login
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Access administrative features and settings
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/login/admin")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2"
          >
            <ShieldCheck size={18} />
            Select Admin →
          </button>
        </div>

        {/* Employee Card */}
        <div className="bg-slate-50 border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
              <User className="text-slate-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">
                Employee Login
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Access your employee dashboard and tasks
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/login/employee")}
            className="w-full bg-slate-700 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2"
          >
            <User size={18} />
            Select Employee →
          </button>
        </div>

      </div>
    </div>
  );
}