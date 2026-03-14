"use client";

import { Block } from "@/types/block";
import { TextBlock, VideoBlock } from "@/types/block";
import { Lesson } from "@/types/lesson";
import { Module } from "@/types/module";
import { useState, useCallback } from "react";

type TempId = `temp-${string}`;

// Définir les types locaux qui étendent les types de base
export interface LocalModule extends Omit<Module, 'id' | 'lessons'> {
  id: TempId;
  lessons: LocalLesson[];
  order?: number;
  isExpanded?: boolean;
}

export interface LocalLesson extends Omit<Lesson, 'id' | 'blocks'> {
  id: TempId;
  blocks: Block[];
}

export function useCourseContent() {
  const [modules, setModules] = useState<LocalModule[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<TempId | null>(
    modules[0]?.id ?? null,
  );
  const [selectedLessonId, setSelectedLessonId] = useState<TempId | null>(
    modules[0]?.lessons[0]?.id ?? null,
  );

  // Ajouter un module
  const addModule = useCallback(() => {
    const newModule: LocalModule = {
      id: `temp-${crypto.randomUUID()}`,
      title: `Module ${modules.length + 1}`,
      description: "",
      lessons: [],
      isExpanded: true,
    };

    setModules((prev) => [...prev, newModule]);
    setSelectedModuleId(newModule.id);
    setSelectedLessonId(null);
  }, [modules.length]);

  // Ajouter une leçon dans un module
  const addLesson = useCallback((moduleId: string) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id !== moduleId) return mod;

        const newLesson: LocalLesson = {
          id: `temp-${crypto.randomUUID()}`,
          title: `Leçon ${mod.lessons.length + 1}`,
          is_preview: false,
          blocks: [],
          order: mod.lessons.length,
          // Ajoutez ces propriétés manquantes
          media_url: "",
          type: "text", // ou une valeur par défaut
          content: "", // si nécessaire
        };

        return {
          ...mod,
          lessons: [...mod.lessons, newLesson],
        };
      }),
    );
  }, []);

  // Renommer un module
  const renameModule = useCallback((moduleId: string, newTitle: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, title: newTitle.trim() || "Module sans titre" }
          : m,
      ),
    );
  }, []);
  // Renommer une leçon
  const renameLesson = useCallback(
    (moduleId: string, lessonId: string, newTitle: string) => {
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                lessons: m.lessons.map((l) =>
                  l.id === lessonId
                    ? { ...l, title: newTitle.trim() || "Leçon sans titre" }
                    : l,
                ),
              }
            : m,
        ),
      );
    },
    [],
  );
  // Supprimer un module
  const deleteModule = useCallback(
    (moduleId: string) => {
      setModules((prev) => prev.filter((m) => m.id !== moduleId));

      if (selectedModuleId === moduleId) {
        setSelectedModuleId(null);
        setSelectedLessonId(null);
      }
    },
    [selectedModuleId],
  );

  // Supprimer une leçon
  const deleteLesson = useCallback(
    (moduleId: string, lessonId: string) => {
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                lessons: m.lessons.filter((l) => l.id !== lessonId),
              }
            : m,
        ),
      );

      if (selectedLessonId === lessonId) {
        setSelectedLessonId(null);
      }
    },
    [selectedLessonId],
  );

  // Sélectionner un module
  const selectModule = useCallback((id: string) => {
    setSelectedModuleId(id);
    setSelectedLessonId(null);
  }, []);

  // Sélectionner une leçon
  const selectLesson = useCallback((moduleId: string, lessonId: string) => {
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
  }, []);

  // Préparer les modules pour l’envoi au backend (sans IDs)
  const getModulesForBackend = useCallback(() => {
    return modules.map((mod) => ({
      title: mod.title.trim(),
      description: mod.description.trim(),
      lessons: mod.lessons.map((les) => ({
        title: les.title.trim(),
        is_preview: les.is_preview,
        blocks: les.blocks,
      })),
    }));
  }, [modules]);

  // Ajouter un block dans une leçon spécifique
  // Dans useCourseContent
  const addBlock = useCallback(
    (
      moduleId: string,
      lessonId: string,
      type: Block["type"],
      initialData: Partial<Block> = {},
      insertAtIndex?: number,
    ) => {
      setModules((prev) =>
        prev.map((mod) => {
          if (mod.id !== moduleId) return mod;

          return {
            ...mod,
            lessons: mod.lessons.map((les) => {
              if (les.id !== lessonId) return les;

              let newBlock: Block;

              switch (type) {
                case "text":
                  newBlock = {
                    type: "text",
                    content_text: (initialData as TextBlock).content_text || "",
                  };
                  break;

                case "video":
                  newBlock = {
                    type: "video",
                    media_url: (initialData as VideoBlock).media_url || "",
                    duration_seconds:
                      (initialData as VideoBlock).duration_seconds || 0,
                  };
                  break;

                case "quiz":
                  newBlock = {
                    type: "quiz",
                    title: "Nouveau Quiz",
                    questions: [
                      {
                        question: "Question par défaut...",
                        type: "multiple_choice",
                        options: ["Option 1", "Option 2", "Option 3"],
                        correct_answers: [0],
                        points: 10,
                      },
                    ],
                  };
                  break;

                case "code":
                  newBlock = {
                    type: "code",
                    code_data: {
                      language: "javascript",
                      code: "// Votre code ici...",
                    },
                  };
                  break;

                case "file":
                  newBlock = {
                    type: "file",
                    file_url: "",
                    file_name: "Nouveau fichier",
                  };
                  break;

                default:
                  newBlock = {
                    type: "text",
                    content_text: "",
                  };
                  break;
              }

              // Insérer à la position spécifiée ou à la fin
              const newBlocks = [...les.blocks];
              const insertIndex =
                insertAtIndex !== undefined
                  ? Math.min(insertAtIndex, newBlocks.length)
                  : newBlocks.length;

              newBlocks.splice(insertIndex, 0, newBlock);

              return {
                ...les,
                blocks: newBlocks,
              };
            }),
          };
        }),
      );
    },
    [],
  );

  const toggleExpand = useCallback((moduleId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m,
      ),
    );
  }, []);

const updateBlock = useCallback(
  (
    moduleId: string,
    lessonId: string,
    blockIndex: number,
    updates: Partial<Block>
  ) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id !== moduleId) return mod;

        return {
          ...mod,
          lessons: mod.lessons.map((les) => {
            if (les.id !== lessonId) return les;

            if (
              blockIndex < 0 ||
              blockIndex >= les.blocks.length ||
              !Number.isInteger(blockIndex)
            ) {
              console.warn(`Index de bloc invalide : ${blockIndex}`);
              return les;
            }

            const newBlocks = [...les.blocks];
            newBlocks[blockIndex] = {
              ...newBlocks[blockIndex],
              ...updates,
            };

            return {
              ...les,
              blocks: newBlocks,
            };
          }),
        };
      })
    );
  },
  []
);

  return {
    modules,
    selectedModuleId,
    selectedLessonId,
    addModule,
    addLesson,
    renameModule,
    renameLesson,
    deleteModule,
    deleteLesson,
    selectModule,
    selectLesson,
    addBlock,
    getModulesForBackend,
    toggleExpand,
    updateBlock,
  };
}