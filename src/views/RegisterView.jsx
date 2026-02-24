import React from 'react';
import { Link } from 'react-router-dom';
import { School, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useRegister } from '../hooks/useRegister';

export default function RegisterView() {

  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    loading,
    error,
    handleRegister
  } = useRegister();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">

        <div className="p-8 bg-indigo-600 text-center">
          <div className="inline-flex p-3 bg-white/20 rounded-xl mb-4 backdrop-blur-sm">
            <School className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Criar Conta</h1>
          <p className="text-indigo-100 text-sm">Cadastre-se no EduManager Pro</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleRegister} className="space-y-6">

            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Acadêmico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
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
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium transition-all ${
                loading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]'
              }`}
            >
              {loading ? 'Criando conta...' : 'Cadastrar'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">Já possui conta?</p>
              <Link
                to="/"
                className="inline-block mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Voltar para login
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}