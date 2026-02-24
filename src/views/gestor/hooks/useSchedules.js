import { useState, useEffect } from 'react';
import { apiClient } from '../../../services/apiClient';

export const useSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await apiClient('/horarios');
      setSchedules(res || []);
    } catch (err) {
      console.error('Erro ao carregar horários:', err);
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (data) => {
    setLoading(true);
    try {
      const res = await apiClient('/horarios', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      setSchedules(prev => [...prev, res]);
    } catch (err) {
      console.error('Erro ao criar horário:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (id, data) => {
    setLoading(true);
    try {
      const res = await apiClient(`/horarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      setSchedules(prev => prev.map(s => s.id === id ? res : s));
    } catch (err) {
      console.error('Erro ao atualizar horário:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id) => {
    setLoading(true);
    try {
      await apiClient(`/horarios/${id}`, { method: 'DELETE' });
      setSchedules(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Erro ao deletar horário:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    schedules,
    loading,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    fetchAll
  };
};