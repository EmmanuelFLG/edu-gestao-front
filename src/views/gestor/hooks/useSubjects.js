import { useState, useEffect } from 'react';
import { apiClient } from '../../../services/apiClient';

export const useSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await apiClient('/disciplinas');
      setSubjects(res || []);
    } catch (err) {
      console.error("Erro ao carregar disciplinas:", err);
    } finally {
      setLoading(false);
    }
  };

  const createSubject = async (data) => {
    setLoading(true);
    try {
      const res = await apiClient('/disciplinas', { method: 'POST', body: JSON.stringify(data) });
      setSubjects(prev => [...prev, res]);
    } catch (err) {
      console.error("Erro ao criar disciplina:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSubject = async (id, data) => {
    setLoading(true);
    try {
      const res = await apiClient(`/disciplinas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
      setSubjects(prev => prev.map(s => s.id === id ? res : s));
    } catch (err) {
      console.error("Erro ao atualizar disciplina:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (id) => {
    setLoading(true);
    try {
      await apiClient(`/disciplinas/${id}`, { method: 'DELETE' });
      setSubjects(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error("Erro ao deletar disciplina:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubjects(); }, []);

  return { subjects, loading, fetchSubjects, createSubject, updateSubject, deleteSubject };
};