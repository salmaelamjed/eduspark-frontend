import { LayoutDashboard, Users, Settings } from 'lucide-react';
import { BookOpen, FileText } from 'lucide-react';

export const adminNavItems = [
  { title: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
  { title: 'Utilisateurs', href: '/dashboard/users', icon: <Users /> },
  { title: 'Paramètres', href: '/dashboard/settings', icon: <Settings /> },
  // Ajoute plus pour admin (ex. analytics, rapports)
];

export const teacherNavItems = [
  { title: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
  { title: 'Courses', href: '/dashboard/courses', icon: <BookOpen /> },
  { title: 'Étudiants', href: '/dashboard/students', icon: <Users /> },
  { title: 'Rapports', href: '/dashboard/reports', icon: <FileText /> },
  // Ajoute plus pour teacher (ex. notes, devoirs)
];