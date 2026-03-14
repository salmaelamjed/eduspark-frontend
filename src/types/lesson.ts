import { Block } from "./block";

export interface Lesson {
  id: number;
  title: string;
  description?: string;
  order: number;
  duration_minutes?: number;
  is_preview: boolean;
  type: "text" | "video" | "quiz" | "file" | "code";
  media_url?: string;
  content?: string;
  blocks: Block[];
  created_at?: string;
  updated_at?: string;
}
