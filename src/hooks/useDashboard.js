import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../services/apiClient';

export const useDashboard = (user) => {
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    if (!user?.id || !user?.role) return;

    try {
      setLoading(true);
      const response = await apiClient(`/dashboard/${user.role.toLowerCase()}/${user.id}`);
      setData(response);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
      setError("Erro ao carregar indicadores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id, user?.role]);

  const stats = useMemo(() => {
    return {
     
      faltasAtuais: data?.faltasAtuais || 0,
      faltasRestantes: data?.faltasRestantes || 0,
      nivelRiscoFalta: data?.nivelRiscoFalta || 'baixo',
      
     
      performanceData: data?.performanceData || [], 
      genderData: data?.genderData || [],           
      
      totalAlunosEscola: data?.totalAlunosEscola || 0,
      alunosRiscoEvasao: data?.alunosRiscoEvasao || 0,
      totalProfessoresEscola: data?.totalProfessoresEscola || 0
    };
  }, [data]);

  return {
    stats,
    loading,
    error,
    refresh: fetchDashboardData
  };
};