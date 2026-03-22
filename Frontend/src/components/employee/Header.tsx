import React, { useEffect, useState } from 'react';

interface HeaderProps {
  employeeName: string;
}

const Header: React.FC<HeaderProps> = ({ employeeName }) => {
  const [greeting, setGreeting] = useState('Good Morning');

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();

      if (hour >= 5 && hour < 12) {
        setGreeting('Good Morning');
      } else if (hour >= 12 && hour < 17) {
        setGreeting('Good Afternoon');
      } else if (hour >= 17 && hour < 21) {
        setGreeting('Good Evening');
      } else {
        setGreeting('Good Night');
      }
    };

    updateGreeting(); // initial
    const interval = setInterval(updateGreeting, 60000); // every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-2">
        # Employee Hub
      </h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-800">
          {greeting},
        </h2>

        <p className="text-slate-600 mt-1 md:mt-0">
          Welcome back to your workspace.
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default Header;
