import { Module } from "./module";

export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  level?: string;
  language?: string;
  is_free?: boolean;
  price:number;
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
      lessons: [
        {
          title: string;
          is_preview: boolean;
          blocks: [
            {
              type: "image" | "video" | "text" | "quiz" | "code";
              content_text?: string;
              media_url?: string;
              duration_seconds?: number;
              code_data?: {
                language: string;
                code: string;
              };

            },
          ];
        },
      ];
    },
  ];
}


export  interface CourseResponsePayload {
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
    created_at:Date;
  };
}