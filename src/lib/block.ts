import { Block, BlockType } from "@/types/block";

  type BlockVariant = {
  key: string;
  label: string;
  badge?: string; 
  data: Partial<Block>;
};

export const blockVariants: Partial<Record<BlockType, BlockVariant[]>> = {
  heading: [
    { key: "h1", label: "Titre principal", badge: "H1", data: { settings: { level: "h1" } } },
    { key: "h2", label: "Titre",           badge: "H2", data: { settings: { level: "h2" } } },
    { key: "h3", label: "Sous-titre",       badge: "H3", data: { settings: { level: "h3" } } },
    { key: "h4", label: "Petit titre",      badge: "H4", data: { settings: { level: "h4" } } },
     { key: "h5", label: "Sous-titre",       badge: "H5", data: { settings: { level: "h5" } } },
    { key: "h6", label: "Petit titre",      badge: "H6", data: { settings: { level: "h6" } } },
  ],
  list: [
    { key: "unordered", label: "Liste à puces",   data: { settings: { style: "unordered" } } },
    { key: "ordered",   label: "Liste numérotée", data: { settings: { style: "ordered" } } },
  ],
  callout: [
    { key: "info",    label: "Info",     data: { settings: { type: "info" } } },
    { key: "success", label: "Succès",   data: { settings: { type: "success" } } },
    { key: "warning", label: "Warning",  data: { settings: { type: "warning" } } },
    { key: "danger",  label: "Danger",   data: { settings: { type: "danger" } } },
  ],
  code: [
    { key: "javascript", label: "JavaScript", data: { code_data: { code: "", language: "javascript" } } },
    { key: "php",        label: "PHP",        data: { code_data: { code: "", language: "php" } } },
    { key: "python",     label: "Python",      data: { code_data: { code: "", language: "python" } } },
    { key: "markup",     label: "HTML",        data: { code_data: { code: "", language: "markup" } } },
    { key: "css",        label: "CSS",         data: { code_data: { code: "", language: "css" } } },
    { key: "java",       label: "Java",        data: { code_data: { code: "", language: "java" } } },
  ],
  embed: [
    { key: "youtube", label: "YouTube", data: { embed_type: "youtube" } },
    { key: "vimeo",   label: "Vimeo",   data: { embed_type: "vimeo" } },
    { key: "figma",   label: "Figma",   data: { embed_type: "figma" } },
    { key: "other",   label: "Autre (Iframe)", data: { embed_type: "other" } },
  ],
};