import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importando o hook de autenticação

export const Layout = ({ user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Pegamos a função de logout diretamente do contexto global
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay para fechar o menu mobile ao clicar fora */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar - Agora passa o logout vindo do contexto */}
      <Sidebar 
        user={user} 
        onLogout={logout} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Mobile */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:hidden">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-gray-700">EduManager Pro</span>
        </header>

        {/* Área de Conteúdo Dinâmico */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* O Outlet renderiza as rotas filhas do App.jsx */}
            <Outlet /> 
          </div>
        </div>
      </main>
    </div>
  );
};