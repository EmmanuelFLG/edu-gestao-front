import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Header } from '../../components/Header';
import { useClasses } from './hooks/useClasses';

export const ClassesView = () => {
  const { classes, loading, createClass, updateClass, deleteClass } = useClasses();
  const [newClass, setNewClass] = useState({ nome: '', serie: '', curso: '', turno: '', anoletivo: '' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleAdd = async () => {
    if (!newClass.nome || !newClass.serie) return;
    await createClass(newClass);
    setNewClass({ nome: '', serie: '', curso: '', turno: '', anoletivo: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta turma?')) {
      await deleteClass(id);
      const index = classes.findIndex(c => c.id === id);
      if (index > -1) classes.splice(index, 1);
    }
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setEditData({ ...c });
  };

  const handleUpdate = async (id) => {
    await updateClass(id, editData);
    const index = classes.findIndex(c => c.id === id);
    if (index > -1) classes[index] = { ...editData, id };
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <Header title="Turmas" subtitle="Gerencie as turmas do sistema." />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <input type="text" placeholder="Nome" value={newClass.nome} onChange={(e) => setNewClass({ ...newClass, nome: e.target.value })} className="px-3 py-2 border rounded-lg" />
        <input type="text" placeholder="Série" value={newClass.serie} onChange={(e) => setNewClass({ ...newClass, serie: e.target.value })} className="px-3 py-2 border rounded-lg" />
        <input type="text" placeholder="Curso" value={newClass.curso} onChange={(e) => setNewClass({ ...newClass, curso: e.target.value })} className="px-3 py-2 border rounded-lg" />
        <input type="text" placeholder="Turno" value={newClass.turno} onChange={(e) => setNewClass({ ...newClass, turno: e.target.value })} className="px-3 py-2 border rounded-lg" />
        <input type="text" placeholder="Ano Letivo" value={newClass.anoletivo} onChange={(e) => setNewClass({ ...newClass, anoletivo: e.target.value })} className="px-3 py-2 border rounded-lg" />
      </div>

      <button onClick={handleAdd} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
        <Plus className="w-4 h-4" /> Adicionar Turma
      </button>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Nome</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Série</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Curso</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Turno</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Ano Letivo</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="6" className="p-10 text-center text-gray-400">Carregando turmas...</td></tr>
            ) : (
              classes.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">{editingId === c.id ? <input value={editData.nome} onChange={(e) => setEditData({...editData, nome: e.target.value})} /> : c.nome}</td>
                  <td className="p-4">{editingId === c.id ? <input value={editData.serie} onChange={(e) => setEditData({...editData, serie: e.target.value})} /> : c.serie}</td>
                  <td className="p-4">{editingId === c.id ? <input value={editData.curso} onChange={(e) => setEditData({...editData, curso: e.target.value})} /> : c.curso}</td>
                  <td className="p-4">{editingId === c.id ? <input value={editData.turno} onChange={(e) => setEditData({...editData, turno: e.target.value})} /> : c.turno}</td>
                  <td className="p-4">{editingId === c.id ? <input value={editData.anoletivo} onChange={(e) => setEditData({...editData, anoletivo: e.target.value})} /> : c.anoletivo}</td>
                  <td className="p-4 flex gap-2">
                    {editingId === c.id ? (
                      <>
                        <button onClick={() => handleUpdate(c.id)} className="text-green-500 hover:text-green-700"><Check /></button>
                        <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700"><X /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(c)} className="text-blue-500 hover:text-blue-700"><Edit2 /></button>
                        <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700"><Trash2 /></button>
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