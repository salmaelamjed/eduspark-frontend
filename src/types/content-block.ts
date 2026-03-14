export interface ContentBlock {
  id: string;
  type:
    | "heading"
    | "paragraph"
    | "image"
    | "video"
    | "quiz"
    | "divider"
    | "callout";
  content: string;
  metadata?: Record<string, unknown>;
}
