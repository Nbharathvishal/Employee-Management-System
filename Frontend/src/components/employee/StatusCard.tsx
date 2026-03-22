import React from 'react';

interface StatusCardProps {
  status: 'NOT_CHECKED_IN' | 'CHECKED_IN' | 'CHECKED_OUT' | string;
}

const StatusCard: React.FC<StatusCardProps> = ({ status }) => {
  const getStatusDisplay = (status: string): string => {
    switch(status) {
      case 'CHECKED_IN': return 'CHECKED IN';
      case 'CHECKED_OUT': return 'CHECKED OUT';
      case 'NOT_CHECKED_IN': return 'NOT CHECKED IN';
      default: return status.toUpperCase();
    }
  };

  const getStatusColor = (status: string): string => {
    const statusLower = status.toLowerCase();
    switch(statusLower) {
      case 'checked in':
        return 'bg-green-100 text-green-800';
      case 'checked out':
        return 'bg-red-100 text-red-800';
      case 'not checked in':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`px-4 py-2 rounded-lg font-semibold ${getStatusColor(status)}`}>
        {getStatusDisplay(status)}
      </div>
      <div className="hidden md:block">
        <div className="w-6 h-6 rounded-full border-4 border-blue-200"></div>
      </div>
    </div>
  );
};

export default StatusCard;