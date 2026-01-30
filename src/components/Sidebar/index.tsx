"use client";

import { useSidebar } from '@/context/SidebarContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PanelLeftClose, PanelLeft, GraduationCap } from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  navItems: NavItem[];
}

export function Sidebar({ navItems }: SidebarProps) {
  const { isMinimized, toggleMinimize } = useSidebar();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-30 h-full",
        "bg-sidebar text-sidebar-foreground",
        "border-r border-sidebar-border",
        "transition-all duration-300 ease-in-out",
        "flex flex-col",
        "shadow-sm",
        isMinimized ? "w-[72px]" : "w-[260px]"
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
            {/* Tu peux remettre Sparkles ou ton logo ici */}
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
            const isActive = pathname === item.href;

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
                        ? "bg-orange-400 text-orange-400 shadow-sm"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    {isActive && !isMinimized && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground rounded-full" />
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        "shrink-0 w-5 h-5 transition-transform duration-200",
                        "group-hover:scale-110",
                        isActive
                          ? "text-primary-foreground"
                          : "text-muted-foreground group-hover:text-orange-400"
                      )}
                    >
                      {item.icon}
                    </div>

                    {/* Text */}
                    {!isMinimized && (
                      <span className={cn("text-md font-medium truncate ",
                        isActive
                          ? "text-primary-foreground"
                          : "text-muted-foreground group-hover:text-orange-400"
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

      <div
        className={cn(
          "absolute top-4",
          isMinimized
            ? "right-[-18px] w-[26px] h-[26px]"  
            : "right-[-20px] w-[30px] h-[30px]",  
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
    </aside>
  );
}