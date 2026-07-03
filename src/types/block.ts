export type BlockType =
  | "heading" // titres structurants (h1 à h6)
  | "paragraph" // texte standard / paragraphe
  | "list" // liste ordonnée ou non ordonnée
  | "quote" // citation / blockquote
  | "image"
  | "video"
  | "audio"
  | "file" // pdf, zip, doc...
  | "code" // bloc de code avec coloration
  | "quiz" // question / exercice interactif
  | "embed" // iframe (youtube, figma, tweet, etc.)
  | "divider" // séparation visuelle (hr-like)
  | "callout"; // encart d'information (note, tip, warning...)

export interface BaseBlock {
  type: BlockType;
  order?: number;
  is_preview?: boolean;
  is_hidden?: boolean;
}

/* ---------- Settings spécifiques par type ---------- */

export interface HeadingSettings {
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"; // aligné avec Rule::in du backend
}

export interface ListSettings {
  style: "ordered" | "unordered";
}

export interface CalloutSettings {
  type: "info" | "success" | "warning" | "danger"; 
}

/* ---------- Blocks ---------- */

export interface ParagraphBlock extends BaseBlock {
  type: "paragraph";
  content: string;
}

export interface HeadingBlock extends BaseBlock {
  type: "heading";
  content: string;
  settings: HeadingSettings;
}

export interface ListBlock extends BaseBlock {
  type: "list";
  content: string;
  settings: ListSettings;
}

export interface QuoteBlock extends BaseBlock {
  type: "quote";
  content: string;
  author?: string;
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  media_url: string;
  file?: File;
  alt_text?: string;
  caption?: string;
}

export interface VideoBlock extends BaseBlock {
  type: "video";
  media_url: string;
  file?: File;
  duration_seconds?: number;
  thumbnail_url?: string;
}

export interface AudioBlock extends BaseBlock {
  type: "audio";
  media_url: string;
  file?: File;
  duration_seconds?: number;
}

export interface FileBlock extends BaseBlock {
  type: "file";
  file_url: string;
  file?: File;
  file_name: string;
  file_size?: number;
  mime_type?: string;
}

export interface CodeBlock extends BaseBlock {
  type: "code";
  code_data: {
    language: string;
    code: string;
  };
}

export interface QuizQuestion {
  question: string;
  type: "single" | "multiple";
  options: string[];
  correct_answers: number[];
  points?: number;
  explanation?: string;
}

export interface QuizBlock extends BaseBlock {
  type: "quiz";
  title?: string;
  description?: string;
  quiz_data: {
    questions: QuizQuestion[];
    settings: {
      passing_score_percent: number;
    };
    shuffle_questions?: boolean;
    show_explanation_after_submit?: boolean;
  };
}

export interface EmbedBlock extends BaseBlock {
  type: "embed";
  media_url: string;
  embed_type?: "youtube" | "vimeo" | "figma" | "twitter" | "other";
  embed_data?: unknown;
}

export interface DividerBlock extends BaseBlock {
  type: "divider";
  style?: "solid" | "dashed" | "dotted";
}

export interface CalloutBlock extends BaseBlock {
  type: "callout";
  content: string;
  settings: CalloutSettings;
}

export type Block =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | QuoteBlock
  | ImageBlock
  | VideoBlock
  | AudioBlock
  | FileBlock
  | CodeBlock
  | QuizBlock
  | EmbedBlock
  | DividerBlock
  | CalloutBlock;

export interface Lesson {
  id: number;
  title: string;
  order?: number;
  is_preview?: boolean;
  blocks: Block[];
}

export interface TempFile {
  file: File;
  blockIndex: number;
  lessonIndex: number;
  moduleIndex: number;
}