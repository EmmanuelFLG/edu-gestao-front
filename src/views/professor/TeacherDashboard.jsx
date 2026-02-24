import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Megaphone, BarChart2 } from 'lucide-react';
import { Header } from '../../components/Header';

export const TeacherDashboard = ({ user, stats, loading }) => {
  // Ajuste: Verifica se tem dados. Se estiver carregando, podemos mostrar um estado de loading
  const hasPerformanceData = stats?.performanceData?.length > 0;

  return (
    <div className="space-y-6">
      <Header 
        title="Painel Pedagógico" 
        // Ajuste: Usando .nome (padrão do seu banco) em vez de .name
        subtitle={`Prof. ${user?.nome || 'Docente'}, veja o panorama das suas turmas.`} 
      />

      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-500">Calculando médias...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Gráfico de Médias - Agora ocupando a largura total ou metade conforme desejar */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-600" /> Médias de Desempenho por Turma
            </h3>
            
            <div className="h-80 w-full">
              {hasPerformanceData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="turma" 
                      axisLine={false}
                      tickLine={false}
                      tick={{fill: '#94a3b8', fontSize: 12}}
                    />
                    <YAxis 
                      domain={[0, 10]} 
                      ticks={[0, 2, 4, 6, 8, 10]} 
                      axisLine={false}
                      tickLine={false}
                      tick={{fill: '#94a3b8', fontSize: 12}}
                    /> 
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}} 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Bar 
                      name="Média Geral" 
                      dataKey="media" 
                      fill="#4f46e5" 
                      radius={[6, 6, 0, 0]} 
                      barSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <BarChart2 className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm italic">Nenhum dado de nota lançado para suas turmas.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};