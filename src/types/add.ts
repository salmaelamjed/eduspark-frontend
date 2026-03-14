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