import React, { useEffect, useState } from "react";
import Header from "../../components/employee/Header";
import StatusCard from "../../components/employee/StatusCard";
import TimeDisplay from "../../components/employee/TimeDisplay";
import PunchButton from "../../components/employee/PunchButton";
import ActivityCard from "../../components/employee/ActivityCard";
import LeaveSection from "../../components/employee/LeaveSection";

const formatTimeHM = (time: string | null) => {
  if (!time) return null;
  return time.slice(0, 5);
};

const EmployeeDashboard: React.FC = () => {
  const [status, setStatus] = useState("NOT_CHECKED_IN");
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [employeeName, setEmployeeName] = useState("Alex");

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employee/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.full_name || data.fullName) {
          setEmployeeName(data.full_name || data.fullName);
        }
      }
    } catch (err) {
      console.error("Could not fetch profile:", err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/attendance/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setStatus(data.status || "NOT_CHECKED_IN");
        setCheckIn(formatTimeHM(data.checkInTime));
        setCheckOut(formatTimeHM(data.checkOutTime));
      }
    } catch (err) {
      console.error("Could not fetch attendance:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAttendance();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 antialiased selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Navbar */}
        <Header employeeName={employeeName} />

        {/* Dashboard Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Main Column (Attendance & Punch Terminal) */}
          <div className="lg:col-span-7 space-y-6">
            <StatusCard status={status} />
            <TimeDisplay />
            <PunchButton onPunchSuccess={fetchAttendance} />
          </div>

          {/* Right Column (Activity Metrics & Leaves) */}
          <div className="lg:col-span-5 space-y-6">
            <ActivityCard checkInTime={checkIn} checkOutTime={checkOut} />
            <LeaveSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
