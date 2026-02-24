import React from 'react';

export const Header = ({ title, subtitle, icon: Icon, action }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {Icon && <Icon className="text-indigo-600" />}
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        )}
      </div>
      
      {/* Aqui entra qualquer botão ou tag que você queira colocar à direita */}
      {action && (
        <div className="flex items-center gap-3">
          {action}
        </div>
      )}
    </div>
  );
};