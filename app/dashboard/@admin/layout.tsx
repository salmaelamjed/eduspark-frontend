'use client'
import { Sidebar } from '@/components/Sidebar';
import { adminNavItems } from '@/constants/sideBarItems';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';

function MainContent({ children }: { children: React.ReactNode }) {
  const { isMinimized } = useSidebar();

  return (
    <main
      className={`
        flex-1 transition-all duration-300
        ${isMinimized ? 'ml-20' : 'ml-64'}
        p-2 md:p-4 lg:p-4
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
        <Sidebar navItems={adminNavItems} />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}