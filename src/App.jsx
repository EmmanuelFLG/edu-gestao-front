import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { PAGES } from './types.js';

// 
import { Layout } from './components/layout/Layout';

import { LoginView } from './views/LoginView';
import { Dashboard } from './views/DashboardView';
import { GradesView } from './views/alunos/GradesView';
import { AttendanceView } from './views/alunos/AttendanceView';
import { ScheduleView } from './views/alunos/ScheduleView';
import { DiariesView } from './views/professor/DiariesView';
import { GradingView } from './views/professor/GradingView';
import RegisterView from './views/RegisterView';
import { ClassesView } from './views/gestor/ClassesView.jsx';
import { SubjectsView } from './views/gestor/SubjectsView.jsx';
import { AllocationsView } from './views/gestor/AllocationsView.jsx';
import { SchedulesView } from './views/gestor/SchedulesView.jsx';
import { MatriculasView } from './views/gestor/MatriculasView.jsx'; 

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 mt-4 text-gray-600 font-medium">Carregando sistema...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={PAGES.HOME} replace />;
  }

  return <Outlet />;
};

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to={PAGES.HOME} replace /> : <LoginView />}
      />

      <Route
        path="/register"
        element={user ? <Navigate to={PAGES.HOME} replace /> : <RegisterView />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout user={user} />}>
          
          <Route path={PAGES.HOME} element={<Dashboard user={user} />} />

          <Route element={<ProtectedRoute allowedRoles={['PROFESSOR']} />}>
            <Route path={PAGES.DIARIES} element={<DiariesView />} />
            <Route path={PAGES.GRADING} element={<GradingView />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ALUNO']} />}>
            <Route path={PAGES.GRADES} element={<GradesView user={user} />} />
            <Route path={PAGES.ATTENDANCE} element={<AttendanceView user={user} />} />
            <Route path={PAGES.SCHEDULE} element={<ScheduleView user={user} />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['GESTOR']} />}>
            <Route path={PAGES.CLASSES} element={<ClassesView />} />
            <Route path={PAGES.SUBJECTS} element={<SubjectsView />} />
            <Route path={PAGES.ALLOCATIONS} element={<AllocationsView />} />
            <Route path={PAGES.SCHEDULES} element={<SchedulesView />} />
            <Route path={PAGES.MATRICULAS} element={<MatriculasView />} /> {/* ✅ NOVA ROTA */}
          </Route>

        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;