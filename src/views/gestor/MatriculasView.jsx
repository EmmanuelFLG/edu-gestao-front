import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { useMatriculas } from './hooks/useMatriculas';

export const MatriculasView = () => {

  const { alunos, turmas, createMatricula, loading } = useMatriculas();

  const [form, setForm] = useState({
    alunoId: '',
    turmaId: '',
    anoLetivo: ''
  });

  const handleSubmit = async () => {
    if (!form.alunoId || !form.turmaId || !form.anoLetivo) {
      alert("Preencha todos os campos");
      return;
    }

    await createMatricula(form);

    alert("Aluno matriculado com sucesso!");
    setForm({ alunoId: '', turmaId: '', anoLetivo: '' });
  };

  return (
    <div className="space-y-6">
      <Header title="Matrículas" subtitle="Matricule alunos nas turmas." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={form.alunoId}
          onChange={(e) => setForm({...form, alunoId: e.target.value})}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Selecione o aluno</option>
          {alunos.map(a => (
            <option key={a.id} value={a.id}>
              {a.nome}
            </option>
          ))}
        </select>

        <select
          value={form.turmaId}
          onChange={(e) => setForm({...form, turmaId: e.target.value})}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Selecione a turma</option>
          {turmas.map(t => (
            <option key={t.id} value={t.id}>
              {t.nome} - {t.serie}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Ano Letivo"
          value={form.anoLetivo}
          onChange={(e) => setForm({...form, anoLetivo: e.target.value})}
          className="px-3 py-2 border rounded-lg"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        Matricular
      </button>
    </div>
  );
};