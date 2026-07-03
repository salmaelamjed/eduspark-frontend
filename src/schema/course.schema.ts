import { BlockType, CodeData, QuizData } from "@/hooks/blocks/use-blocks";
import { z } from "zod";

const thumbnailSchema = z
  .any() // or z.unknown()
  .nullable()
  .optional()
  .refine(
    (val) => {
      // On server we accept File | null | undefined
      if (typeof window === "undefined") {
        return val === null || val === undefined || val instanceof File;
      }
      // On client we expect FileList from input
      return (
        val === null ||
        val === undefined ||
        (val instanceof FileList && val.length === 1)
      );
    },
    {
      message: "Une seule image est autorisée (JPEG, PNG, WebP)",
    },
  )
  .refine(
    (val) => {
      if (!val || val.length === 0) return true;

      const file = val instanceof FileList ? val[0] : val;
      if (!(file instanceof File)) return false;

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      return allowedTypes.includes(file.type);
    },
    {
      message: "Format d'image non supporté",
    },
  )
  .refine(
    (val) => {
      if (!val || val.length === 0) return true;

      const file = val instanceof FileList ? val[0] : val;
      return file.size <= 5 * 1024 * 1024; // 5MB
    },
    {
      message: "L'image doit faire moins de 5 Mo",
    },
  );

// Bloc schema basé sur la migration lesson_blocks
const blockSchema = z.discriminatedUnion("type", [
  // Bloc de type heading
  z.object({
    id: z.number().optional(),
    lesson_id: z.number().optional(),
    type: z.literal("heading"),
    content: z.string().min(1, "Le contenu du titre est requis"),
    media_url: z.null().default(null),
    duration_seconds: z.null().default(null),
    language: z.null().default(null),
    quiz_data: z.null().default(null),
    code_data: z.null().default(null),
    order: z.number().default(0),
    is_preview: z.boolean().default(false),
    is_hidden: z.boolean().default(false),
  }),

  // Bloc de type paragraph
  z.object({
    id: z.number().optional(),
    lesson_id: z.number().optional(),
    type: z.literal("paragraph"),
    content: z.string().min(1, "Le contenu du paragraphe est requis"),
    media_url: z.null().default(null),
    duration_seconds: z.null().default(null),
    language: z.null().default(null),
    quiz_data: z.null().default(null),
    code_data: z.null().default(null),
    order: z.number().default(0),
    is_preview: z.boolean().default(false),
    is_hidden: z.boolean().default(false),
  }),

  // Bloc de type list
  z.object({
    id: z.number().optional(),
    lesson_id: z.number().optional(),
    type: z.literal("list"),
    content: z.string().min(1, "Le contenu de la liste est requis"),
    media_url: z.null().default(null),
    duration_seconds: z.null().default(null),
    language: z.null().default(null),
    quiz_data: z.null().default(null),
    code_data: z.null().default(null),
    order: z.number().default(0),
    is_preview: z.boolean().default(false),
    is_hidden: z.boolean().default(false),
  }),

  // Bloc de type quote
  z.object({
    id: z.number().optional(),
    lesson_id: z.number().optional(),
    type: z.literal("quote"),
    content: z.string().min(1, "Le contenu de la citation est requis"),
    media_url: z.null().default(null),
    duration_seconds: z.null().default(null),
    language: z.null().default(null),
    quiz_data: z.null().default(null),
    code_data: z.null().default(null),
    order: z.number().default(0),
    is_preview: z.boolean().default(false),
    is_hidden: z.boolean().default(false),
  }),

  // Bloc de type image
  z.object({
    id: z.number().optional(),
    lesson_id: z.number().optional(),
    type: z.literal("image"),
    content: z.null().default(null),
    media_url: z.string().url({ message: "URL d'image invalide" }).min(1),
    duration_seconds: z.null().default(null),
    language: z.null().default(null),
    quiz_data: z.null().default(null),
    code_data: z.null().default(null),
    order: z.number().default(0),
    is_preview: z.boolean().default(false),
    is_hidden: z.boolean().default(false),
  }),

  // Bloc de type video
  z.object({
    id: z.number().optional(),
    lesson_id: z.number().optional(),
    type: z.literal("video"),
    content: z.null().default(null),
    media_url: z.string().url({ message: "URL de vidéo invalide" }).min(1),
    duration_seconds: z
      .number()
      .int()
      .min(0)
      .max(36000)
      .nullable()
      .default(null),
    language: z.null().default(null),
    quiz_data: z.null().default(null),
    code_data: z.null().default(null),
    order: z.number().default(0),
    is_preview: z.boolean().default(false),
    is_hidden: z.boolean().default(false),
  }),

  // Bloc de type audio
  z.object({
    id: z.number().optional(),
    lesson_id: z.number().optional(),
    type: z.literal("audio"),
    content: z.null().default(null),
    media_url: z.string().url({ message: "URL audio invalide" }).min(1),
    duration_seconds: z
      .number()
      .int()
      .min(0)
      .max(36000)
      .nullable()
      .default(null),
    language: z.null().default(null),
    quiz_data: z.null().default(null),
    code_data: z.null().default(null),
    order: z.number().default(0),
    is_preview: z.boolean().default(false),
    is_hidden: z.boolean().default(false),
  }),

  // Bloc de type file
  z.object({
    id: z.number().optional(),
    lesson_id: z.number().optional(),
    type: z.literal("file"),
    content: z.null().default(null),
    media_url: z.string().url({ message: "URL du fichier invalide" }).min(1),
    duration_seconds: z.null().default(null),
    language: z.null().default(null),
    quiz_data: z.null().default(null),
    code_data: z.null().default(null),
    order: z.number().default(0),
    is_preview: z.boolean().default(false),
    is_hidden: z.boolean().default(false),
  }),

  // Bloc de type code
  z.object({
    id: z.number().optional(),
    lesson_id: z.number().optional(),
    type: z.literal("code"),
    content: z.null().default(null),
    media_url: z.null().default(null),
    duration_seconds: z.null().default(null),
    language: z.string().nullable().default(null),
    quiz_data: z.null().default(null),
    code_data: z
      .object({
        language: z.string().min(1, "Langage requis"),
        code: z.string().min(1, "Le code ne peut pas être vide"),
        tests: z.array(z.string()).optional(),
      })
      .nullable()
      .default(null),
    order: z.number().default(0),
    is_preview: z.boolean().default(false),
    is_hidden: z.boolean().default(false),
  }),

  // Bloc de type quiz
  z.object({
    id: z.number().optional(),
    lesson_id: z.number().optional(),
    type: z.literal("quiz"),
    content: z.null().default(null),
    media_url: z.null().default(null),
    duration_seconds: z.null().default(null),
    language: z.null().default(null),
    quiz_data: z
      .object({
        questions: z.array(
          z.object({
            question: z.string().min(1, "La question est requise"),
            type: z.enum([
              "multiple",
              "single",
            ]),
            options: z.array(z.string()).optional(),
            correct_answers: z.array(z.number()),
            explanation: z.string().optional(),
            points: z.number().min(1).default(1),
          }),
        ),
        passing_score: z.number().min(0).max(100).default(70),
        shuffle_questions: z.boolean().default(false),
        show_explanation_after_submit: z.boolean().default(true),
        time_limit_minutes: z.number().positive().optional(),
        max_attempts: z.number().positive().optional(),
      })
      .nullable()
      .default(null),
    order: z.number().default(0),
    is_preview: z.boolean().default(false),
    is_hidden: z.boolean().default(false),
  }),

  // Bloc de type embed
  z.object({
    id: z.number().optional(),
    lesson_id: z.number().optional(),
    type: z.literal("embed"),
    content: z.null().default(null),
    media_url: z.string().url({ message: "URL d'embed invalide" }).min(1),
    duration_seconds: z.null().default(null),
    language: z.null().default(null),
    quiz_data: z.null().default(null),
    code_data: z.null().default(null),
    order: z.number().default(0),
    is_preview: z.boolean().default(false),
    is_hidden: z.boolean().default(false),
  }),

  // Bloc de type divider
  z.object({
    id: z.number().optional(),
    lesson_id: z.number().optional(),
    type: z.literal("divider"),
    content: z.null().default(null),
    media_url: z.null().default(null),
    duration_seconds: z.null().default(null),
    language: z.null().default(null),
    quiz_data: z.null().default(null),
    code_data: z.null().default(null),
    order: z.number().default(0),
    is_preview: z.boolean().default(false),
    is_hidden: z.boolean().default(false),
  }),

  // Bloc de type callout
  z.object({
    id: z.number().optional(),
    lesson_id: z.number().optional(),
    type: z.literal("callout"),
    content: z.string().min(1, "Le contenu du callout est requis"),
    media_url: z.null().default(null),
    duration_seconds: z.null().default(null),
    language: z.null().default(null),
    quiz_data: z.null().default(null),
    code_data: z.null().default(null),
    order: z.number().default(0),
    is_preview: z.boolean().default(false),
    is_hidden: z.boolean().default(false),
  }),
]);

