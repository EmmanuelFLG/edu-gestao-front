import { useState, useEffect, useMemo, useCallback } from 'react';
import { apiClient } from '../../../services/apiClient';

export const useAttendance = (user) => {
  const [resumoFrequencia, setResumoFrequencia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAttendance = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      // Rota para o seu PresencaController no Java
      const data = await apiClient(`/presencas/aluno/${user.id}`);
      
      const agrupado = (data || []).reduce((acc, curr) => {
        // Pega o nome e a Carga Horária (CH) da disciplina que você inseriu via SQL
        const materiaNome = curr.alocacao?.disciplina?.nome || "Outras";
        const cargaHorariaOriginal = curr.alocacao?.disciplina?.cargaHoraria || 0;
        
        if (!acc[materiaNome]) {
          acc[materiaNome] = { 
            materia: materiaNome, 
            total: cargaHorariaOriginal, // Usa o valor fixo do banco (ex: 80h)
            faltas: 0 
          };
        }

        // Soma o campo 'quantidadefaltas' (minúsculo conforme seu modelo)
        const numFaltas = Number(curr.quantidadefaltas) || 0;
        
        // Se status for 'FALTA' mas o campo estiver zerado, assume 1 hora de falta
        const faltasEfetivas = (numFaltas === 0 && (curr.status === 'FALTA' || curr.status === 'F')) ? 1 : numFaltas;

        acc[materiaNome].faltas += faltasEfetivas;

        return acc;
      }, {});

      // Formata a lista para o componente exibir
      const listaFormatada = Object.values(agrupado).map(item => {
        // Cálculo da frequência: ((Carga Horária - Faltas) / Carga Horária) * 100
        const freq = item.total > 0 
          ? (((item.total - item.faltas) / item.total) * 100).toFixed(1)
          : "100.0";
          
        return {
          ...item,
          presenca: freq,
          // Calcula quanto é o limite de 25% para essa matéria específica
          limiteFaltas: Math.floor(item.total * 0.25) 
        };
      });

      setResumoFrequencia(listaFormatada);
    } catch (err) {
      console.error("Erro ao carregar dados de frequência:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  // Estatísticas gerais do cabeçalho
  const statsGerais = useMemo(() => {
    if (resumoFrequencia.length === 0) return { presencaGeral: "0", situacao: "---", limiteLegal: "25%" };

    const totalHorasAno = resumoFrequencia.reduce((acc, item) => acc + Number(item.total), 0);
    const totalFaltasAno = resumoFrequencia.reduce((acc, item) => acc + Number(item.faltas), 0);
    
    const mediaGeral = totalHorasAno > 0 
      ? (((totalHorasAno - totalFaltasAno) / totalHorasAno) * 100).toFixed(1)
      : "100.0";

    return {
      presencaGeral: mediaGeral,
      situacao: Number(mediaGeral) >= 75 ? 'Regular' : 'Risco de Reprovação',
      limiteLegal: "25%"
    };
  }, [resumoFrequencia]);

  return { resumoFrequencia, statsGerais, loading, error };
};