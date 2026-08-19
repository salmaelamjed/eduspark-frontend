import { Module } from "./module";

// Forme possible de `settings` selon le type de bloc — union au lieu de `any`
type BlockSettingsPayload =
  | { level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" } // heading
  | { style: "ordered" | "unordered" } // list
  | { type: "info" | "success" | "warning" | "danger" } // callout
  | { style: "solid" | "dashed" | "dotted" }; // divider

export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  level?: string;
  language?: string;
  is_free?: boolean;
  price: number;
  modules: Module[];
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseRequestPayload {
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  is_free: boolean;
  price?: number; // seulement si !is_free
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "published" | "archived";

  modules: [
    {
      title: string;
      description: string;
      order: number;
      lessons: [
        {
          title: string;
          is_preview: number | boolean;
          order: number;
          blocks: [
            {
              type:
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
              order: number;
              is_preview: number | boolean;
              content?: string | null;
              media_url?: string | null;
              duration_seconds?: number | null;
              language?: string | null;
              settings?: BlockSettingsPayload | null;
              code_data?: { language: string; code: string } | null;
              quiz_data?: {
                settings: { passing_score_percent: number };
                questions: Array<{
                  id: string;
                  question_text: string;
                  type: "single" | "multiple";
                  options: Array<{ id: string; text: string }>;
                  correct_answer: string[];
                  explanation?: string | null;
                }>;
              } | null;
            },
          ];
        },
      ];
    },
  ];
}

export interface CourseResponsePayload {
  message: string;
  course: {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    level: string;
    language: string;
    price: number;
    is_free: boolean;
    thumbnail: string | null;
    status: string;
    domain_id: number;
    created_at: Date;
  };
}

// types/Course.types.ts
export interface BestCourseDomain {
  id: number;
  name: string;
  slug: string;
}

export interface BestCourse {
  id: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  price: number;
  is_free: boolean;
  level: "beginner" | "intermediate" | "advanced";
  language?: string;
  domain: BestCourseDomain | null;
  teacher: string | null;
  enrollments: number;
}

export interface BestCoursesResponse {
  data: BestCourse[];
}

export interface GetBestCoursesParams {
  limit?: number;
}