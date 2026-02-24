import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { StudentDashboard } from './alunos/StudentDashboard';
import { TeacherDashboard } from './professor/TeacherDashboard';

export const Dashboard = ({ user }) => {
  const stats = useDashboard(user);
  const COLORS = ['#6366f1', '#f472b6'];

  // Lógica de Renderização Condicional
  const renderDashboard = () => {
    switch (user.role) {
      case 'ALUNO':
        return <StudentDashboard user={user} stats={stats} />;
      case 'PROFESSOR':
        return <TeacherDashboard user={user} stats={stats} colors={COLORS} />;
      default:
        return <div className="p-8 text-center text-gray-500">Perfil não identificado.</div>;
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {renderDashboard()}
    </div>
  );
};