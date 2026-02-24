// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import { Layout } from './components/layout/Layout';

// Views Aluno
import { GradesView } from './views/alunos/GradesView';
import { AttendanceView } from './views/alunos/AttendanceView';
import { ScheduleView } from './views/alunos/ScheduleView';

// Views Professor
import { DiariesView } from './views/professor/DiariesView';
import { GradingView } from './views/professor/GradingView';

// Views Gestor
import { ClassesView } from './views/gestor/ClassesView.jsx';
import { SubjectsView } from './views/gestor/SubjectsView.jsx';
import { AllocationsView } from './views/gestor/AllocationsView.jsx';
import { SchedulesView } from './views/gestor/SchedulesView.jsx';

// Dashboard View (renderiza StudentDashboard ou TeacherDashboard)
import { Dashboard } from './views/DashboardView';

// Login / Register
import { LoginView } from './views/LoginView';
import RegisterView from './views/RegisterView';

/**
 * Componente de Proteção de Rotas
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 mt-4 text-gray-600 font-medium">
            Carregando sistema...
          </span>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginView />}
      />

      {/* REGISTER */}
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <RegisterView />}
      />

      {/* ROTAS PROTEGIDAS COM LAYOUT */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout user={user} />}>

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard user={user} />} />

          {/* Professor */}
          <Route element={<ProtectedRoute allowedRoles={['PROFESSOR']} />}>
            <Route path="/diaries" element={<DiariesView />} />
            <Route path="/grading" element={<GradingView />} />
          </Route>

          {/* Aluno */}
          <Route element={<ProtectedRoute allowedRoles={['ALUNO']} />}>
            <Route path="/grades" element={<GradesView user={user} />} />
            <Route path="/attendance" element={<AttendanceView user={user} />} />
            <Route path="/schedule" element={<ScheduleView user={user} />} />
          </Route>

          {/* Gestor */}
          <Route element={<ProtectedRoute allowedRoles={['GESTOR']} />}>
            <Route path="/classes" element={<ClassesView />} />
            <Route path="/subjects" element={<SubjectsView />} />
            <Route path="/allocations" element={<AllocationsView />} />
            <Route path="/schedules" element={<SchedulesView />} />
          </Route>

        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}