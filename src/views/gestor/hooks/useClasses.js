import { useState, useEffect } from 'react';
import { apiClient } from '../../../services/apiClient';

export const useClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await apiClient('/turmas');
      setClasses(res || []);
    } catch (err) {
      console.error("Erro ao carregar turmas:", err);
    } finally {
      setLoading(false);
    }
  };

  const createClass = async (data) => {
    setLoading(true);
    try {
      const res = await apiClient('/turmas', { method: 'POST', body: JSON.stringify(data) });
      setClasses(prev => [...prev, res]);
    } catch (err) {
      console.error("Erro ao criar turma:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateClass = async (id, data) => {
    setLoading(true);
    try {
      const res = await apiClient(`/turmas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
      setClasses(prev => prev.map(c => c.id === id ? res : c));
    } catch (err) {
      console.error("Erro ao atualizar turma:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteClass = async (id) => {
    setLoading(true);
    try {
      await apiClient(`/turmas/${id}`, { method: 'DELETE' });
      setClasses(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Erro ao deletar turma:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClasses(); }, []);

  return { classes, loading, fetchClasses, createClass, updateClass, deleteClass };
};