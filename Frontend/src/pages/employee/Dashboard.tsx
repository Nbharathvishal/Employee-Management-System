import React, { useEffect, useState } from 'react';
import Header from '../../components/employee/Header';
import StatusCard from '../../components/employee/StatusCard';
import TimeDisplay from '../../components/employee/TimeDisplay';
import PunchButton from '../../components/employee/PunchButton';
import ActivityCard from '../../components/employee/ActivityCard';

const formatTimeHM = (time: string | null) => {
  if (!time) return null;
  return time.slice(0, 5);
};

const EmployeeDashboard: React.FC = () => {
  const [status, setStatus] = useState('NOT CHECKED IN');
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);

  const fetchAttendance = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/attendance/today', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      setStatus(data.status.replace('_', ' '));
      setCheckIn(formatTimeHM(data.checkInTime));
      setCheckOut(formatTimeHM(data.checkOutTime));
    }
  };

  useEffect(() => {
    fetchAttendance();

  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Header employeeName="Alex" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <StatusCard status={status} />
          <TimeDisplay />

          <PunchButton onPunchSuccess={fetchAttendance}
          
          />
          
        </div>

        <ActivityCard checkInTime={checkIn} checkOutTime={checkOut} 
           
        />

          

      </div>
    </div>
  );
};

export default EmployeeDashboard;
