import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Megaphone, BarChart2, Users } from 'lucide-react';
import { Header } from '../../components/Header';

export const TeacherDashboard = ({ user, stats, colors = ['#6366f1', '#f43f5e'] }) => {
  // Verificação de segurança para as listas
  const hasPerformanceData = stats?.performanceData?.length > 0;
  const hasGenderData = stats?.genderData?.length > 0;

  return (
    <div className="space-y-6">
      <Header 
        title="Painel Pedagógico" 
        subtitle={`Prof. ${user?.name}, veja o panorama das suas turmas.`} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Médias */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" /> Médias por Turma
          </h3>
          <div className="h-64 flex items-center justify-center">
            {hasPerformanceData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="turma" />
                  <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} /> 
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar name="Média" dataKey="media" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-sm italic">Nenhum dado de média disponível.</p>
            )}
          </div>
        </div>

        {/* Gráfico de Gênero */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" /> Composição (Gênero)
          </h3>
          <div className="h-64 flex items-center justify-center">
            {hasGenderData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {stats.genderData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-sm italic">Sem dados de composição.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-indigo-600" /> Avisos aos Docentes
        </h3>
        <p className="text-sm text-gray-600 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-500 italic">
          Lembre-se de fechar o diário do 1º bimestre até o dia 20/03.
        </p>
      </div>
    </div>
  );
};