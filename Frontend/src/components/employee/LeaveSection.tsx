import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LeaveItem {
  id: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
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
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/leaves/my-status', {
        headers: { Authorization: `Bearer ${token}` }
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
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/leaves/balance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeaveBalance(data.availableLeaves || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} />
            Leave Applications
          </h2>
          {leaveBalance !== null && (
            <p className="text-sm text-slate-600 mt-1">
              Available balance:{' '}
              <span className="font-semibold text-blue-600">
                {leaveBalance} days
              </span>
            </p>
          )}
        </div>

        <button
          onClick={() => navigate('/employee/apply-leave')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Calendar size={16} />
          Apply Leave
        </button>
      </div>

      {/* ONLY STATUS COUNTS (2nd IMAGE UI) */}
      <div className="pt-4 border-t border-slate-200">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xl font-bold text-yellow-600">
              {leaves.filter(l => l.status === 'PENDING').length}
            </div>
            <div className="text-xs text-slate-500">Pending</div>
          </div>

          <div>
            <div className="text-xl font-bold text-green-600">
              {leaves.filter(l => l.status === 'APPROVED').length}
            </div>
            <div className="text-xs text-slate-500">Approved</div>
          </div>

          <div>
            <div className="text-xl font-bold text-red-600">
              {leaves.filter(l => l.status === 'REJECTED').length}
            </div>
            <div className="text-xs text-slate-500">Rejected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveSection;
