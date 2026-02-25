import React from 'react';
import { StatCard } from '../../components/StatCard';
import { Header } from '../../components/Header';
import { Clock, AlertTriangle, Megaphone, Info } from 'lucide-react';

export const StudentDashboard = ({ user, stats }) => (
  <div className="space-y-6">
    <Header title="Painel do Aluno" subtitle={`Olá, ${user?.nome || 'Aluno'}. Acompanhe seu desempenho.`}/>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard 
        title="Matérias em Alerta" 
        value={stats?.materiasAlerta} 
        icon={AlertTriangle} 
        color={stats?.materiasAlerta > 0 ? "bg-red-500 text-red-500" : "bg-green-500 text-green-500"} 
        trend={stats?.materiasAlerta > 0 ? "Média abaixo de 7.0" : "Desempenho excelente"} 
      />

      <StatCard
        title="Faltas Restantes"
        value={stats?.faltasRestantes}
        icon={Clock}
        color={stats?.nivelRiscoFalta === 'alto' ? "bg-orange-500 text-orange-500" : "bg-indigo-500 text-indigo-500"}
        trend={`Você possui ${stats?.faltasAtuais} faltas registradas`}
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-indigo-600" /> Horário das Aulas (Hoje)
        </h3>
        <div className="space-y-3">
          {stats?.aulasHoje?.length > 0 ? (
            stats.aulasHoje.map((aula, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-300 transition-all group">
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold text-gray-400 tabular-nums">
                    {aula.horaInicio?.slice(0, 5) || '--:--'}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {aula.disciplina?.nome}
                    </p>
                    <p className="text-xs text-gray-500 uppercase font-medium">{aula.sala}</p>
                  </div>
                </div>
                <Info className="w-4 h-4 text-gray-300 group-hover:text-indigo-400" />
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-gray-500 py-6">Nenhuma aula para hoje.</p>
          )}
        </div>
      </div>
    </div>
  </div>
);