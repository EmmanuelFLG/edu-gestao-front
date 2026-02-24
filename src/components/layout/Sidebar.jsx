import React from 'react';
import { LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { MENU_ITEMS } from '../../config/navigation';

export const Sidebar = ({ user, onLogout, isOpen, onClose }) => {
  // Filtra itens por usuario
  const availableItems = MENU_ITEMS.filter(item =>
    item.allowedRoles.includes(user.role)
  );

  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out flex flex-col
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-tight text-indigo-400">EduManager</h1>
      </div>

      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {availableItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.page}
              to={item.page}
              onClick={onClose}
              className={({ isActive }) => `
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-indigo-500/20 shadow-inner">
            <span className="font-bold text-white text-sm">
              {/* MUDADO AQUI: user.nome */}
              {user.nome ? user.nome.charAt(0) : '?'}
            </span>
          </div>
          <div className="overflow-hidden">
            {/* MUDADO AQUI: user.nome */}
            <p className="text-sm font-medium text-white truncate" title={user.nome}>
              {user.nome}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
              {user.role}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs text-slate-400 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/30 rounded-lg transition-all border border-slate-700 font-medium"
        >
          <LogOut className="w-3 h-3" /> Sair do Sistema
        </button>
      </div>
    </aside>
  );
};