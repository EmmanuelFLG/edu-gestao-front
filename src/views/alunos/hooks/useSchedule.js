import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../services/apiClient';

export const useSchedule = (user) => {
  const [gradeHoraria, setGradeHoraria] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const diasChave = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'];
  const diasDisplay = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

  const processarDados = useCallback((data) => {
    const slots = [
      { hora: '07:00', aulaNumero: 1 },
      { hora: '07:50', aulaNumero: 2 },
      { hora: '08:40', aulaNumero: 3 },
      { hora: '09:30', isIntervalo: true },
      { hora: '09:50', aulaNumero: 4 },
      { hora: '10:40', aulaNumero: 5 },
    ];

    return slots.map(slot => {
      if (slot.isIntervalo) {
        return { hora: slot.hora, isIntervalo: true };
      }

      const aulasDoDia = {};
      diasChave.forEach(dia => {
        const aula = (data || []).find(h => 
          h.diaSemana === dia && h.aulaNumero === slot.aulaNumero
        );

        aulasDoDia[dia] = {
          materia: aula?.alocacao?.disciplina?.nome || '---',
          sala: aula?.sala || '-'
        };
      });

      return { hora: slot.hora, aulasDoDia, isIntervalo: false };
    });
  }, []);

  const fetchSchedule = useCallback(async () => {
    if (!user?.id) {
      setGradeHoraria(processarDados([]));
      return;
    }

    try {
      setLoading(true);
      const matriculas = await apiClient(`/matriculas/aluno/${user.id}`);
      const turmaId = matriculas[0]?.turma?.id;

      if (!turmaId) {
        setGradeHoraria(processarDados([]));
        return;
      }

      const data = await apiClient(`/horarios/turma/${turmaId}`);
      setGradeHoraria(processarDados(data));
    } catch (err) {
      console.error("Erro ao carregar horários:", err);
      setGradeHoraria(processarDados([]));
    } finally {
      setLoading(false);
    }
  }, [user?.id, processarDados]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  return { diasDisplay, diasChave, gradeHoraria, loading };
};