// Lesson schema basé sur la migration lessons
const lessonSchema = z.object({
  id: z.number().optional(),
  module_id: z.number().optional(),
  title: z
    .string()
    .min(3, "Le titre de la leçon doit contenir au moins 3 caractères"),
  slug: z.string().optional().default(""), // Sera généré automatiquement
  order: z.number().default(0),
  is_preview: z.boolean().default(false),
  blocks: z.array(blockSchema).default([]),
});

// Module schema basé sur la migration modules
const moduleSchema = z.object({
  id: z.number().optional(),
  course_id: z.number().optional(),
  title: z
    .string()
    .min(3, "Le titre du module doit contenir au moins 3 caractères"),
  description: z.string().nullable().default(null),
  order: z.number().default(0),
  lessons: z
    .array(lessonSchema)
    .min(1, "Chaque module doit contenir au moins une leçon"),
});

// Course schema principal
export const CourseCreationSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre du cours doit contenir au moins 3 caractères")
    .max(120),
  description: z
    .string()
    .min(20, "La description doit contenir au moins 20 caractères")
    .max(2000),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  language: z.string().min(2, "La langue est requise").default("fr"),
  is_free: z.boolean().default(true),
  price: z
    .number()
    .min(0, "Le prix ne peut pas être négatif")
    .max(9999, "Prix trop élevé")
    .optional(),
  thumbnail: thumbnailSchema,
  modules: z
    .array(moduleSchema)
    .min(1, "Le cours doit contenir au moins un module")
    .max(50, "Trop de modules (maximum 50)"),
});

export type CourseCreationProps = z.infer<typeof CourseCreationSchema>;

// Types supplémentaires pour les réponses API
export interface CourseResponse {
  id: number;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  is_free: boolean;
  price: number | null;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
  modules?: ModuleResponse[];
}

export interface ModuleResponse {
  id: number;
  course_id: number;
  title: string;
  description: string | null;
  order: number;
  created_at: string;
  updated_at: string;
  lessons?: LessonResponse[];
}

export interface LessonResponse {
  id: number;
  module_id: number;
  title: string;
  slug: string;
  order: number;
  is_preview: boolean;
  created_at: string;
  updated_at: string;
  blocks?: BlockResponse[];
}

export interface BlockResponse {
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
