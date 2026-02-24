import React from 'react';
import { useDiaries } from './hooks/useDiaries';
import { Save, ChevronRight, BookOpen, Sun, Sunset, Moon, Calendar } from 'lucide-react';
import { Header } from '../../components/Header';

export const DiariesView = () => {
  const {
    selectedClass, setSelectedClass,
    attendance, handleAttendanceChange, saveAttendance,
    turmasPorTurno, students, loading
  } = useDiaries();

  const getTurnoIcon = (turno) => {
    if (turno === 'Manhã') return <Sun className="w-4 h-4 text-amber-500" />;
    if (turno === 'Tarde') return <Sunset className="w-4 h-4 text-orange-500" />;
    return <Moon className="w-4 h-4 text-indigo-400" />;
  };

  if (!selectedClass) {
    return (
      <div className="space-y-8">
        <Header title="Frequência Diária" subtitle="Selecione a turma para realizar a chamada." />
        
        {turmasPorTurno.map((grupo) => (
          <div key={grupo.turno} className="space-y-4">
            {grupo.salas.length > 0 && (
              <>
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  {getTurnoIcon(grupo.turno)}
                  <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">{grupo.turno}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grupo.salas.map((sala) => (
                    <button
                      key={sala.id}
                      onClick={() => setSelectedClass(sala.id)}
                      className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all text-left group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 text-gray-400 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{sala.nome}</h4>
                          <p className="text-[10px] text-gray-400 uppercase font-semibold">Abrir Diário</p>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-200 group-hover:text-indigo-500 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
        {turmasPorTurno.every(g => g.salas.length === 0) && (
          <div className="text-center p-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500">Nenhuma turma encontrada para este professor.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button onClick={() => setSelectedClass(null)} className="text-xs text-indigo-600 hover:text-indigo-800 mb-2 block font-bold uppercase tracking-tight">
            ← Voltar para turnos
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Chamada: Turma {selectedClass}</h2>
          <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 active:scale-95"
          onClick={saveAttendance}
          disabled={loading}
        >
          <Save className="w-5 h-5" /> {loading ? 'Enviando...' : 'Finalizar Chamada'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Aluno</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase text-center w-32">Presença</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && students.length === 0 ? (
              <tr><td colSpan="2" className="p-10 text-center text-gray-400">Carregando alunos...</td></tr>
            ) : (
              students.map((student) => {
                const faltas = attendance[student.id] || 0;
                return (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-gray-700 text-sm">{student.nome}</p>
                      <p className="text-[9px] text-gray-400 italic">RA: {student.ra}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <input
                          type="number"
                          min="0"
                          value={faltas}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                          className={`w-16 h-9 rounded-lg text-center font-bold border outline-none transition-all 
                            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                            ${faltas > 0
                              ? 'border-red-500 bg-red-50 text-red-600 shadow-sm shadow-red-100'
                              : 'border-gray-200 text-indigo-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                            }`}
                        />
                        <span className={`text-[8px] font-bold uppercase tracking-tighter whitespace-nowrap
                          ${faltas > 0 ? 'text-red-500' : 'text-indigo-500'}`}>
                          {faltas > 0 ? `${faltas} Aulas Perdidas` : 'Presente'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};