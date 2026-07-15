"use client";

import { useSidebar } from '@/context/SidebarContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PanelLeftClose, PanelLeft, GraduationCap, LogOut } from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState, useMemo } from 'react';
import ConfirmSignOutModal from '@/components/confirm-signout-modal'; 


interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  navItems: NavItem[];
}

// Ne retourne QUE le href de l'item le plus spécifique qui matche le pathname
// (ex: pour /dashboard/courses, "Courses" (/dashboard/courses) gagne sur
// "Dashboard" (/dashboard), même si les deux sont techniquement des préfixes).
function getActiveHref(pathname: string, hrefs: string[]): string | null {
  const matches = hrefs.filter(
    (href) => pathname === href || pathname.startsWith(`${href}/`)
  );
  if (matches.length === 0) return null;
  // Le plus long préfixe = le plus spécifique
  return matches.reduce((longest, current) =>
    current.length > longest.length ? current : longest
  );
}

export function Sidebar({ navItems }: SidebarProps) {
  const { isMinimized, toggleMinimize } = useSidebar();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();

  const activeHref = useMemo(
    () => getActiveHref(pathname, navItems.map((item) => item.href)),
    [pathname, navItems]
  );

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-30 h-full",
        "bg-sidebar text-sidebar-foreground",
        "border-r border-sidebar-border",
        "transition-all duration-300 ease-in-out",
        "flex flex-col",
        "shadow-sm",
        isMinimized ? "w-18" : "w-60"
      )}
    >
      {/* Header with Logo */}
      <div
        className={cn(
          "flex items-center border-b border-sidebar-border",
          "transition-all duration-300",
          isMinimized ? "h-16 justify-center px-3" : "h-16 px-5"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center",
              "w-12 h-12 rounded-xl",
              "bg-orange-500 text-white",
              "shadow-md"
            )}
          >
            <span className="text-lg font-bold "><GraduationCap className='w-10 h-10'/></span>
          </div>
          {!isMinimized && (
            <div className="overflow-hidden">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                EduSpark
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">
                Learning Platform
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === activeHref;

            return (
              <Tooltip
                key={item.href}
                delayDuration={isMinimized ? 0 : 9999} 
              >
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative flex  gap-3 rounded-xl items-center ",
                      "transition-all duration-200 ease-out",
                      "font-medium",
                      isMinimized ? "justify-center p-3" : "px-4 py-3",
                      isActive
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    {isActive && !isMinimized && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full" />
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        "shrink-0 w-5 h-5 transition-transform duration-200",
                        "group-hover:scale-110",
                        isActive
                          ? "text-white"
                          : "text-muted-foreground group-hover:text-orange-500"
                      )}
                    >
                      {item.icon}
                    </div>

                    {/* Text */}
                    {!isMinimized && (
                      <span className={cn("text-md font-medium truncate ",
                        isActive
                          ? "text-white"
                          : "text-muted-foreground group-hover:text-orange-500"
                      )}>
                        {item.title}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>

                {isMinimized && (
                  <TooltipContent
                    side="right"
                    className={cn(
                      "px-3 py-2 text-sm font-medium",
                      "bg-foreground text-background",
                      "border-none shadow-lg rounded-lg"
                    )}
                    sideOffset={12}
                  >
                    {item.title}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>
        
        </nav>
       {isMinimized ? (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        onClick={() => setShowLogoutModal(true)}
        className={cn(
          "group relative flex items-center justify-center",
          "w-10 h-10 mx-auto my-3",
          "rounded-xl",
          "text-red-600 hover:text-red-700",
          "hover:bg-red-50/70 hover:cursor-pointer",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        )}
        aria-label="Déconnexion"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </TooltipTrigger>
    <TooltipContent side="right" className="text-sm">
      Déconnexion
    </TooltipContent>
  </Tooltip>
) : (
  <button
    onClick={() => setShowLogoutModal(true)}
    className={cn(
      "group relative flex  gap-3 rounded-xl items-center ",
      "mx-3 my-4 px-4 py-3",
      "bg-white text-red-600 hover:text-red-700",
      "hover:bg-red-50/80 active:bg-red-100 hover:cursor-pointer",
      "rounded-xl border border-red-200/70",
      "transition-all duration-200 ease-out",
      "font-medium text-sm",
      "focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
    )}
  >
    <LogOut className="h-5 w-5" />
    <span>Déconnexion</span>
  </button>
)}
      <div
        className={cn(
          "absolute top-4",
          isMinimized
            ? "-right-4.5 w-6.5 h-6.5"  
            : "-right-5 w-7.5 h-7.5",  
          "z-40 flex items-center justify-center",
          "rounded-full bg-background border border-sidebar-border shadow-md",
          "cursor-pointer transition-all duration-200",
          "hover:bg-sidebar-accent hover:text-foreground",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
        onClick={toggleMinimize}
        aria-label={isMinimized ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isMinimized ? (
          <PanelLeft className="w-4 h-4 text-muted-foreground" />
        ) : (
          <PanelLeftClose className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
        <ConfirmSignOutModal open={showLogoutModal} onOpenChange={setShowLogoutModal} />
    </aside>

  );
}