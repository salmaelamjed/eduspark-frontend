import { Lesson } from "./lesson";

export interface Module {
  id: number;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
  created_at?: string;
  updated_at?: string;
  isExpanded?: boolean;
}
