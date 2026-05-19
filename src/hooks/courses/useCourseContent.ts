"use client";

import { AudioBlock, Block, CalloutBlock, DividerBlock, EmbedBlock, FileBlock, HeadingBlock, ImageBlock, ListBlock, ParagraphBlock, QuizBlock, QuoteBlock } from "@/types/block";
import {  VideoBlock } from "@/types/block";
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
          // Initialisation de la structure de base requise par la migration de la table 'lesson_blocks'
          const baseBlock: any = {
            type: block.type,
            order: blockIndex + 1,
            is_preview: les.is_preview ? 1 : 0,
            content: null,
            media_url: null,
            settings: null,
            quiz_data: null,
            code_data: null,
            duration_seconds: null,
            language: "fr",
          };

          // Mutation des données selon les spécificités du type de bloc
           switch (block.type) {
             case "heading":
               baseBlock.content = (block).content || "";
               baseBlock.settings = { level: `h${(block).level || 2}` };
               break;

             case "paragraph":
             case "quote":
             case "list":
               baseBlock.content = (block).content || "";
               if (block.type === "list") {
                 baseBlock.settings = {
                   style: (block).list_type || "unordered",
                 };
               }
               break;

             case "callout":
               baseBlock.content = (block).content || "";
               baseBlock.settings = {
                 type: (block).callout_type || "info",
               };
               break;

             case "image":
               baseBlock.media_url = (block).media_url || "";
               // alt_text et caption peuvent être encapsulés dans les configurations flexibles
               baseBlock.settings = {
                 alt_text: (block).alt_text || "",
                 caption: (block).caption || "",
               };
               break;

             case "video":
             case "audio":
               baseBlock.media_url = (block ).media_url || "";
               baseBlock.duration_seconds =
                 Number((block).duration_seconds) || 0;
               break;

             case "file":
               baseBlock.media_url = (block).file_url || "";
               baseBlock.settings = {
                 file_name: (block).file_name || "",
               };
               break;

             case "embed":
               baseBlock.media_url = (block).media_url || "";
               baseBlock.settings = {
                 embed_type: (block).embed_type || "other",
               };
               break;

             case "divider":
               baseBlock.settings = { style: (block).style || "solid" };
               break;

             case "code":
               baseBlock.code_data = {
                 language: (block).code_data?.language || "javascript",
                 code: (block).code_data?.code || "",
               };
               break;

             case "quiz":
              
               // Adaptation des données mockées du frontend vers le format strict attendu par le validateur Laravel
               baseBlock.quiz_data = {
                 settings: {
                   passing_score_percent: 80, // Valeur par défaut requise
                 },
                 questions: ((block as any).quiz_data.questions || []).map(
                   (q : any, qIdx: number) => {
                     const questionId = `q-${qIdx + 1}`;

                     // On mappe les options au format attendu { id, text }
                     const formattedOptions = (q.options || []).map(
                       (opt: string, oIdx: number) => ({
                         id: `opt-${oIdx + 1}`,
                         text: opt,
                       }),
                     );

                     // On mappe les index des bonnes réponses vers les IDs des options générées
                     const correctAnswersIds = (q.correct_answers || []).map(
                       (idx: number) => `opt-${idx + 1}`,
                     );

                     return {
                       id: questionId,
                       question_text: q.question || "Question",
                       type:
                         q.type === "multiple_choice" &&
                         correctAnswersIds.length > 1
                           ? "multiple"
                           : "single",
                       options: formattedOptions,
                       correct_answer: correctAnswersIds,
                       explanation: q.explanation || null,
                     };
                   },
                 ),
               };
               break;
           }

           return baseBlock;
        })
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

                case "heading":
                  newBlock = {
                    type: "heading",
                    content:
                      (initialData as HeadingBlock).content || "",
                    level: (initialData as HeadingBlock).level || 2, 
                  };
                  break;

                case "paragraph":
                  newBlock = {
                    type: "paragraph",
                    content:
                      (initialData as ParagraphBlock).content || "",
                  };
                  break;

                case "list":
                  newBlock = {
                    type: "list",
                    content: (initialData as ListBlock).content || "",
                  };
                  break;

                case "quote":
                  newBlock = {
                    type: "quote",
                    content:
                      (initialData as QuoteBlock).content || "",
                  };
                  break;

                case "image":
                  newBlock = {
                    type: "image",
                    media_url: (initialData as ImageBlock).media_url || "",
                    alt_text: (initialData as ImageBlock).alt_text || "",
                    caption: (initialData as ImageBlock).caption || "",
                  };
                  break;

                case "audio":
                  newBlock = {
                    type: "audio",
                    media_url: (initialData as AudioBlock).media_url || "",
                    duration_seconds:
                      (initialData as AudioBlock).duration_seconds || 0,
                  };
                  break;

                case "file":
                  newBlock = {
                    type: "file",
                    file_url: (initialData as FileBlock).file_url || "",
                    file_name: (initialData as FileBlock).file_name || "",
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

                case "quiz":{
                  // Extraction des données initiales s'il y en a, sinon fallback sur la structure par défaut
                  const quizInitialData = initialData as Partial<QuizBlock>;
                  newBlock = {
                    type: "quiz",
                    title: quizInitialData.title || "Nouveau Quiz",
                    description: quizInitialData.description || "",
                    quiz_data: {
                      passing_score:
                        quizInitialData.quiz_data?.passing_score || 70,
                      shuffle_questions:
                        quizInitialData.quiz_data?.shuffle_questions || false,
                      show_explanation_after_submit:
                        quizInitialData.quiz_data
                          ?.show_explanation_after_submit || true,
                      questions: quizInitialData.quiz_data?.questions || [
                        {
                          question: "Question par défaut...",
                          type: "multiple_choice",
                          options: ["Option 1", "Option 2", "Option 3"],
                          correct_answers: [0],
                          points: 10,
                          explanation: "",
                        },
                      ],
                    },
                  };
                }
                  
                  break;

                case "code":
                  newBlock = {
                    type: "code",
                    code_data: {
                      language: "javascript",
                      code: "",
                    },
                  };
                  break;

                case "embed":
                  newBlock = {
                    type: "embed",
                    media_url: (initialData as EmbedBlock).media_url || "",
                    embed_type:
                      (initialData as EmbedBlock).embed_type || "other",
                  };
                  break;

                case "divider":
                  newBlock = {
                    type: "divider",
                    style: (initialData as DividerBlock).style || "solid",
                  };
                  break;
                case "callout":
                  newBlock = {
                    type: "callout",
                    content:
                      (initialData as CalloutBlock).content || "",
                    callout_type:
                      (initialData as CalloutBlock).callout_type || "info",
                  };
                  break;
                default:
                  newBlock = {
                    type: "paragraph",
                    content: "",
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
            };

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