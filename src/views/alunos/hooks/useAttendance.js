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
      const data = await apiClient(`/presencas/aluno/${user.id}`);
      
      const agrupado = (data || []).reduce((acc, curr) => {
        const materiaNome = curr.alocacao?.disciplina?.nome || "Outras";
        const cargaHorariaOriginal = curr.alocacao?.disciplina?.cargaHoraria || 0;
        
        if (!acc[materiaNome]) {
          acc[materiaNome] = { 
            materia: materiaNome, 
            total: cargaHorariaOriginal, 
            faltas: 0 
          };
        }

        const numFaltas = Number(curr.quantidadefaltas) || 0;
        
        const faltasEfetivas = (numFaltas === 0 && (curr.status === 'FALTA' || curr.status === 'F')) ? 1 : numFaltas;

        acc[materiaNome].faltas += faltasEfetivas;

        return acc;
      }, {});

      const listaFormatada = Object.values(agrupado).map(item => {
        const freq = item.total > 0 
          ? (((item.total - item.faltas) / item.total) * 100).toFixed(1)
          : "100.0";
          
        return {
          ...item,
          presenca: freq,
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