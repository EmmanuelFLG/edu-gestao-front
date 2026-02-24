import React, { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Header } from '../../components/Header';
import { useSchedules } from './hooks/useSchedules';
import { useAllocations } from './hooks/useAllocations';

export const SchedulesView = () => {
  // Agora pegamos os dias diretamente do Hook
  const { 
    schedules, 
    loading, 
    createSchedule, 
    updateSchedule, 
    deleteSchedule, 
    diasChave,
    diasDisplay 
  } = useSchedules();
  
  const { allocations } = useAllocations();

  const [newSchedule, setNewSchedule] = useState({
    alocacaoId: '',
    diaSemana: '',
    horaInicio: '',
    horaFim: '',
    sala: ''
  });

  const [editingId, setEditingId] = useState(null);

  const handleSave = async () => {
    const { alocacaoId, diaSemana, horaInicio, horaFim, sala } = newSchedule;

    if (!alocacaoId || !diaSemana || !horaInicio || !horaFim || !sala) {
      alert('Preencha todos os campos!');
      return;
    }

    const payload = { alocacaoId, diaSemana, horaInicio, horaFim, sala };

    try {
      if (editingId) {
        const updated = await updateSchedule(editingId, payload);
        // O setSchedules agora funciona porque vem do useSchedules
        setEditingId(null);
      } else {
        await createSchedule(payload);
      }

      setNewSchedule({ alocacaoId: '', diaSemana: '', horaInicio: '', horaFim: '', sala: '' });
    } catch (err) {
      console.error('Erro ao salvar horário:', err);
    }
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setNewSchedule({
      alocacaoId: s.alocacaoId || '',
      diaSemana: s.diaSemana,
      horaInicio: s.horaInicio,
      horaFim: s.horaFim,
      sala: s.sala || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este horário?')) {
      await deleteSchedule(id);
    }
  };

  return (
    <div className="space-y-6">
      <Header title="Horários" subtitle="Gerencie os horários de aulas das turmas." />

      <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
        <select
          value={newSchedule.alocacaoId}
          onChange={(e) => setNewSchedule({ ...newSchedule, alocacaoId: parseInt(e.target.value) })}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Selecionar Alocação</option>
          {allocations.map(a => (
            <option key={a.id} value={a.id}>
              {a.professor?.nome} - {a.disciplina?.nome} - {a.turma?.nome}
            </option>
          ))}
        </select>

        {/* Usando os dados que vieram do Hook */}
        <select
          value={newSchedule.diaSemana}
          onChange={(e) => setNewSchedule({ ...newSchedule, diaSemana: e.target.value })}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Dia da Semana</option>
          {diasChave.map((dia, index) => (
            <option key={dia} value={dia}>
              {diasDisplay[index]}
            </option>
          ))}
        </select>

        <input
          type="time"
          value={newSchedule.horaInicio}
          onChange={(e) => setNewSchedule({ ...newSchedule, horaInicio: e.target.value })}
          className="px-3 py-2 border rounded-lg"
        />

        <input
          type="time"
          value={newSchedule.horaFim}
          onChange={(e) => setNewSchedule({ ...newSchedule, horaFim: e.target.value })}
          className="px-3 py-2 border rounded-lg"
        />

        <input
          type="text"
          placeholder="Sala"
          value={newSchedule.sala}
          onChange={(e) => setNewSchedule({ ...newSchedule, sala: e.target.value })}
          className="px-3 py-2 border rounded-lg"
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
          <Plus className="w-4 h-4" /> {editingId ? 'Atualizar Horário' : 'Adicionar Horário'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Professor</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Disciplina</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Turma</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Dia</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Início</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Fim</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Sala</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && schedules.length === 0 ? (
              <tr><td colSpan="8" className="p-10 text-center text-gray-400">Carregando horários...</td></tr>
            ) : (
              schedules.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">{s.professorNome || '-'}</td>
                  <td className="p-4">{s.disciplinaNome || '-'}</td>
                  <td className="p-4">{s.turmaNome || '-'}</td>
                  {/* Busca o nome amigável para exibir na tabela também */}
                  <td className="p-4">
                    {diasDisplay[diasChave.indexOf(s.diaSemana)] || s.diaSemana}
                  </td>
                  <td className="p-4">{s.horaInicio}</td>
                  <td className="p-4">{s.horaFim}</td>
                  <td className="p-4">{s.sala}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleEdit(s)} className="text-yellow-500 hover:bg-yellow-50 p-1 rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};