import React from 'react';
import { useStudentDashboard } from './alunos/hooks/useStudentDashboard';
import { useTeacherDashboard } from './professor/hooks/useTeacherDashboard'
import { StudentDashboard } from './alunos/StudentDashboard';
import { TeacherDashboard } from './professor/TeacherDashboard';

export const Dashboard = ({ user }) => {
  const studentStats = useStudentDashboard(user);
  const { stats: teacherStats, loading: teacherLoading } = useTeacherDashboard(user);

  const COLORS = ['#6366f1', '#f472b6'];

  const renderDashboard = () => {
    switch (user?.role) {
      case 'ALUNO':
        return <StudentDashboard user={user} stats={studentStats} />;
      
      case 'PROFESSOR':
        return (
          <TeacherDashboard 
            user={user} 
            stats={teacherStats} 
            loading={teacherLoading} 
            colors={COLORS} 
          />
        );

      case 'GESTOR':
        return (
          <div className="p-8 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
            <h2 className="text-xl font-bold text-gray-800">Painel do Gestor</h2>
            <p className="text-gray-500 mt-2">Utilize o menu lateral para gerenciar a instituição.</p>
          </div>
        );

      default:
        return (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-dashed">
            Perfil não identificado ou sem permissões de visualização.
          </div>
        );
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {renderDashboard()}
    </div>
  );
};