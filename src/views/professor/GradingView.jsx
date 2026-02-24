import React from 'react';
import { useGrading } from './hooks/useGrading';
import { Save, Info, BookOpen, ChevronRight, Sun, Sunset } from 'lucide-react';
import { Header } from '../../components/Header';

export const GradingView = () => {
  const {
    selectedClass, setSelectedClass, selectedBimestre, setSelectedBimestre,
    turmasPorTurno, bimestres, students, updateLocalGrade, saveGrades, isSaving, loading
  } = useGrading(1);

  if (!selectedClass) {
    return (
      <div className="space-y-8">
        <Header title="Lançamento de Notas" subtitle="Selecione uma turma para gerenciar o desempenho." />
        
        {turmasPorTurno.map((grupo) => (
          grupo.salas.length > 0 && (
            <div key={grupo.turno} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                {grupo.turno === 'Manhã' ? <Sun className="w-4 h-4 text-amber-500" /> : <Sunset className="w-4 h-4 text-orange-500" />}
                <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">{grupo.turno}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grupo.salas.map((sala) => (
                  <button key={sala.id} onClick={() => setSelectedClass(sala.id)}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:border-indigo-500 transition-all text-left group flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 text-gray-400 rounded-lg group-hover:bg-indigo-50"><BookOpen className="w-5 h-5" /></div>
                      <div><h4 className="font-bold text-gray-800">{sala.nome}</h4><p className="text-[10px] text-gray-400 uppercase">Abrir Diário</p></div>
                    </div>
                    <ChevronRight className="text-gray-200 group-hover:text-indigo-500 w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={() => setSelectedClass(null)} className="text-xs text-indigo-600 font-bold uppercase">← Voltar para turmas</button>
        <div className="flex bg-gray-100 p-1 rounded-lg shadow-inner">
          {bimestres.map(b => (
            <button key={b} onClick={() => setSelectedBimestre(b)}
              className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${selectedBimestre === b ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}>
              {b}º Bimestre
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-700 text-sm font-medium"><Info className="w-4 h-4" /><span>Lançamento Progressivo Ativo</span></div>
          <button onClick={saveGrades} disabled={isSaving} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" /> {isSaving ? 'Gravando...' : 'Salvar Alterações'}
          </button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Estudante</th>
              {['N1', 'N2', 'N3'].map(n => <th key={n} className="p-4 text-[10px] font-bold text-gray-400 uppercase text-center">{n}</th>)}
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase text-center bg-gray-50">Média Final</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="5" className="p-10 text-center text-gray-400 italic">Sincronizando diário de classe...</td></tr>
            ) : (
              students.map((item) => {
                const studentId = item.id || item.matricula?.aluno?.id;
                const media = (((Number(item.n1) || 0) + (Number(item.n2) || 0) + (Number(item.n3) || 0)) / 3).toFixed(1);

                return (
                  <tr key={studentId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-semibold text-gray-700 text-sm">{item.matricula?.aluno?.nome || "Aluno"}</td>
                    {['n1', 'n2', 'n3'].map(field => (
                      <td key={field} className="p-4 text-center">
                        <input
                          type="number"
                          step="0.1"
                          value={item[field]}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => updateLocalGrade(studentId, field, e.target.value)}
                          className={`w-16 h-10 rounded-lg text-center font-bold text-lg border outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            item[field] < 7 && item[field] > 0 ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-gray-200 text-indigo-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50'
                          }`}
                        />
                      </td>
                    ))}
                    <td className={`p-4 text-center font-bold text-lg ${media < 7 ? 'text-red-500' : 'text-emerald-600'}`}>{media}</td>
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