"use client";

import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  FileText,
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Module } from "@/types/module";
import Image from "next/image";

interface ModuleReadSidebarProps {
  modules: Module[];
  selectedModuleId: number | null;
  selectedLessonId: number | null;
  onSelectModule: (moduleId: number) => void;
  onSelectLesson: (moduleId: number, lessonId: number) => void;
  onToggleExpand: (moduleId: number) => void;
  courseTitle?: string;
}



export function ModuleReadSidebar({
  modules,
  selectedModuleId,
  selectedLessonId,
  onSelectModule,
  onSelectLesson,
  onToggleExpand,
}: ModuleReadSidebarProps) {
  return (
    <TooltipProvider>
      <aside className="w-68 bg-card border-r border-border flex flex-col min-h-[70vh]">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-center mb-3">
              <Image
                src="/images/EduSparkL.svg"
                alt="EduSpark logo"
                width={150}
                height={150}
                priority
            />
          </div>
        </div>

        {/* Liste des modules */}
        <div className="flex-1 overflow-y-auto p-2">
          {modules.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-10 text-muted-foreground">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="h-7 w-7" />
              </div>
              <p className="text-sm font-medium mb-2">Aucun module disponible</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {modules.map((module) => (
                <ModuleReadItem
                  key={module.id}
                  module={module}
                  isSelected={selectedModuleId === module.id}
                  selectedLessonId={selectedLessonId}
                  onSelectModule={onSelectModule}
                  onSelectLesson={onSelectLesson}
                  onToggleExpand={onToggleExpand}
                />
              ))}
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

function ModuleReadItem({
  module,
  isSelected,
  selectedLessonId,
  onSelectModule,
  onSelectLesson,
  onToggleExpand,
}: {
  module: Module;
  isSelected: boolean;
  selectedLessonId: number | null;
  onSelectModule: (id: number) => void;
  onSelectLesson: (moduleId: number, lessonId: number) => void;
  onToggleExpand: (moduleId: number) => void;
}) {
  return (
    <div className="rounded-lg border border-transparent transition-all">
      {/* Ligne du module */}
      <div
        className={cn(
          "group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
          isSelected && !selectedLessonId
            ? "bg-orange-500/10 text-orange-600"
            : "hover:bg-muted/70"
        )}
        onClick={() => onSelectModule(module.id)}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(module.id);
          }}
          className="p-1 rounded hover:bg-muted-foreground/10"
        >
          {module.isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        <span className="flex-1 text-sm font-medium truncate">{module.title}</span>

        <span className="text-xs text-muted-foreground font-medium">
          {module.lessons.length}
        </span>
      </div>

      {/* Leçons (si déplié) */}
      {module.isExpanded && (
        <div className="ml-8 mt-1 space-y-0.5 pb-1">
          {module.lessons.map((lesson) => {
            return (
              <div
                key={lesson.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer text-sm transition-colors",
                  selectedLessonId === lesson.id
                    ? "bg-orange-500/10 text-primary font-medium"
                    : "hover:bg-muted"
                )}
                onClick={() => onSelectLesson(module.id, lesson.id)}
              >
                <span className="flex-1 truncate">{lesson.title}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}