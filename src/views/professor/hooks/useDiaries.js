import { useState, useEffect } from 'react';
import { apiClient } from '../../../services/apiClient';
import { useAuth } from '../../../context/AuthContext';

export const useDiaries = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState(null);
  const [turmasDoBanco, setTurmasDoBanco] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;
      try {
        setLoading(true);
        const data = await apiClient(`/turmas/alocacao/${selectedClass}/alunos`);
        setStudents(data || []);

        const initial = {};
        (data || []).forEach(s => {
          initial[s.id] = 0; 
        });
        setAttendance(initial);
      } catch (err) {
        console.error("Erro ao buscar alunos:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedClass]);

  const handleAttendanceChange = (studentId, value) => {
    if (value === "") {
      setAttendance(prev => ({ ...prev, [studentId]: 0 }));
      return;
    }

    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setAttendance(prev => ({ ...prev, [studentId]: num }));
    }
  };

  const saveAttendance = async () => {
    try {
      setLoading(true);

      const payload = students.map(student => ({
        matricula: { id: student.matricula_id },
        alocacao: { id: Number(selectedClass) },
        data: new Date().toISOString().split('T')[0],
        status: (attendance[student.id] || 0) > 0 ? 'FALTA' : 'PRESENTE',
        quantidadefaltas: Number(attendance[student.id] || 0)
      }));

      await apiClient('/presencas', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      alert("Chamada finalizada e salva com sucesso!");
      setSelectedClass(null);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      
      if (err.message?.includes('JSON') || err.name === 'SyntaxError') {
        alert("Chamada finalizada e salva com sucesso!");
        setSelectedClass(null);
      } else {
        alert("Erro ao salvar chamada no servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  const turmasPorTurno = [
    {turno: 'Manhã', salas: turmasDoBanco.filter(t => t.turno?.toUpperCase().includes('MANH')).map(t => ({ id: t.alocacao_id, nome: `${t.turma} - ${t.disciplina}` }))},
    {turno: 'Tarde', salas: turmasDoBanco.filter(t => t.turno?.toUpperCase().includes('TARD')).map(t => ({ id: t.alocacao_id, nome: `${t.turma} - ${t.disciplina}` }))}
  ];

  return { selectedClass, setSelectedClass, students, attendance, handleAttendanceChange, turmasPorTurno, loading,saveAttendance};
};