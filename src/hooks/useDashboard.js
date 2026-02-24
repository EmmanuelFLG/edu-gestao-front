import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../services/apiClient';

export const useDashboard = (user) => {
  const [data, setData] = useState(null); // Estado para os dados da API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Busca os dados do Dashboard baseado no cargo (role)
  const fetchDashboardData = async () => {
    if (!user?.id || !user?.role) return;

    try {
      setLoading(true);
      // O endpoint muda conforme o perfil para buscar dados específicos
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

  // 2. Processamento Seguro dos Dados (Valores Padrão)
  // Usamos useMemo para garantir que se o 'data' for null, 
  // o Front receba objetos vazios em vez de quebrar.
  const stats = useMemo(() => {
    return {
      // --- DADOS DO ALUNO ---
      faltasAtuais: data?.faltasAtuais || 0,
      faltasRestantes: data?.faltasRestantes || 0,
      nivelRiscoFalta: data?.nivelRiscoFalta || 'baixo',
      
      // --- DADOS DO PROFESSOR ---
      performanceData: data?.performanceData || [], // Gráfico de barras (Médias)
      genderData: data?.genderData || [],           // Gráfico de pizza (Gênero)
      
      // --- DADOS DO DIRETOR ---
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