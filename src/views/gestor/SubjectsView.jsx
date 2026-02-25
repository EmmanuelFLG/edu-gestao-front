import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Header } from '../../components/Header';
import { useSubjects } from './hooks/useSubjects';

export const SubjectsView = () => {
  const { subjects, loading, createSubject, updateSubject, deleteSubject } = useSubjects();
  const [newSubject, setNewSubject] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState('');

  const handleAdd = async () => {
    if (!newSubject.trim()) return;
    await createSubject({ nome: newSubject });
    setNewSubject('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta disciplina?')) {
      await deleteSubject(id);
      const index = subjects.findIndex(s => s.id === id);
      if (index > -1) subjects.splice(index, 1);
    }
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setEditData(s.nome);
  };

  const handleUpdate = async (id) => {
    await updateSubject(id, { nome: editData });
    const index = subjects.findIndex(s => s.id === id);
    if (index > -1) subjects[index].nome = editData;
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <Header title="Disciplinas" subtitle="Gerencie as disciplinas disponíveis no sistema." />

      <div className="flex gap-2">
        <input type="text" placeholder="Nova disciplina" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="flex-1 px-4 py-3 border rounded-lg" />
        <button onClick={handleAdd} disabled={loading} className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50">
          <Plus className="w-4 h-4" /> Adicionar
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Disciplina</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="2" className="p-10 text-center text-gray-400">Carregando disciplinas...</td></tr>
            ) : (
              subjects.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    {editingId === s.id ? (
                      <input value={editData} onChange={(e) => setEditData(e.target.value)} />
                    ) : s.nome}
                  </td>
                  <td className="p-4 flex gap-2">
                    {editingId === s.id ? (
                      <>
                        <button onClick={() => handleUpdate(s.id)} className="text-green-500 hover:text-green-700"><Check /></button>
                        <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700"><X /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(s)} className="text-blue-500 hover:text-blue-700"><Edit2 /></button>
                        <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700"><Trash2 /></button>
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