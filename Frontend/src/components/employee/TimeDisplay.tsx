import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

const TimeDisplay: React.FC = () => {
  const [time, setTime] = useState('');
  const [day, setDay] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // HH:mm format
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);

      // Day format
      const dayString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
      setDay(dayString);
    };

    updateTime(); // initial call
    const interval = setInterval(updateTime, 60000); // every 1 min

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-xl text-white">
      <div className="flex items-center gap-2 mb-2 text-sm text-blue-200">
        <Clock size={18} />
        LIVE TIME
      </div>

      <h3 className="text-5xl font-bold">{time}</h3>
      <p className="mt-2 text-blue-200">{day}</p>
    </div>
  );
};

export default TimeDisplay;
