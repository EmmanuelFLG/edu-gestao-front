import React from 'react';

// Removida a interface StatCardProps e a tipagem : React.FC
export const StatCard = ({ title, value, icon: Icon, trend, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
        {trend && (
          <p className="text-xs text-indigo-600 mt-2 font-medium">
            {trend}
          </p>
        )}
      </div>
      <div className={`p-4 rounded-full ${color.split(' ')[0]} bg-opacity-10`}>
        <Icon className={`w-8 h-8 ${color.split(' ')[1] || color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  );
};