"use client";

import { createContext, useState, ReactNode, useContext } from 'react';

interface SidebarContextType {
  isMinimized: boolean;
  toggleMinimize: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimize = () => setIsMinimized(prev => !prev);

  return (
    <SidebarContext.Provider value={{ isMinimized, toggleMinimize }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}