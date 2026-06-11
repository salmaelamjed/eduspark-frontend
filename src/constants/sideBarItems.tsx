import { LayoutDashboard, Users, Settings, UserPlus,  PenBox, MessageCircleIcon, Bell } from 'lucide-react';
import { BookOpen, FileText } from 'lucide-react';

export const adminNavItems = [
  { title: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
  { title: 'Enseignants', href: '/dashboard/teachers', icon: <Users /> },
  { title: 'Etudiants', href: '/dashboard/students', icon: <Users /> },
  { title: ' Domains', href: '/dashboard/domains', icon: <PenBox /> }, 
  { title: ' Demandes', href: '/dashboard/requests', icon: <UserPlus /> },

  { title: ' Cours', href: '/dashboard/courses', icon: <BookOpen /> }, 
  { title: 'Paramètres', href: '/dashboard/settings', icon: <Settings /> },
  // Ajoute plus pour admin (ex. analytics, rapports)
];

export const teacherNavItems = [
  { title: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
  { title: 'Courses', href: '/dashboard/courses', icon: <BookOpen /> },
  { title: 'Étudiants', href: '/dashboard/students', icon: <Users /> },
  { title: 'Messages', href: '/dashboard/messages', icon: <MessageCircleIcon /> },
  { title: 'Notifications', href: '/dashboard/notifications', icon: <Bell /> },
  { title: 'Rapports', href: '/dashboard/reports', icon: <FileText /> },
  { title: 'Paramètres', href: '/dashboard/settings', icon: <Settings /> },

  // Ajoute plus pour teacher (ex. notes, devoirs)
];