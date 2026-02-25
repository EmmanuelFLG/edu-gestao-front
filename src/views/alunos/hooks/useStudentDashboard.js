import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../services/apiClient';

export const useStudentDashboard = (user) => {
  const [stats, setStats] = useState({
    materiasAlerta: 0,
    faltasAtuais: 0,
    faltasRestantes: 0,
    nivelRiscoFalta: 'baixo',
    aulasHoje: [],
    avisos: []
  });

  const fetchStudentData = useCallback(async () => {
    if (!user?.id || user.role !== 'ALUNO') return;

    try {
      const matriculas = await apiClient(`/matriculas/aluno/${user.id}`);
      const matriculaAtiva = matriculas[0];
      if (!matriculaAtiva) return;

      const turmaId = matriculaAtiva.turma?.id;

      let cargaHorariaTotal = 0;
      try {
        const alocacoes = await apiClient(`/alocacoes/turma/${turmaId}`);
        cargaHorariaTotal = alocacoes.reduce((acc, curr) => acc + (curr.disciplina?.cargaHoraria || 0), 0);
      } catch (e) { console.error("Erro alocacoes"); }

      let alertasNota = 0;
      try {
        const notasData = await apiClient(`/notas/aluno/${user.id}`);
        
        const agrupado = (notasData || []).reduce((acc, nota) => {
          const nomeDisc = nota.disciplina?.nome || "Disciplina";
          if (!acc[nomeDisc]) acc[nomeDisc] = [];
          
          const mediaBimestre = (nota.n1 + nota.n2 + nota.n3) / 3;
          acc[nomeDisc].push(mediaBimestre);
          return acc;
        }, {});

        alertasNota = Object.values(agrupado).filter(mediasBimestres => {
          const soma = mediasBimestres.reduce((a, b) => a + b, 0);
          const mediaParcial = soma / mediasBimestres.length;
          return mediaParcial < 7.0;
        }).length;

      } catch (e) { console.error("Erro notas:", e); }

      let totalFaltasReais = 0;
      try {
        const presencas = await apiClient(`/presencas/aluno/${user.id}`);
        totalFaltasReais = presencas.reduce((acc, curr) => acc + (curr.quantidadefaltas || 0), 0);
      } catch (e) { console.error("Erro presencas"); }

      let aulasHoje = [];
      try {
        const horarios = await apiClient(`/horarios/turma/${turmaId}`);
        const diasSemana = ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'];
        const hojeNome = diasSemana[new Date().getDay()];
        
        aulasHoje = horarios
          .filter(h => h.diaSemana === hojeNome)
          .sort((a, b) => a.aulaNumero - b.aulaNumero)
          .map(h => ({
            horaInicio: h.horaInicio,
            disciplina: h.alocacao.disciplina,
            sala: h.sala
          }));
      } catch (e) { console.error("Erro horários"); }

      const limiteFaltasTotal = cargaHorariaTotal > 0 ? (cargaHorariaTotal * 0.25) : 200;
      const restantes = Math.max(0, Math.floor(limiteFaltasTotal - totalFaltasReais));

      setStats({
        materiasAlerta: alertasNota,
        faltasAtuais: totalFaltasReais,
        faltasRestantes: restantes,
        nivelRiscoFalta: (totalFaltasReais / limiteFaltasTotal) > 0.18 ? 'alto' : 'baixo',
        aulasHoje: aulasHoje,
        avisos: [
          { tipo: 'informativo', titulo: 'Status', mensagem: 'Dados atualizados com base no seu boletim.' }
        ]
      });

    } catch (err) {
      console.error("Erro geral dashboard:", err);
    }
  }, [user]);

  useEffect(() => { fetchStudentData(); }, [fetchStudentData]);

  return stats;
};