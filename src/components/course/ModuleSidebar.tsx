"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  GripVertical,
  FileText,
  Video,
  HelpCircle,
  ClipboardList,
  MoreHorizontal,
  Trash2,
  Edit3,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {  TooltipProvider } from "@/components/ui/tooltip";
import { Module } from "@/types/module";
import { Lesson } from "@/types/lesson";

interface ModuleSidebarProps {
  modules: Module[];
  selectedModuleId: number | null;
  selectedLessonId: number | null;
  onSelectModule: (moduleId: number) => void;
  onSelectLesson: (moduleId: number, lessonId: number) => void;
  onAddModule: () => void;
  onAddLesson: (moduleId: number) => void;
  onDeleteModule: (moduleId: number) => void;
  onDeleteLesson: (moduleId: number, lessonId: number) => void;
  onToggleExpand: (moduleId: number) => void;
  onRenameModule?: (moduleId: number, newTitle: number) => void;
  onRenameLesson?: (moduleId: number, lessonId: number, newTitle: number) => void;
}

const lessonTypeIcons: Record<Lesson["type"], React.ElementType> = {
  text: FileText,
  video: Video,
  quiz: HelpCircle,
  assignment: ClipboardList,
  // Ajoute d'autres types si besoin
};

export function ModuleSidebar({
  modules,
  selectedModuleId,
  selectedLessonId,
  onSelectModule,
  onSelectLesson,
  onAddModule,
  onAddLesson,
  onDeleteModule,
  onDeleteLesson,
  onToggleExpand,
  onRenameModule,
  onRenameLesson,
}: ModuleSidebarProps) {
  return (
    <TooltipProvider>
      <aside className="w-72 bg-card border-r border-border flex flex-col min-h-[70vh]">
        {/* Header */}
         <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground"> Structure du cours</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start hover:cursor-pointer hover:bg-gray-50"
          onClick={onAddModule}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un module
        </Button>
      </div>

        {/* Liste des modules */}
        <div className="flex-1 overflow-y-auto p-2">
          {modules.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-10 text-muted-foreground">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="h-7 w-7" />
              </div>
              <p className="text-sm font-medium mb-2">Aucun module pour le moment</p>
              <p className="text-xs">Cliquez sur Ajouter un module pour commencer</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {modules.map((module) => (
                <ModuleItem
                  key={module.id}
                  module={module}
                  isSelected={selectedModuleId === module.id}
                  selectedLessonId={selectedLessonId}
                  onSelectModule={onSelectModule}
                  onSelectLesson={onSelectLesson}
                  onAddLesson={onAddLesson}
                  onDeleteModule={onDeleteModule}
                  onToggleExpand={onToggleExpand}
                  onRenameModule={onRenameModule}
                  onRenameLesson={onRenameLesson}
                  onDeleteLesson={onDeleteLesson}
                />
              ))}
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

// Sous-composant pour chaque module (plus facile à maintenir)
function ModuleItem({
  module,
  isSelected,
  selectedLessonId,
  onSelectModule,
  onSelectLesson,
  onAddLesson,
  onDeleteModule,
  onToggleExpand,
  onRenameModule,
  onRenameLesson,
  onDeleteLesson,
}: {
  module: Module;
  isSelected: boolean;
  selectedLessonId: number | null;
  onSelectModule: (id: number) => void;
  onSelectLesson: (moduleId: number, lessonId: number) => void;
  onAddLesson: (moduleId: number) => void;
  onDeleteModule: (moduleId: number) => void;
  onToggleExpand: (moduleId: number) => void;
  onRenameModule?: (moduleId: number, newTitle: number) => void;
  onRenameLesson?: (moduleId: number, lessonId: number, newTitle: number) => void;
  onDeleteLesson: (moduleId: number, lessonId: number) => void;
}) {
  return (
    <div className="rounded-lg border border-transparent transition-all ">
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

        <GripVertical className="h-4 w-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 cursor-grab" />

        <span className="flex-1 text-sm font-medium truncate">{module.title}</span>

        <span className="text-xs text-muted-foreground font-medium">
          {module.lessons.length}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-muted-foreground/10"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {onRenameModule && (
              <DropdownMenuItem
                onClick={() => {
                  const newTitle = prompt("Nouveau nom du module :", module.title);
                  if (newTitle && newTitle.trim() !== module.title) {
                    onRenameModule(module.id, Number(newTitle));
                  }
                }}
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Renommer
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={() => onAddLesson(module.id)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une leçon
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={() => {
                if (confirm("Supprimer ce module et toutes ses leçons ?")) {
                  onDeleteModule(module.id);
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Leçons (si déplié) */}
      {module.isExpanded && (
        <div className="ml-8 mt-1 space-y-0.5 pb-1">
          {module.lessons.length > 0 && (
            module.lessons.map((lesson) => {
              const LessonIcon = lessonTypeIcons[lesson.type] || FileText;

              return (
                <div
                  key={lesson.id}
                  className={cn(
                    "group flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer text-sm transition-colors",
                    selectedLessonId === lesson.id
                      ? "bg-orange-500/10 text-primary font-medium"
                      : "hover:bg-muted"
                  )}
                  onClick={() => onSelectLesson(module.id, lesson.id)}
                >
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 opacity-0 group-hover:opacity-60 cursor-grab" />

                  <LessonIcon className="h-4 w-4 text-muted-foreground shrink-0" />

                  <span className="flex-1 truncate">{lesson.title}</span>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-muted-foreground/10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      {onRenameLesson && (
                        <DropdownMenuItem
                          onClick={() => {
                            const newTitle = prompt("Nouveau nom de la leçon :", lesson.title);
                            if (newTitle && newTitle.trim() !== lesson.title) {
                              onRenameLesson(module.id, lesson.id, Number(newTitle));
                            }
                          }}
                        >
                          <Edit3 className="mr-2 h-4 w-4" />
                          Renommer
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        onClick={() => {
                          if (confirm("Supprimer cette leçon ?")) {
                            onDeleteLesson(module.id, lesson.id);
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })
          )}

          {/* Bouton ajouter leçon (sous les leçons) */}
           <button
                    className="ml-6 mt-1 flex items-center gap-2 p-2 pl-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg w-[calc(100%-1.5rem)] transition-colors"
                    onClick={() => onAddLesson(module.id)}
                  >
                    <Plus className="w-4 h-4" />
                    Add Lesson
                  </button>
        </div>
      )}
    </div>
  );
}