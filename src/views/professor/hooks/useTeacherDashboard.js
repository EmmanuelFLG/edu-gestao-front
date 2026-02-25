import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../services/apiClient';

export const useTeacherDashboard = (user) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ performanceData: [] });

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const turmas = await apiClient(`/turmas/professor/${user.id}`);
      
      if (!turmas || turmas.length === 0) {
        setStats({ performanceData: [] });
        return;
      }

      const performancePromises = turmas.map(async (t) => {
        try {
          const classId = t.alocacao_id || t.id; 
          const subjectId = t.disciplina_id || 1; 

          const notas = await apiClient(`/notas/turma/${classId}/disciplina/${subjectId}?bimestre=1`);

          if (notas && Array.isArray(notas) && notas.length > 0) {
            const soma = notas.reduce((acc, n) => acc + ((n.n1 + n.n2 + n.n3) / 3), 0);
            return {
              turma: `${t.turma} - ${t.disciplina}`,
              media: parseFloat((soma / notas.length).toFixed(1))
            };
          }
          return null;
        } catch (err) {
          return null; 
        }
      });

      const results = await Promise.all(performancePromises);
      setStats({
        performanceData: results.filter(r => r !== null)
      });

    } catch (err) {
      console.error("Erro no dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { stats, loading };
};