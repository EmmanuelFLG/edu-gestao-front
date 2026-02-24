import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { useAttendance } from './hooks/useAttendance';
import { Header } from '../../components/Header';

export const AttendanceView = ({ user }) => {
  const { resumoFrequencia, statsGerais, loading } = useAttendance(user);

  if (loading) return <div className="p-10 text-center text-gray-500">Processando dados de frequência...</div>;

  return (
    <div className="space-y-6">
      <Header title="Frequência Escolar" subtitle="Resumo consolidado de presenças e faltas." icon={CheckCircle} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Frequência Total</p>
          <p className="text-3xl font-black text-gray-800 mt-1">{statsGerais.presencaGeral}%</p>
          <div className="mt-4 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-700 ${Number(statsGerais.presencaGeral) < 75 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                 style={{ width: `${statsGerais.presencaGeral}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center items-center">
          <p className="text-xs font-bold text-gray-400 uppercase">Situação</p>
          <p className={`text-xl font-bold mt-2 ${statsGerais.situacao === 'Regular' ? 'text-emerald-600' : 'text-red-500'}`}>
            {statsGerais.situacao}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center items-center">
          <p className="text-xs font-bold text-gray-400 uppercase">Limite LDB</p>
          <p className="text-xl font-bold text-amber-600 mt-2">Max 25% Faltas</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Matéria</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase text-center">Carga Horária (Aulas)</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase text-center">Total de Faltas</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase text-center">% Presença</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {resumoFrequencia.length > 0 ? (
              resumoFrequencia.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50">
                  <td className="p-4 font-bold text-gray-700">{item.materia}</td>
                  <td className="p-4 text-center text-gray-500">{item.total}</td>
                  <td className="p-4 text-center font-bold text-red-500">{item.faltas}</td>
                  <td className="p-4 text-center">
                    <span className={`font-bold ${Number(item.presenca) < 75 ? 'text-red-500' : 'text-emerald-600'}`}>
                      {item.presenca}%
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="p-10 text-center text-gray-400 italic">Nenhum registro de falta no sistema.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};