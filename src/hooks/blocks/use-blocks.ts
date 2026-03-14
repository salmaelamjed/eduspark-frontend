"use client";
import { useState, useCallback, useEffect, useRef } from "react";

// Types (identiques à votre code)
export type BlockType =
  | "heading"
  | "paragraph"
  | "list"
  | "quote"
  | "image"
  | "video"
  | "audio"
  | "file"
  | "code"
  | "quiz"
  | "embed"
  | "divider"
  | "callout";

export interface CodeData {
  language: string;
  code: string;
  tests?: string[];
}

export interface QuizData {
  questions: {
    question: string;
    type: "multiple_choice" | "single_choice" | "text" | "true_false";
    options?: string[];
    correct_answers: number[];
    explanation?: string;
    points: number;
  }[];
  passing_score: number;
  shuffle_questions: boolean;
  show_explanation_after_submit: boolean;
  time_limit_minutes?: number;
  max_attempts?: number;
}

export interface Block {
  id: number;
  lesson_id: number;
  type: BlockType;
  content: string | null;
  media_url: string | null;
  duration_seconds: number | null;
  language: string | null;
  quiz_data: QuizData | null;
  code_data: CodeData | null;
  order: number;
  is_preview: boolean;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  slug: string;
  order: number;
  is_preview: boolean;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  description: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

type TempId = `temp-${string}`;

export interface LocalBlock extends Omit<Block, "id" | "lesson_id"> {
  id: TempId;
  lesson_id: TempId | number;
}

export interface LocalLesson extends Omit<
  Lesson,
  "id" | "module_id" | "blocks"
> {
  id: TempId;
  module_id: TempId | number;
  blocks: LocalBlock[];
}

export interface LocalModule extends Omit<Module, "id" | "lessons"> {
  id: TempId;
  lessons: LocalLesson[];
  isExpanded?: boolean;
}

// Helper pour générer un ID temporaire
const generateTempId = (): TempId => `temp-${crypto.randomUUID()}`;

// Helper pour obtenir la date actuelle
const getCurrentDate = (): string => new Date().toISOString();

export function useCourseContent() {
  const [modules, setModules] = useState<LocalModule[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<TempId | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<TempId | null>(null);

  // Ref pour éviter les mises à jour multiples
  const isInitialized = useRef(false);

  // Initialiser la sélection quand les modules changent (UNIQUEMENT au premier chargement)
  useEffect(() => {
    // Éviter les mises à jour en cascade
    if (isInitialized.current) return;

    if (modules.length > 0) {
      isInitialized.current = true;

      // Utiliser setTimeout pour éviter la mise à jour synchrone
      const timer = setTimeout(() => {
        setSelectedModuleId(modules[0].id);
        if (modules[0].lessons.length > 0) {
          setSelectedLessonId(modules[0].lessons[0].id);
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [modules]);

  // Version alternative sans setTimeout (si vous préférez)
  // Utiliser un useEffect séparé pour la sélection initiale uniquement
  useEffect(() => {
    // Ne s'exécute que si modules change et qu'aucune sélection n'existe
    if (modules.length > 0 && !selectedModuleId && !selectedLessonId) {
      // Mettre à jour de manière asynchrone
      queueMicrotask(() => {
        setSelectedModuleId(modules[0].id);
        if (modules[0].lessons.length > 0) {
          setSelectedLessonId(modules[0].lessons[0].id);
        }
      });
    }
  }, [modules, selectedModuleId, selectedLessonId]);

  // Ajouter un module
  const addModule = useCallback(() => {
    const now = getCurrentDate();
    const newModule: LocalModule = {
      id: generateTempId(),
      course_id: 0,
      title: `Module ${modules.length + 1}`,
      description: "",
      order: modules.length,
      created_at: now,
      updated_at: now,
      lessons: [],
      isExpanded: true,
    };

    setModules((prev) => [...prev, newModule]);
    setSelectedModuleId(newModule.id);
    setSelectedLessonId(null);
  }, [modules.length]);

  // Ajouter une leçon
  const addLesson = useCallback((moduleId: TempId) => {
    const now = getCurrentDate();

    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id !== moduleId) return mod;

        const newLesson: LocalLesson = {
          id: generateTempId(),
          module_id: 0,
          title: `Leçon ${mod.lessons.length + 1}`,
          slug: `lecon-${mod.lessons.length + 1}`,
          order: mod.lessons.length,
          is_preview: false,
          created_at: now,
          updated_at: now,
          blocks: [],
        };

        return {
          ...mod,
          lessons: [...mod.lessons, newLesson],
        };
      }),
    );
  }, []);

  // Renommer une leçon
  const renameLesson = useCallback(
    (moduleId: TempId, lessonId: TempId, newTitle: string) => {
      setModules((prev) =>
        prev.map((mod) =>
          mod.id === moduleId
            ? {
                ...mod,
                lessons: mod.lessons.map((lesson) =>
                  lesson.id === lessonId
                    ? {
                        ...lesson,
                        title: newTitle.trim() || "Leçon sans titre",
                      }
                    : lesson,
                ),
              }
            : mod,
        ),
      );
    },
    [],
  );

  // Supprimer un module
  const deleteModule = useCallback(
    (moduleId: TempId) => {
      setModules((prev) => {
        const newModules = prev.filter((mod) => mod.id !== moduleId);

        // Mettre à jour la sélection de manière asynchrone si nécessaire
        if (selectedModuleId === moduleId) {
          queueMicrotask(() => {
            setSelectedModuleId(null);
            setSelectedLessonId(null);
          });
        }

        return newModules;
      });
    },
    [selectedModuleId],
  );

  // Supprimer une leçon
  const deleteLesson = useCallback(
    (moduleId: TempId, lessonId: TempId) => {
      setModules((prev) => {
        const newModules = prev.map((mod) =>
          mod.id === moduleId
            ? {
                ...mod,
                lessons: mod.lessons.filter((lesson) => lesson.id !== lessonId),
              }
            : mod,
        );

        // Mettre à jour la sélection de manière asynchrone si nécessaire
        if (selectedLessonId === lessonId) {
          queueMicrotask(() => {
            setSelectedLessonId(null);
          });
        }

        return newModules;
      });
    },
    [selectedLessonId],
  );

  // Sélectionner un module
  const selectModule = useCallback((id: TempId) => {
    setSelectedModuleId(id);
    setSelectedLessonId(null);
  }, []);

  // Sélectionner une leçon
  const selectLesson = useCallback((moduleId: TempId, lessonId: TempId) => {
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
  }, []);

  // Préparer les modules pour l'envoi au backend
  const getModulesForBackend = useCallback(() => {
    return modules.map((mod) => ({
      title: mod.title.trim(),
      description: mod.description?.trim() || "",
      lessons: mod.lessons.map((lesson) => ({
        title: lesson.title.trim(),
        is_preview: lesson.is_preview,
        blocks: lesson.blocks.map((block) => ({
          type: block.type,
          content: block.content,
          media_url: block.media_url,
          duration_seconds: block.duration_seconds,
          language: block.language,
          quiz_data: block.quiz_data,
          code_data: block.code_data,
          order: block.order,
          is_preview: block.is_preview,
          is_hidden: block.is_hidden,
        })),
      })),
    }));
  }, [modules]);

  // Ajouter un bloc
  const addBlock = useCallback(
    (
      moduleId: TempId,
      lessonId: TempId,
      type: BlockType,
      initialData?: Partial<Block>,
      insertAtIndex?: number,
    ) => {
      const now = getCurrentDate();

      setModules((prev) =>
        prev.map((mod) => {
          if (mod.id !== moduleId) return mod;

          return {
            ...mod,
            lessons: mod.lessons.map((lesson) => {
              if (lesson.id !== lessonId) return lesson;

              const newBlock: LocalBlock = {
                id: generateTempId(),
                lesson_id: lessonId,
                type,
                content: initialData?.content || null,
                media_url: initialData?.media_url || null,
                duration_seconds: initialData?.duration_seconds || null,
                language: initialData?.language || null,
                quiz_data: initialData?.quiz_data || null,
                code_data: initialData?.code_data || null,
                order: insertAtIndex ?? lesson.blocks.length,
                is_preview: initialData?.is_preview || false,
                is_hidden: initialData?.is_hidden || false,
                created_at: now,
                updated_at: now,
              };

              const newBlocks = [...lesson.blocks];
              const insertPosition = insertAtIndex ?? newBlocks.length;
              newBlocks.splice(insertPosition, 0, newBlock);

              // Mettre à jour les ordres
              newBlocks.forEach((block, index) => {
                block.order = index;
              });

              return {
                ...lesson,
                blocks: newBlocks,
              };
            }),
          };
        }),
      );
    },
    [],
  );

  // Mettre à jour un bloc
  const updateBlock = useCallback(
    (
      moduleId: TempId,
      lessonId: TempId,
      blockId: TempId,
      updates: Partial<LocalBlock>,
    ) => {
      setModules((prev) =>
        prev.map((mod) => {
          if (mod.id !== moduleId) return mod;

          return {
            ...mod,
            lessons: mod.lessons.map((lesson) => {
              if (lesson.id !== lessonId) return lesson;

              return {
                ...lesson,
                blocks: lesson.blocks.map((block) =>
                  block.id === blockId
                    ? { ...block, ...updates, updated_at: getCurrentDate() }
                    : block,
                ),
              };
            }),
          };
        }),
      );
    },
    [],
  );

  // Supprimer un bloc
  const deleteBlock = useCallback(
    (moduleId: TempId, lessonId: TempId, blockId: TempId) => {
      setModules((prev) =>
        prev.map((mod) => {
          if (mod.id !== moduleId) return mod;

          return {
            ...mod,
            lessons: mod.lessons.map((lesson) => {
              if (lesson.id !== lessonId) return lesson;

              const filteredBlocks = lesson.blocks.filter(
                (block) => block.id !== blockId,
              );

              // Réorganiser les ordres
              filteredBlocks.forEach((block, index) => {
                block.order = index;
              });

              return {
                ...lesson,
                blocks: filteredBlocks,
              };
            }),
          };
        }),
      );
    },
    [],
  );

  // Déplacer un bloc
  const moveBlock = useCallback(
    (
      moduleId: TempId,
      lessonId: TempId,
      blockId: TempId,
      direction: "up" | "down",
    ) => {
      setModules((prev) =>
        prev.map((mod) => {
          if (mod.id !== moduleId) return mod;

          return {
            ...mod,
            lessons: mod.lessons.map((lesson) => {
              if (lesson.id !== lessonId) return lesson;

              const blockIndex = lesson.blocks.findIndex(
                (b) => b.id === blockId,
              );
              if (blockIndex === -1) return lesson;

              const newIndex =
                direction === "up" ? blockIndex - 1 : blockIndex + 1;
              if (newIndex < 0 || newIndex >= lesson.blocks.length)
                return lesson;

              const newBlocks = [...lesson.blocks];
              [newBlocks[blockIndex], newBlocks[newIndex]] = [
                newBlocks[newIndex],
                newBlocks[blockIndex],
              ];

              // Mettre à jour les ordres
              newBlocks.forEach((block, index) => {
                block.order = index;
              });

              return {
                ...lesson,
                blocks: newBlocks,
              };
            }),
          };
        }),
      );
    },
    [],
  );

  // Toggle l'expansion d'un module
  const toggleExpand = useCallback((moduleId: TempId) => {
    setModules((prev) =>
      prev.map((mod) =>
        mod.id === moduleId ? { ...mod, isExpanded: !mod.isExpanded } : mod,
      ),
    );
  }, []);

  // Réinitialiser tout le contenu
  const resetContent = useCallback(() => {
    setModules([]);
    setSelectedModuleId(null);
    setSelectedLessonId(null);
    isInitialized.current = false;
  }, []);

  return {
    // États
    modules,
    selectedModuleId,
    selectedLessonId,

    // Actions sur les modules
    addModule,
    deleteModule,
    selectModule,
    toggleExpand,

    // Actions sur les leçons
    addLesson,
    deleteLesson,
    renameLesson,
    selectLesson,

    // Actions sur les blocs
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,

    // Utilitaires
    getModulesForBackend,
    resetContent,
  };
}
