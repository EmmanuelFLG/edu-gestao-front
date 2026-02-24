import React from 'react';
import { Clock, Coffee } from 'lucide-react';
import { useSchedule } from './hooks/useSchedule';
import { Header } from '../../components/Header';

export const ScheduleView = ({ user }) => {
  const { diasDisplay, diasChave, gradeHoraria, loading } = useSchedule(user);

  if (loading) return <div className="p-10 text-center text-gray-400">Carregando grade...</div>;

  return (
    <div className="space-y-6">
      <Header
        title="Horário de Aula"
        subtitle="Consulte seus horários e salas de aula para a semana."
        icon={Clock}
      />

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-600">
                <th className="p-4 text-left text-xs font-bold text-white uppercase tracking-wider w-28 border-r border-indigo-500/30">
                  Horário
                </th>
                {diasDisplay.map(dia => (
                  <th key={dia} className="p-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    {dia}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gradeHoraria.map((linha, i) => {
                if (linha.isIntervalo) {
                  return (
                    <tr key="intervalo" className="bg-gray-100/80 border-y border-gray-200">
                      <td className="p-4 font-bold text-indigo-700 bg-gray-50/50 border-r border-gray-100 tabular-nums text-sm">
                        {linha.hora}
                      </td>
                      <td colSpan={5} className="p-2 text-center italic text-gray-500 text-xs font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <Coffee className="w-3 h-3" /> Intervalo para lanche
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-indigo-700 bg-gray-50/50 border-r border-gray-100 tabular-nums text-sm">
                      {linha.hora}
                    </td>
                    {diasChave.map(diaChave => {
                      const aula = linha.aulasDoDia[diaChave];
                      const temAula = aula.materia !== '---';

                      return (
                        <td key={diaChave} className="p-4 min-w-[150px]">
                          <div className="flex flex-col">
                            <span className={`text-sm font-semibold ${temAula ? 'text-gray-800' : 'text-gray-300'}`}>
                              {aula.materia}
                            </span>
                            {temAula && (
                              <span className="text-[10px] font-bold text-indigo-500 uppercase mt-0.5">
                                {aula.sala}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-[11px] text-gray-500 text-center uppercase font-bold tracking-widest">
          Sistema Escolar • Ano Letivo 2026
        </p>
      </div>
    </div>
  );
};