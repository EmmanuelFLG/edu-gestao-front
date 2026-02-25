import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Header } from '../../components/Header';
import { useAllocations } from './hooks/useAllocations';

export const AllocationsView = () => {
  const { allocations, professors, subjects, classes, loading, createAllocation, updateAllocation, deleteAllocation } = useAllocations();
  const [newAllocation, setNewAllocation] = useState({ professorId: '', disciplinaId: '', turmaId: '' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleAdd = async () => {
    const { professorId, disciplinaId, turmaId } = newAllocation;
    if (!professorId || !disciplinaId || !turmaId) return;

    await createAllocation(newAllocation);
    setNewAllocation({ professorId: '', disciplinaId: '', turmaId: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta alocação?')) {
      await deleteAllocation(id);
      allocations.splice(allocations.findIndex(a => a.id === id), 1);
    }
  };

  const handleEdit = (a) => {
    setEditingId(a.id);
    setEditData({
      professorId: a.professor?.id,
      disciplinaId: a.disciplina?.id,
      turmaId: a.turma?.id
    });
  };

  const handleUpdate = async (id) => {
    await updateAllocation(id, editData);
    const index = allocations.findIndex(a => a.id === id);
    allocations[index] = { ...allocations[index], professor: professors.find(p => p.id == editData.professorId), disciplina: subjects.find(s => s.id == editData.disciplinaId), turma: classes.find(c => c.id == editData.turmaId) };
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <Header title="Alocações" subtitle="Gerencie as alocações de professores, disciplinas e turmas." />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <select value={newAllocation.professorId} onChange={(e) => setNewAllocation({...newAllocation, professorId: e.target.value})} className="px-3 py-2 border rounded-lg">
          <option value="">Selecionar Professor</option>
          {professors.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>

        <select value={newAllocation.disciplinaId} onChange={(e) => setNewAllocation({...newAllocation, disciplinaId: e.target.value})} className="px-3 py-2 border rounded-lg">
          <option value="">Selecionar Disciplina</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
        </select>

        <select value={newAllocation.turmaId} onChange={(e) => setNewAllocation({...newAllocation, turmaId: e.target.value})} className="px-3 py-2 border rounded-lg">
          <option value="">Selecionar Turma</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>

        <button onClick={handleAdd} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          <Plus className="w-4 h-4" /> Adicionar
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Professor</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Disciplina</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Turma</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="4" className="p-10 text-center text-gray-400">Carregando alocações...</td></tr>
            ) : (
              allocations.map(a => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    {editingId === a.id ? (
                      <select value={editData.professorId} onChange={(e) => setEditData({...editData, professorId: e.target.value})}>
                        {professors.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                      </select>
                    ) : a.professor?.nome}
                  </td>
                  <td className="p-4">
                    {editingId === a.id ? (
                      <select value={editData.disciplinaId} onChange={(e) => setEditData({...editData, disciplinaId: e.target.value})}>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                      </select>
                    ) : a.disciplina?.nome}
                  </td>
                  <td className="p-4">
                    {editingId === a.id ? (
                      <select value={editData.turmaId} onChange={(e) => setEditData({...editData, turmaId: e.target.value})}>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                      </select>
                    ) : a.turma?.nome}
                  </td>
                  <td className="p-4 flex gap-2">
                    {editingId === a.id ? (
                      <>
                        <button onClick={() => handleUpdate(a.id)} className="text-green-500 hover:text-green-700"><Check /></button>
                        <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700"><X /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(a)} className="text-blue-500 hover:text-blue-700"><Edit2 /></button>
                        <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:text-red-700"><Trash2 /></button>
                      </>
                    )}
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