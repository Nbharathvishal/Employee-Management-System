import React, { useEffect, useState } from 'react';
import { Clock, LogIn, LogOut, Loader2, AlertCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LeaveSection from './LeaveSection';

interface AttendanceStatus {
  status: 'NOT_CHECKED_IN' | 'CHECKED_IN' | 'CHECKED_OUT';
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
  const navigate = useNavigate();

  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({
    status: 'NOT_CHECKED_IN',
    checkInTime: null,
    checkOutTime: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTodayStatus = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/attendance/today', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      setAttendanceStatus({
        status: data.status,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime
      });
    }
  };

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  const handlePunch = async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    const endpoint =
      attendanceStatus.status === 'CHECKED_IN'
        ? 'http://localhost:5000/attendance/check-out'
        : 'http://localhost:5000/attendance/check-in';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        await fetchTodayStatus();
        onPunchSuccess && onPunchSuccess();
      } else {
        setError('Punch failed');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const isCheckedIn = attendanceStatus.status === 'CHECKED_IN';
  const isCheckedOut = attendanceStatus.status === 'CHECKED_OUT';

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 flex gap-2">
        <Clock /> Attendance Action
      </h2>

      {error && (
        <div className="mb-3 text-red-600 flex gap-2">
          <AlertCircle /> {error}
        </div>
      )}

      <button
        disabled={loading || isCheckedOut}
        onClick={handlePunch}
        className={`w-full py-4 rounded-xl font-bold text-lg ${
          isCheckedIn ? 'bg-red-600' : 'bg-green-600'
        } text-white`}
      >
        {loading ? (
          <Loader2 className="animate-spin mx-auto" />
        ) : isCheckedIn ? (
          <>
            <LogOut /> PUNCH OUT
          </>
        ) : (
          <>
            <LogIn /> PUNCH IN
          </>
        )}
      </button>

      {(attendanceStatus.checkInTime || attendanceStatus.checkOutTime) && (
        <div className="mt-4 bg-blue-50 p-3 rounded-lg">
          {attendanceStatus.checkInTime && (
            <div>Check In: {formatTimeHM(attendanceStatus.checkInTime)}</div>
          )}
          {attendanceStatus.checkOutTime && (
            <div>Check Out: {formatTimeHM(attendanceStatus.checkOutTime)}</div>
          )}
        </div>
      )}

      <button
        onClick={() => navigate('/employee/apply-leave')}
        className="mt-4 flex items-center gap-2 text-blue-600"
      >
        <Calendar size={16} /> Apply Leave

        
      </button>
      <LeaveSection />
    </div>
  );
};

export default PunchButton;
