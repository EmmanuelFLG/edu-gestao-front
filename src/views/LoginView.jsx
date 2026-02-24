import React from 'react';
import { Link } from 'react-router-dom';
import { School, Lock, Mail, ArrowRight } from 'lucide-react';
import { useLogin } from '../hooks/UseLogin';

export const LoginView = () => {
  const { 
    email, setEmail, 
    password, setPassword, 
    error, loading, 
    handleLogin 
  } = useLogin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Cabeçalho */}
        <div className="p-8 bg-indigo-600 text-center">
          <div className="inline-flex p-3 bg-white/20 rounded-xl mb-4 backdrop-blur-sm">
            <School className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">EduManager Pro</h1>
          <p className="text-indigo-100 text-sm">Portal de Gestão Escolar</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Acadêmico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Seu email"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all ${
                loading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]'
              }`}
            >
              {loading ? 'Autenticando...' : 'Entrar no Sistema'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            {/* 🔥 NOVA SEÇÃO CADASTRO */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Ainda não possui conta?
              </p>
              <Link
                to="/register"
                className="inline-block mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Criar conta
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};