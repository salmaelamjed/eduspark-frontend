'use client'
import { Sidebar } from '@/components/Sidebar';
import { teacherNavItems } from '@/constants/sideBarItems';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';

function MainContent({ children }: { children: React.ReactNode }) {
  const { isMinimized } = useSidebar();

  return (
    <main
      className={`
        flex-1 transition-all duration-300
        ${isMinimized ? 'ml-18' : 'ml-60'}
        px-4 
      `}
    >
      {children}
    </main>
  );
}

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar navItems={teacherNavItems} />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}