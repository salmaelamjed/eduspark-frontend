"use client";

import { AudioBlock, Block, CalloutBlock, CodeBlock, DividerBlock, EmbedBlock, FileBlock, HeadingBlock, ImageBlock, ListBlock, ParagraphBlock, QuizBlock, QuizQuestion, QuoteBlock } from "@/types/block";
import {  VideoBlock } from "@/types/block";
import { Lesson } from "@/types/lesson";
import { Module } from "@/types/module";
import { useState, useCallback } from "react";

type TempId = `temp-${string}`;

// Définir les types locaux qui étendent les types de base
export interface LocalModule extends Omit<Module, "id" | "lessons" | "order"> {
  id: TempId;
  lessons: LocalLesson[];
  order?: number;
  isExpanded?: boolean;
}

export interface LocalLesson extends Omit<Lesson, 'id' | 'blocks'> {
  id: TempId;
  blocks: Block[];
}

type BackendBlockPayload = Record<string, unknown>;

export function useCourseContent() {
  const [modules, setModules] = useState<LocalModule[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<
    string | number | null
  >(modules[0]?.id ?? null);
  const [selectedLessonId, setSelectedLessonId] = useState<
    string | number | null
  >(modules[0]?.lessons[0]?.id ?? null);

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
  const addLesson = useCallback((moduleId: string |number) => {
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
  const renameModule = useCallback((moduleId: string |number, newTitle: string) => {
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
    (
      moduleId: string | number,
      lessonId: string | number,
      newTitle: string,
    ) => {
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
    (moduleId: string | number) => {
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
    (moduleId: string | number, lessonId: string | number) => {
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
 const selectModule = useCallback((id: string | number) => {
   setSelectedModuleId(id);
   setSelectedLessonId(null);
 }, []);

  // Sélectionner une leçon
 const selectLesson = useCallback(
   (moduleId: string | number, lessonId: string | number) => {
     setSelectedModuleId(moduleId);
     setSelectedLessonId(lessonId);
   },
   [],
 );

  // Préparer les modules pour l’envoi au backend (sans IDs)
const getModulesForBackend = useCallback(() => {
  return modules.map((mod, modIndex) => ({
    title: mod.title.trim(),
    description: mod.description?.trim() || null,
    order: modIndex + 1,

    lessons: mod.lessons.map((les, lesIndex) => ({
      title: les.title.trim(),
      is_preview: les.is_preview ? 1 : 0,
      order: lesIndex + 1,

      blocks: les.blocks.map((block, blockIndex) => {
        const baseBlock: BackendBlockPayload = {
          type: block.type,
          order: blockIndex + 1,
          is_preview: les.is_preview ? 1 : 0,
          // content: block.content,
          // media_url: block.media_url,
          // settings: block.settings,
          // quiz_data: block.quiz_data,
          // code_data: block.code_data,
          // duration_seconds: block.duration_seconds,
          language: "fr",
        };

     
        switch (block.type) {
          case "heading": {
            const b = block as HeadingBlock;
            baseBlock.content = b.content || "";
            baseBlock.settings = { level: b.settings?.level || "h2" };
            break;
          }

          case "paragraph":
          case "quote": {
            const b = block as ParagraphBlock | QuoteBlock;
            baseBlock.content = b.content || "";
            break;
          }

          case "list": {
            const b = block as ListBlock;
            baseBlock.content = b.content || "";
            baseBlock.settings = { style: b.settings?.style || "unordered" };
            break;
          }

          case "callout": {
            const b = block as CalloutBlock;
            baseBlock.content = b.content || "";
            baseBlock.settings = { type: b.settings?.type || "info" };
            break;
          }

          // ====================== BLOCS MÉDIA ======================
          case "image":
          case "video":
          case "audio":
          case "embed": {
            const b = block as
              | ImageBlock
              | VideoBlock
              | AudioBlock
              | EmbedBlock;
            const url = b.media_url;
            baseBlock.media_url = url && !url.startsWith("blob:") ? url : null;

            if ("duration_seconds" in b) {
              baseBlock.duration_seconds = b.duration_seconds ?? null;
            }

            // ✅ propager le fichier réel pour que useCourses.ts puisse l'uploader
            if ("file" in b) {
              baseBlock.file = b.file ?? null;
            }
            break;
          }

          case "file": {
            const b = block as FileBlock;
            baseBlock.media_url = b.file_url || null;
            baseBlock.file = b.file ?? null; // ✅ idem
            break;
          }

          case "code": {
            const b = block as CodeBlock;
            baseBlock.code_data = {
              language: b.code_data?.language || "javascript",
              code: b.code_data?.code || "",
            };
            break;
          }

          case "quiz": {
            const b = block as QuizBlock;
            const questions: QuizQuestion[] = b.quiz_data?.questions || [];

            baseBlock.quiz_data = {
              settings: {
                passing_score_percent:
                  b.quiz_data?.settings?.passing_score_percent ?? 80,
              },
              questions: questions.map((q, qIdx) => ({
                id: `q-${qIdx + 1}`,
                question_text: q.question || "Question",
                type:
                  q.type === "multiple" && (q.correct_answers?.length || 0) > 1
                    ? "multiple"
                    : "single",
                options: (q.options || []).map((opt: string, oIdx: number) => ({
                  id: `opt-${oIdx + 1}`,
                  text: opt,
                })),
                correct_answer: (q.correct_answers || []).map(
                  (idx: number) => `opt-${idx + 1}`,
                ),
                explanation: q.explanation || null,
              })),
            };

            baseBlock.settings = {
              quiz_title:
                b.quiz_data?.settings?.title || b.title || "Quiz sans titre",
              quiz_description:
                b.quiz_data?.settings?.description || b.description || "",
            };
            break;
          }

          case "divider": {
            const b = block as DividerBlock;
            baseBlock.settings = { style: b.style || "solid" };
            break;
          }

          default:
            break;
        }
        return baseBlock;
      }),
    })),
  }));
}, [modules]);

  // Ajouter un block dans une leçon spécifique
  // Dans useCourseContent
  const addBlock = useCallback(
    (
      moduleId: number|string,
      lessonId: number|string,
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
                case "heading": {
                  const data = initialData as Partial<HeadingBlock>;
                  newBlock = {
                    type: "heading",
                    content: data.content || "",
                    settings: { level: data.settings?.level || "h2" },
                  };
                  break;
                }

                case "paragraph": {
                  const data = initialData as Partial<ParagraphBlock>;
                  newBlock = {
                    type: "paragraph",
                    content: data.content || "",
                  };
                  break;
                }

                case "list": {
                  const data = initialData as Partial<ListBlock>;
                  newBlock = {
                    type: "list",
                    content: data.content || "",
                    settings: { style: data.settings?.style || "unordered" },
                  };
                  break;
                }

                case "quote": {
                  const data = initialData as Partial<QuoteBlock>;
                  newBlock = {
                    type: "quote",
                    content: data.content || "",
                  };
                  break;
                }

                case "image": {
                  const data = initialData as Partial<ImageBlock>;
                  newBlock = {
                    type: "image",
                    media_url: data.media_url || "",
                    alt_text: data.alt_text || "",
                    caption: data.caption || "",
                  };
                  break;
                }

                case "audio": {
                  const data = initialData as Partial<AudioBlock>;
                  newBlock = {
                    type: "audio",
                    media_url: data.media_url || "",
                    duration_seconds: data.duration_seconds || 0,
                  };
                  break;
                }

                case "file": {
                  const data = initialData as Partial<FileBlock>;
                  newBlock = {
                    type: "file",
                    file_url: data.file_url || "",
                    file_name: data.file_name || "",
                  };
                  break;
                }

                case "video": {
                  const data = initialData as Partial<VideoBlock>;
                  newBlock = {
                    type: "video",
                    media_url: data.media_url || "",
                    duration_seconds: data.duration_seconds || 0,
                  };
                  break;
                }

                case "quiz": {
                  const data = initialData as Partial<QuizBlock>;
                  const defaultQuestions: QuizQuestion[] = [
                    {
                      question: "Question par défaut...",
                      type: "multiple",
                      options: ["Option 1", "Option 2", "Option 3"],
                      correct_answers: [0],
                      points: 10,
                      explanation: "",
                    },
                  ];

                  newBlock = {
                    type: "quiz",
                    title: data.title || "Nouveau Quiz",
                    description: data.description || "",
                    quiz_data: {
                      settings: {
                        title:
                          data.quiz_data?.settings?.title || "Nouveau Quiz",
                        description:
                          data.quiz_data?.settings?.description ||
                          data.description ||
                          "",
                        passing_score_percent:
                          data.quiz_data?.settings?.passing_score_percent || 70,
                      },
                      shuffle_questions:
                        data.quiz_data?.shuffle_questions || false,
                      show_explanation_after_submit:
                        data.quiz_data?.show_explanation_after_submit ?? true,
                      questions: data.quiz_data?.questions || defaultQuestions,
                    },
                  };
                  break;
                }

                case "code":
                  newBlock = {
                    type: "code",
                    code_data: { language: "javascript", code: "" },
                  };
                  break;

                case "embed": {
                  const data = initialData as Partial<EmbedBlock>;
                  newBlock = {
                    type: "embed",
                    media_url: data.media_url || "",
                    embed_type: data.embed_type || "other",
                  };
                  break;
                }

                case "divider": {
                  const data = initialData as Partial<DividerBlock>;
                  newBlock = {
                    type: "divider",
                    style: data.style || "solid",
                  };
                  break;
                }

                case "callout": {
                  const data = initialData as Partial<CalloutBlock>;
                  newBlock = {
                    type: "callout",
                    content: data.content || "",
                    settings: { type: data.settings?.type || "info" },
                  };
                  break;
                }

                default:
                  newBlock = { type: "paragraph", content: "" };
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

  const toggleExpand = useCallback((moduleId: string|number) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m,
      ),
    );
  }, []);

const updateBlock = useCallback(
  (
    moduleId: number | string,
    lessonId: number | string,
    blockIndex: number,
    updates: Partial<Block>,
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
            } as Block;

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

const deleteBlock = useCallback(
  (
    moduleId: number | string,
    lessonId: number | string,
    blockIndex: number,
  ) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id !== moduleId) return mod;

        return {
          ...mod,
          lessons: mod.lessons.map((les) => {
            if (les.id !== lessonId) return les;

            // Vérifier que l'index est valide
            if (
              blockIndex < 0 ||
              blockIndex >= les.blocks.length ||
              !Number.isInteger(blockIndex)
            ) {
              console.warn(
                `Index de bloc invalide pour suppression : ${blockIndex}`,
              );
              return les;
            }

            // Filtrer le bloc à supprimer
            const newBlocks = les.blocks.filter(
              (_, index) => index !== blockIndex,
            );

            // Réindexer les ordres des blocs restants
            const reorderedBlocks = newBlocks.map((block, idx) => ({
              ...block,
              order: idx + 1,
            }));

            return {
              ...les,
              blocks: reorderedBlocks,
            };
          }),
        };
      }),
    );
  },
  [],
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
    deleteBlock,
  };
}