import { 
  LayoutDashboard, FileText, CheckCircle, Clock, BookOpen, Edit, Layers, User 
} from 'lucide-react';
import { PAGES } from '../types';

export const MENU_ITEMS = [
  { 
    page: PAGES.HOME,
    icon: LayoutDashboard, 
    label: 'Início', 
    allowedRoles: ['DIRETOR', 'PROFESSOR', 'ALUNO', 'GESTOR'] 
  },

  // Aluno
  { page: PAGES.GRADES, icon: FileText, label: 'Minhas Notas', allowedRoles: ['ALUNO'] },
  { page: PAGES.ATTENDANCE, icon: CheckCircle, label: 'Frequência', allowedRoles: ['ALUNO'] },
  { page: PAGES.SCHEDULE, icon: Clock, label: 'Horário de Aula', allowedRoles: ['ALUNO'] },

  // Professor
  { page: PAGES.DIARIES, icon: BookOpen, label: 'Meus Diários', allowedRoles: ['PROFESSOR'] },
  { page: PAGES.GRADING, icon: Edit, label: 'Lançar Notas', allowedRoles: ['PROFESSOR'] },

  // Gestor
  { page: PAGES.CLASSES, icon: Layers, label: 'Turmas', allowedRoles: ['GESTOR'] },
  { page: PAGES.SUBJECTS, icon: BookOpen, label: 'Disciplinas', allowedRoles: ['GESTOR'] },
  { page: PAGES.ALLOCATIONS, icon: User, label: 'Alocações', allowedRoles: ['GESTOR'] },
  { page: PAGES.SCHEDULES, icon: Clock, label: 'Horários', allowedRoles: ['GESTOR'] },
];