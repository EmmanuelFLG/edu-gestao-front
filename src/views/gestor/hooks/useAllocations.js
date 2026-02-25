import { useState, useEffect } from 'react';
import { apiClient } from '../../../services/apiClient';

export const useAllocations = () => {
  const [allocations, setAllocations] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [allocsRes, profsRes, subsRes, classesRes] = await Promise.all([
        apiClient('/alocacoes'),
        apiClient('/professores'),   
        apiClient('/disciplinas'),  
        apiClient('/turmas'),       
      ]);

      setAllocations(allocsRes || []);
      setProfessors(profsRes || []);
      setSubjects(subsRes || []);
      setClasses(classesRes || []);
    } catch (err) {
      console.error('Erro ao carregar alocações:', err);
    } finally {
      setLoading(false);
    }
  };

  const createAllocation = async (data) => {
    setLoading(true);
    try {
      const payload = {
        professorId: data.professorId,
        disciplinaId: data.disciplinaId,
        turmaId: data.turmaId
      };

      const res = await apiClient('/alocacoes', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setAllocations(prev => [...prev, res]);
    } catch (err) {
      console.error('Erro ao criar alocação:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateAllocation = async (id, data) => {
    setLoading(true);
    try {
      const payload = {
        professorId: data.professorId,
        disciplinaId: data.disciplinaId,
        turmaId: data.turmaId
      };

      const res = await apiClient(`/alocacoes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      setAllocations(prev => prev.map(a => a.id === id ? res : a));
    } catch (err) {
      console.error('Erro ao atualizar alocação:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAllocation = async (id) => {
    setLoading(true);
    try {
      await apiClient(`/alocacoes/${id}`, { method: 'DELETE' });
      setAllocations(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Erro ao deletar alocação:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { allocations, professors, subjects, classes, loading, createAllocation, updateAllocation, deleteAllocation,fetchAll};
};