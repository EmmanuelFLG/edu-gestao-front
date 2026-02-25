import { useState, useEffect } from 'react';
import { apiClient } from '../../../services/apiClient';

export const useGrades = (user) => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGrades = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await apiClient(`/notas/aluno/${user.id}`);
      
      const agrupado = (data || []).reduce((acc, nota) => {
        const nomeDisc = nota.disciplina?.nome || "Disciplina";
        
        if (!acc[nomeDisc]) {
          acc[nomeDisc] = { 
            nome: nomeDisc, 
            detalhes: [null, null, null, null], 
            notas: [0, 0, 0, 0],               
            faltas: 0 
          };
        }

        if (nota.bimestre >= 1 && nota.bimestre <= 4) {
          const mediaBim = (nota.n1 + nota.n2 + nota.n3) / 3;
          
          acc[nomeDisc].detalhes[nota.bimestre - 1] = {
            n1: nota.n1,
            n2: nota.n2,
            n3: nota.n3,
            media: mediaBim
          };
          
          acc[nomeDisc].notas[nota.bimestre - 1] = mediaBim;
        }

        return acc;
      }, {});

      setDisciplinas(Object.values(agrupado));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGrades(); }, [user?.id]);

  const calcularMediaParcial = (notas) => {
    if (!notas) return "0.0";
    const notasPreenchidas = notas.filter(n => n > 0);
    if (notasPreenchidas.length === 0) return "0.0";
    const soma = notasPreenchidas.reduce((a, b) => a + b, 0);
    return (soma / notasPreenchidas.length).toFixed(1);
  };

  return { disciplinas, calcularMediaParcial, mediaAprovacao: 6.0, loading, error };
};