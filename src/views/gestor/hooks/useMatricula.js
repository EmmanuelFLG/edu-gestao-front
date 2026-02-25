import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8080';

export const useMatriculas = () => {

  const [matriculas, setMatriculas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    fetchAlunos();
    fetchTurmas();
  }, []);

  const fetchAlunos = async () => {
    try {
      const res = await fetch(`${API_URL}/alunos`);
      const data = await res.json();
      setAlunos(data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    }
  };

  const fetchTurmas = async () => {
    try {
      const res = await fetch(`${API_URL}/turmas`);
      const data = await res.json();
      setTurmas(data);
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
    }
  };

 
  const createMatricula = async ({ alunoId, turmaId, anoLetivo }) => {
    try {
      setLoading(true);

      const payload = {
        anoLetivo,
        ativa: true,
        aluno: { id: alunoId },
        turma: { id: turmaId }
      };

      const res = await fetch(`${API_URL}/matriculas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setMatriculas(prev => [...prev, data]);

      return data;

    } catch (error) {
      console.error("Erro ao criar matrícula:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  
  const getByTurma = async (turmaId) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/matriculas/turma/${turmaId}`);
      const data = await res.json();
      setMatriculas(data);

      return data;

    } catch (error) {
      console.error("Erro ao buscar por turma:", error);
    } finally {
      setLoading(false);
    }
  };

  
  const getByAluno = async (alunoId) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/matriculas/aluno/${alunoId}`);
      const data = await res.json();
      setMatriculas(data);

      return data;

    } catch (error) {
      console.error("Erro ao buscar por aluno:", error);
    } finally {
      setLoading(false);
    }
  };

  
  const deleteMatricula = async (id) => {
    try {
      setLoading(true);

      await fetch(`${API_URL}/matriculas/${id}`, {
        method: 'DELETE'
      });

      setMatriculas(prev => prev.filter(m => m.id !== id));

    } catch (error) {
      console.error("Erro ao remover matrícula:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    matriculas,
    alunos,
    turmas,
    loading,
    createMatricula,
    getByTurma,
    getByAluno,
    deleteMatricula
  };
};