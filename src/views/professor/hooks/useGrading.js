import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../services/apiClient';
import { useAuth } from '../../../context/AuthContext';

export const useGrading = (selectedSubject = 1) => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedBimestre, setSelectedBimestre] = useState(1);
  const [turmasDoBanco, setTurmasDoBanco] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const bimestres = [1, 2, 3, 4];

  // Busca as turmas do professor logado
  useEffect(() => {
    const fetchTurmas = async () => {
      if (!user?.id) return;
      try {
        const data = await apiClient(`/turmas/professor/${user.id}`);
        setTurmasDoBanco(data || []);
      } catch (err) {
        console.error("Erro ao carregar turmas:", err);
      }
    };
    fetchTurmas();
  }, [user]);

  // Funcao para carregar notas ou lista de alunos
  const fetchGradingData = useCallback(async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);
      // Tenta buscar notas já salvas
      const data = await apiClient(
        `/notas/turma/${selectedClass}/disciplina/${selectedSubject}?bimestre=${selectedBimestre}`
      );

      if (data && Array.isArray(data) && data.length > 0) {
        setStudents(data);
      } else {
        // Se nao tiver notas busca alunos alocados para iniciar lista zerada
        const alunosDaTurma = await apiClient(`/turmas/alocacao/${selectedClass}/alunos`);
        
        const notasIniciais = (alunosDaTurma || []).map(a => ({
          id: null,
          n1: 0, n2: 0, n3: 0,
          bimestre: selectedBimestre,
          matricula: {
            id: a.matricula_id || a.id,
            aluno: { 
              nome: a.nome || a.aluno_nome || (a.aluno && a.aluno.nome), 
              id: a.aluno_id || a.id 
            }
          }
        }));
        setStudents(notasIniciais);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedSubject, selectedBimestre]);

  useEffect(() => {
    fetchGradingData();
  }, [fetchGradingData]);

  // Atualiza o estado local pra ficar sempre entre 0 ou 10
  const updateLocalGrade = (studentId, field, value) => {
    let cleanValue = value === "" ? 0 : parseFloat(value);
    if (isNaN(cleanValue)) cleanValue = 0;
    if (cleanValue > 10) cleanValue = 10;
    if (cleanValue < 0) cleanValue = 0;

    setStudents(prev => prev.map(item => {
      // Identifica o aluno pelo ID da Nota ou pelo ID do Aluno na Matrícula  
      const isTarget = item.id === studentId || item.matricula?.aluno?.id === studentId;
      if (isTarget) {
        return { ...item, [field]: cleanValue };
      }
      return item;
    }));
  };

  // Salva no banco e sincroniza
  const saveGrades = async () => {
    try {
      setIsSaving(true);
      const payload = students.map(s => ({
        id: s.id || null, 
        n1: Number(s.n1) || 0,
        n2: Number(s.n2) || 0,
        n3: Number(s.n3) || 0,
        bimestre: selectedBimestre,
        matricula: { id: s.matricula?.id || s.matricula_id },
        disciplina: { id: selectedSubject }
      }));

      await apiClient('/notas/bulk-update', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      alert("Notas salvas com sucesso!");
      // Atualiza a tela com os IDs e dados reais vindos do banco
      await fetchGradingData(); 
    } catch (err) {
      if (err.message?.includes('JSON') || err.name === 'SyntaxError') {
        alert("Notas salvas com sucesso!");
        await fetchGradingData();
      } else {
        alert("Erro ao salvar notas. Tente novamente.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const turmasPorTurno = [
    {turno: 'Manhã', salas: turmasDoBanco.filter(t => t.turno?.toUpperCase().includes('MANH')).map(t => ({ id: t.alocacao_id, nome: `${t.turma} - ${t.disciplina}` }))},
    {turno: 'Tarde', salas: turmasDoBanco.filter(t => t.turno?.toUpperCase().includes('TARD')).map(t => ({ id: t.alocacao_id, nome: `${t.turma} - ${t.disciplina}` }))}
  ];

  return {selectedClass, setSelectedClass, selectedBimestre, setSelectedBimestre, turmasPorTurno, bimestres, students, updateLocalGrade, saveGrades, isSaving, loading};
};