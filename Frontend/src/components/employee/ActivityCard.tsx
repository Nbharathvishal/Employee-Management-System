import React from 'react';
import { Clock, Eye, BarChart3 } from 'lucide-react';

interface ActivityCardProps {
  checkInTime?: string | null;
  checkOutTime?: string | null;
}

const formatTimeHM = (time: string | null) => {
  if (!time) return null;
  return time.slice(0, 5);
};

const ActivityCard: React.FC<ActivityCardProps> = ({
  checkInTime = null,
  checkOutTime = null
}) => {

  const calculateHours = () => {
    if (!checkInTime || !checkOutTime) return "0.0h";

    const [inH, inM] = formatTimeHM(checkInTime)!.split(':').map(Number);
    const [outH, outM] = formatTimeHM(checkOutTime)!.split(':').map(Number);

    const mins = (outH * 60 + outM) - (inH * 60 + inM);
    return `${(mins / 60).toFixed(1)}h`;
  };

  const activities = [
    { icon: <BarChart3 size={20} />, label: "HOURS", value: calculateHours() },
    { icon: <Clock size={20} />, label: "PUNCH IN", value: formatTimeHM(checkInTime) || "---" },
    { icon: <Eye size={20} />, label: "VIEW LOGS", value: "---" },
    { icon: <Clock size={20} />, label: "PUNCH OUT", value: formatTimeHM(checkOutTime) || "---" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-full">
      <h2 className="text-lg font-semibold mb-6">Today's Activity</h2>

      <div className="grid grid-cols-2 gap-4">
        {activities.map((a, i) => (
          <div key={i} className="bg-slate-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              {a.icon}
              <span className="text-sm font-medium">{a.label}</span>
            </div>
            <div className="text-2xl font-bold">{a.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityCard;
