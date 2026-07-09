"use client";
import React, { useEffect } from "react";
import Prism from "prismjs";
import Editor from "react-simple-code-editor";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  FileText,
  Upload,
  Download,
  X,
  Loader2,
  Video,
  Music,
} from "lucide-react";
import { Lesson, Block, BlockType } from "@/types/block";
import { useState, ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ACCEPTED_FILE_TYPES, ACCEPTED_IMAGE_TYPES, ACCEPTED_VIDEO_TYPES, getFileIcon, getFileIconBg } from "@/constants/content-editor";
import { formatFileSize } from "@/constants/content-editor";
import { blockIcons } from "@/constants/content-editor";
import { blockLabels } from "@/constants/content-editor";
import { Module } from "@/types/module";
import { ScrollArea } from "../ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// Support des langages de votre liste
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-php";
import "prismjs/components/prism-python";
import "prismjs/components/prism-markup"; 
import "prismjs/components/prism-css";
import "prismjs/components/prism-java";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QuizEditor } from "../quiz";
import { blockVariants } from "@/lib/block";


interface ContentEditorProps {
  lesson: Lesson | undefined;
  module: Module | undefined;
  onUpdateLesson: (moduleId: number, lessonId: number, updates: Partial<Lesson>) => void;
  onAddBlock: (moduleId: number, lessonId: number, type: BlockType, initialData?: Partial<Block>) => void;
  onUpdateBlock: (          
    moduleId: number,
    lessonId: number,
    blockIndex: number,
    updates: Partial<Block>
  ) => void;
  onDeleteBlock: (moduleId: number, lessonId: number, blockIndex: number) => void;
}

export function ContentEditor({
  lesson,
  module,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock
}: ContentEditorProps) {
  const [uploading, setUploading] = useState<string | null>(null);  
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    blockIndex: number | null;
    blockType: BlockType | null;
  }>({
    isOpen: false,
    blockIndex: null,
    blockType: null
  });
   
  useEffect(() => {
  if (typeof window !== 'undefined') {    const languages = ['javascript', 'php', 'python', 'markup', 'css', 'java'];
    languages.forEach(lang => {
      if (!Prism.languages[lang]) {
        console.warn(`Prism language "${lang}" not loaded`);
      }
    });
  }
}, []);

  if (!lesson || !module) {
   return (
      <div className="flex-1 flex items-center justify-center bg-background min-h-[70vh]">
        <div className="text-center max-w-md px-8 py-12">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Aucune leçon sélectionnée</h2>
          <p className="text-muted-foreground">
            Sélectionnez une leçon dans la barre latérale pour commencer à éditer le contenu.
          </p>
        </div>
      </div>
    );
  }
  const mergeNested = (
  base: unknown,
  override: unknown
): Record<string, unknown> => ({
  ...(isRecord(base) ? base : {}),
  ...(isRecord(override) ? override : {}),
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

 const handleAddBlock = (type: BlockType,overrideData?: Partial<Block>) => {
  if (!module?.id || !lesson?.id) return;

  const base = {
    order: lesson.blocks.length + 1,
    is_preview: false,
    is_hidden: false,
  };

  let initialData: Partial<Block>;

  switch (type) {
    case "paragraph":
      initialData = { type, ...base, content: "" } as Partial<Block>;
      break;
    case "heading":
      initialData = { type, ...base, content: "", settings: { level: "h2" } } as Partial<Block>;
      break;
    case "list":
      initialData = { type, ...base, content: "", settings: { style: "unordered" } } as Partial<Block>;
      break;
    case "quote":
      initialData = { type, ...base, content: "", author: "" } as Partial<Block>;
      break;
    case "callout":
      initialData = { type, ...base, content: "", settings: { type: "info" } } as Partial<Block>;
      break;
    case "divider":
      initialData = { type, ...base, style: "solid" } as Partial<Block>;
      break;
    case "code":
      initialData = { type, ...base, code_data: { code: "", language: "javascript" } } as Partial<Block>;
      break;
    case "video":
      initialData = { type, ...base, media_url: "", duration_seconds: 0, thumbnail_url: "" } as Partial<Block>;
      break;
    case "audio":
      initialData = { type, ...base, media_url: "", duration_seconds: 0 } as Partial<Block>;
      break;
    case "image":
      initialData = { type, ...base, media_url: "", alt_text: "", caption: "" } as Partial<Block>;
      break;
    case "file":
      initialData = { type, ...base, file_url: "", file_name: "", file_size: 0, mime_type: "" } as Partial<Block>;
      break;
    case "embed":
      initialData = { type, ...base, media_url: "", embed_type: "other" } as Partial<Block>;
      break;
    case "quiz":
      initialData = {
        type,
        ...base,
        title: "Quiz d'évaluation",
        description: "",
        quiz_data: {
          questions: [
            {
              question_text: "Votre première question ?",
              type: "single",
              options: ["Option A", "Option B"],
              correct_answers: [0],
              points: 1,
              explanation: "",
            },
          ],
          settings: { passing_score_percent: 70 },
          shuffle_questions: false,
          show_explanation_after_submit: true,
        },
      } as Partial<Block>;
      break;
    default:
      initialData = { type, ...base } as Partial<Block>;
  }

   if (overrideData) {
    const baseData = initialData as Record<string, unknown>;
    const overrideDataObj = overrideData as Record<string, unknown>;

    initialData = {
      ...baseData,
      ...overrideDataObj,
      settings: mergeNested(baseData.settings, overrideDataObj.settings),
      code_data: mergeNested(baseData.code_data, overrideDataObj.code_data),
    } as Partial<Block>;
  }

  onAddBlock(module.id, lesson.id, type, initialData);
};


type UploadUpdateData = {
  file?: File;
  media_url?: string;
  alt_text?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  file_url?: string;
};

const simulateFileUpload = async (
  file: File,
  blockIndex: number,
  type: "video" | "file" | "image" | "audio"
) => {
  setUploading(`${type}-${blockIndex}`);
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const objectUrl = URL.createObjectURL(file);

  const updateData: UploadUpdateData = { file };

  switch (type) {
    case "image":
      updateData.media_url = objectUrl;
      updateData.alt_text = file.name;
      break;
    case "video":
      updateData.media_url = objectUrl;
      updateData.file_name = file.name;
      updateData.file_size = file.size;
      break;
    case "audio":
      updateData.media_url = objectUrl;
      updateData.file_name = file.name;
      updateData.file_size = file.size;
      updateData.mime_type = file.type;
      break;
    case "file":
      updateData.file_url = objectUrl;
      updateData.file_name = file.name;
      updateData.file_size = file.size;
      updateData.mime_type = file.type;
      break;
  }

  onUpdateBlock(module.id, lesson.id, blockIndex, updateData as Partial<Block>);
  setUploading(null);
};

  const ACCEPTED_AUDIO_TYPES = [
  "audio/mpeg", 
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",  
];

 const handleFileUpload = (
  e: ChangeEvent<HTMLInputElement>, 
  blockIndex: number, 
  type: 'video' | 'file' | 'image' | 'audio'
) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (type === 'video' && !ACCEPTED_VIDEO_TYPES.includes(file.type)) {
    alert("Type de fichier vidéo non supporté. Utilisez MP4, WebM ou OGG.");
    return;
  }

  // Validation Image
  if (type === 'image' && !ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    alert("Type d'image non supporté.");
    return;
  }

  // Validation Audio
  if (type === 'audio' && !ACCEPTED_AUDIO_TYPES.includes(file.type)) {
    alert("Type audio non supporté. Formats acceptés : MP3, WAV, M4A.");
    return;
  }

  // Validation Fichier Générique
  if (type === 'file') {
    const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
    const isOtherFile = ACCEPTED_FILE_TYPES.includes(file.type);
    
    if (!isImage && !isOtherFile) {
      alert("Type de fichier non supporté. Veuillez choisir une image, un PDF, un document Office, etc.");
      return;
    }
  }

  simulateFileUpload(file, blockIndex, type);
    e.target.value = '';
};

  const removeFile = (blockIndex: number, type: 'video' | 'file'| 'image'| 'audio') => {
    if (type === 'video') {
      onUpdateBlock(module.id, lesson.id, blockIndex, {
        media_url: "",
        file_name: "",
        file_size: 0,
      });
    } else if(type==='image'){
      onUpdateBlock(module.id, lesson.id, blockIndex, {
        media_url: '',
        alt_text: ''
      });
    }else if(type === 'audio'){
        onUpdateBlock(module.id, lesson.id, blockIndex, {
      media_url: "",
      file_name: "",
      file_size: 0,
      mime_type: ""
    });
    } else {
      onUpdateBlock(module.id, lesson.id, blockIndex, {
        file_url: "",
        file_name: "",
        file_size: 0,
        mime_type: ""
      });
    }
  };

  const handleDeleteClick = (blockIndex: number) => {
    const block = lesson.blocks[blockIndex];
    setDeleteConfirmation({
      isOpen: true,
      blockIndex,
      blockType: block.type
    });
  };

  const confirmDelete = () => {
    if (deleteConfirmation.blockIndex !== null && onDeleteBlock && module?.id && lesson?.id) {
      onDeleteBlock(module.id, lesson.id, deleteConfirmation.blockIndex);
    }
    // Fermer la boîte de dialogue
    setDeleteConfirmation({
      isOpen: false,
      blockIndex: null,
      blockType: null
    });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({
      isOpen: false,
      blockIndex: null,
      blockType: null
    });
  };

  const getBlockTypeLabel = (type: BlockType | null): string => {
    if (!type) return "bloc";
    return blockLabels[type] || type;
  };

return (
    <div className="flex flex-col  from-gray-50 w-full mt-0 pt-0 ">
  <header className=" bg-white/90 backdrop-blur-md  border-b">
    <div className="px-4 py-4 flex items-center justify-between">
      <div>
        <h3 className="font-bold text-xl text-gray-900">{module.title}</h3>
        <p className="text-sm text-gray-500 mt-0.5">• {lesson.title}</p>
      </div>
    </div>
  </header>
  <div className="flex flex-1 overflow-hidden">
    <main className="flex-1  overflow-y-auto">
      <ScrollArea className="p-6 space-y-6">
  {lesson.blocks.map((block, index) => {
               const renderBlockWrapper = (label: string, icon: React.ReactNode, children: React.ReactNode) => (
  <div key={index} className="group relative p-5 hover:border hover:rounded-2xl border-transparent transition-all duration-200">
    {/* Delete button */}
    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-30">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-red-50"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDeleteClick(index);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
    {children}
  </div>
);

switch (block.type) {
        case "heading": {
        const isEmpty = !block.content || block.content.trim() === "";

        const headingSize =
          block.settings.level === "h1" ? "text-4xl" :
          block.settings.level === "h2" ? "text-3xl" :
          block.settings.level === "h3" ? "text-2xl" : "text-xl";

  return renderBlockWrapper("Titre", blockIcons.heading, (
    <div className="space-y-3">
      <div className="relative max-w-3xl">
        <textarea
          value={block.content}
          placeholder="Saisissez le titre de votre section…"
          rows={1}
          className={cn(
            "w-full bg-transparent px-0 py-2 resize-none overflow-hidden font-bold leading-tight",
            headingSize,
            !isEmpty && "text-foreground",
            isEmpty && "text-muted-foreground/70 text-[1.1rem] font-normal italic tracking-wide",
            "focus:outline-none focus:ring-0 focus:border-none transition-all duration-200 border-none"
          )}
          onChange={(e) => {
            onUpdateBlock(module.id, lesson.id, index, { content: e.target.value });
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
          }}
        />
      </div>
    </div>
  ));
}
    case "paragraph":
        return renderBlockWrapper("Paragraphe", blockIcons.paragraph, (
          <div className="max-w-155">   {/* ← Largeur fixée ici */}
            <Textarea
              value={block.content}
              placeholder="Écrivez votre paragraphe de cours ici..."
              className={cn(
                "w-full bg-transparent border-none shadow-none focus-visible:ring-0 p-0 text-base leading-relaxed resize-none overflow-hidden min-h-25",
                
                "text-gray-800 dark:text-gray-200",
                "placeholder:text-gray-400 placeholder:font-light",
                
                // Bordure subtile (WordPress style)
                "border-b border-gray-200 focus:border-orange-400 hover:border-gray-300 transition-all duration-200"
              )}
              rows={1}
              onChange={(e) => {
                onUpdateBlock(module.id, lesson.id, index, { content: e.target.value });
                
                // Auto-resize
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.max(e.target.scrollHeight, 100)}px`;
              }}
            />
          </div>
        ));
        case "list":
        const isOrdered = block.settings.style === "ordered";

        // Convertir le contenu stocké en lignes brutes pour l'édition
        const rawLines = block.content
          ? block.content.split("\n").map(line =>
              line
                .replace(/^•\s+/, "")
                .replace(/^\d+\.\s+/, "")
                .trim()
            )
          : [""]; 

        const displayValue = rawLines
          .map((line, i) => {
            if (isOrdered) {
              return `${i + 1}. ${line}`;
            } else {
              return `• ${line}`;
            }
          })
          .join("\n");

        return renderBlockWrapper("Liste", blockIcons.list, (
          <div className="space-y-3">
      <Textarea
        value={displayValue}   
        placeholder="Commencez à écrire ici..."
        className="w-full border-none shadow-none focus-visible:ring-0 p-0 text-gray-800 leading-relaxed bg-transparent placeholder:italic placeholder:text-gray-400"
        rows={4}
        onChange={(e) => {
          const inputLines = e.target.value.split("\n");
          const cleanLines = inputLines.map(line =>
            line
              .replace(/^•\s+/, "")
              .replace(/^\d+\.\s+/, "")
              .trim()
          );
          const formatted = cleanLines
            .map((cleanLine, i) => {
              if (isOrdered) {
                return `${i + 1}. ${cleanLine}`;
              } else {
                return `• ${cleanLine}`;
              }
            })
            .join("\n");

          onUpdateBlock(module.id, lesson.id, index, { content: formatted });
        }}
      />
    </div>
  ));
        case "quote":
                    return renderBlockWrapper("Citation", blockIcons.quote, (
                      <div className="pl-4 max-w-156 border-l-4 border-orange-500 bg-gray-50/50 p-2 rounded-r-lg space-y-2">
                        <Textarea
                          value={block.content}
                          placeholder="« Votre texte de citation historique ou inspirant... »"
                          className="border-none shadow-none focus-visible:ring-0 resize-none italic bg-transparent p-0"
                          onChange={(e) => onUpdateBlock(module.id, lesson.id, index, { content: e.target.value })}
                        />
                        <Input
                          value={block.author || ""}
                          placeholder="Auteur (ex: Steve Jobs)"
                          className="h-7 text-xs bg-white border-gray-200 max-w-xs"
                          onChange={(e) => onUpdateBlock(module.id, lesson.id, index, { author: e.target.value })}
                        />
                      </div>
                    ));
        case "code": {
        const currentLanguage = block.code_data?.language || "javascript";
        const currentCode = block.code_data?.code || "";
          const prismLanguage = Prism.languages[currentLanguage] 
            ? currentLanguage 
            : "javascript";

  return renderBlockWrapper("Bloc de Code", blockIcons.code, (
    <div className="w-full max-w-3xl mx-auto p-2">
      
      <div className="relative rounded-xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800/80">
        
        <div className="flex justify-between items-center bg-slate-900/90 px-4 py-3 border-b border-slate-800/60 backdrop-blur-sm select-none">
          
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[inset_0_1px_1.5px_rgba(0,0,0,0.3)]" />
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[inset_0_1px_1.5px_rgba(0,0,0,0.3)]" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[inset_0_1px_1.5px_rgba(0,0,0,0.3)]" />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/30">
              {currentLanguage === "markup" ? "html" : currentLanguage}
            </span>

            <Select
              value={currentLanguage}
              onValueChange={(val) => onUpdateBlock(module.id, lesson.id, index, {
                ...block,
                code_data: { 
                  code: currentCode,
                  language: val 
                }
              })}
            >
              <SelectTrigger className="w-36 h-7 text-xs font-medium bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700/70 transition-colors shadow-sm focus:ring-1 focus:ring-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="php">PHP</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="markup">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="java">Java</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
        </div>
        
        <div className="font-mono text-sm leading-relaxed overflow-x-auto min-h-30 bg-slate-950 p-4">
          <Editor
            value={currentCode}
            placeholder="// Entrez votre code ou script d'exemple ici..."
            onValueChange={(codeText) => onUpdateBlock(module.id, lesson.id, index, {
              ...block,
              code_data: { 
                language: currentLanguage,
                code: codeText 
              }
            })}
            highlight={(codeText) => {
              if (!codeText || typeof codeText !== 'string') {
                return '';
              }
              try {
                const grammar = Prism.languages[prismLanguage] || Prism.languages.javascript;
                return Prism.highlight(codeText, grammar, prismLanguage);
              } catch (error) {
                return codeText;
                console.log(error)
              }
            }}
            padding={4}
            className="w-full text-slate-100 focus:outline-none selection:bg-slate-800"
            style={{
              fontFamily: '"Fira Code", "Courier New", Courier, monospace',
            }}
          />
        </div>

      </div>

    </div>
  ));
}
        case "image": {
          const isUploading = uploading === `image-${index}`;
          const inputId = `img-${index}`;

          const handleFiles = (files: FileList | null) => {
            if (!files?.[0] || isUploading) return;
            const file = files[0];
            const url = URL.createObjectURL(file);
            const img = new window.Image();
            img.onload = () => {
              onUpdateBlock(module.id, lesson.id, index, {
              });
              URL.revokeObjectURL(url);
            };
            img.src = url;

            const fakeEvent = { target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleFileUpload(fakeEvent, index, "image");
          };

          return renderBlockWrapper("Image", blockIcons.image, (
            <div className="w-full max-w-2xl space-y-3">
              {block.media_url ? (
                /* --- BLOC CONTENEUR D'IMAGE --- */
                <figure className="group relative overflow-hidden rounded-2xl border border-border bg-muted/30 transition-all hover:shadow-md">
                  {/* Zone d'affichage de l'image */}
                  <div className="relative flex aspect-video w-full items-center justify-center bg-background">
                    <Image
                      src={block.media_url}
                      alt={block.alt_text || "Aperçu"}
                      width={800}
                      height={475}
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                  </div>

                  {/* --- ACTIONS FLOTTANTES (SUR L'IMAGE EN HAUT À DROITE) --- */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-0 -translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                    {/* Bouton Remplacer */}
                    <Button
                      size="sm"
                      className="h-8 gap-1.5 rounded-xl bg-background/80 px-3 text-xs font-medium border border-orange-400 backdrop-blur-md text-orange-400 hover:bg-background transition-colors"
                      onClick={() => document.getElementById(inputId)?.click()}
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Remplacer
                    </Button>

                    <Button
                      size="icon"
                      className="h-8 w-8 rounded-xl text-muted-foreground bg-transparent border-orange-400 border hover:cursor-pointer  hover:bg-transparent transition-colors"
                      onClick={() =>
                        onUpdateBlock(module.id, lesson.id, index, {
                          media_url: "",
                        })
                      }
                    >
                      <X className="h-3.5 w-3.5 text-orange-400" />
                    </Button>
                  </div>
                  <input
                    id={inputId}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </figure>
              ) : (
                <label
                  htmlFor={inputId}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.dataset.drag = "true";
                  }}
                  onDragLeave={(e) => {
                    delete e.currentTarget.dataset.drag;
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    delete e.currentTarget.dataset.drag;
                    handleFiles(e.dataTransfer.files);
                  }}
                  className="group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-background px-6 py-12 text-center transition-all hover:border-primary/50 hover:bg-muted/30 data-[drag=true]:border-primary data-[drag=true]:bg-primary/5"
                >
                  <input
                    id={inputId}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
                    onChange={(e) => handleFiles(e.target.files)}
                  />

                  {isUploading ? (
                    <>
                      <div className="relative">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-primary/20" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">Upload en cours…</p>
                        <p className="text-xs text-muted-foreground">Optimisation de {"l'image"}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/50 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
                        <Upload className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Glissez une image ou{" "}
                          <span className="text-primary underline-offset-2 group-hover:underline">
                            parcourez
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, WEBP — {"jusqu'à 5 Mo"}
                        </p>
                      </div>
                    </>
                  )}
                </label>
              )}
            </div>
          ));
        }
        case "video": {
          const isUploading = uploading === `video-${index}`;
          const inputId = `video-${index}`;

          const handleVideoFiles = (files: FileList | null) => {
            if (!files?.[0] || isUploading) return;
            
            // Déclenche votre fonction existante de téléversement vers le serveur
            const fakeEvent = { target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleFileUpload(fakeEvent, index, "video");
          };

          return renderBlockWrapper("Vidéo", blockIcons.video, (
            <div className="w-full max-w-2xl space-y-3 font-sans">
              {block.media_url ? (
                /* --- LECTEUR VIDÉO STYLE SaaS PREMIUM --- */
                <figure className="group relative overflow-hidden rounded-2xl border border-border bg-muted/30 transition-all hover:shadow-md">
                  <div className="relative flex aspect-video w-full items-center justify-center bg-black rounded-2xl overflow-hidden">
                    <video 
                      src={block.media_url} 
                      controls 
                      className="h-full w-full object-contain" 
                    />
                  </div>

                  {/* --- ACTIONS FLOTTANTES AU SURVOL (EN HAUT À DROITE) --- */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 -translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 z-20">
                    {/* Bouton Remplacer */}
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 gap-1.5 rounded-xl bg-background/80 px-3 text-xs font-medium text-foreground border border-border/40 backdrop-blur-md shadow-sm hover:bg-background transition-colors"
                      onClick={() => document.getElementById(inputId)?.click()}
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Remplacer
                    </Button>

                    {/* Bouton Supprimer */}
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-xl bg-background/80 text-muted-foreground border border-border/40 backdrop-blur-md shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      onClick={() =>
                        onUpdateBlock(module.id, lesson.id, index, {
                          media_url: "",
                        })
                      }
                      title="Supprimer la vidéo"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <input
                    id={inputId}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleVideoFiles(e.target.files)}
                  />
                </figure>
              ) : (
                /* --- ZONE D'UPLOAD INTERACTIVE (LABEL) --- */
                <label
                  htmlFor={inputId}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.dataset.drag = "true";
                  }}
                  onDragLeave={(e) => {
                    delete e.currentTarget.dataset.drag;
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    delete e.currentTarget.dataset.drag;
                    handleVideoFiles(e.dataTransfer.files);
                  }}
                  className={`group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-background px-6 py-12 text-center transition-all hover:border-primary/50 hover:bg-muted/30
                    data-[drag=true]:border-primary data-[drag=true]:bg-primary/5
                    ${isUploading ? 'pointer-events-none opacity-80' : ''}`}
                >
                  <input
                    id={inputId}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    disabled={isUploading}
                    onChange={(e) => handleVideoFiles(e.target.files)}
                  />

                  {isUploading ? (
                    /* --- ÉTAT DE CHARGEMENT ÉPURÉ --- */
                    <div className="flex flex-col items-center justify-center space-y-4 py-4">
                      <div className="relative">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-primary/20" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">Téléchargement de la vidéo…</p>
                        <p className="text-xs text-muted-foreground">Traitement et encodage du fichier en cours</p>
                      </div>
                    </div>
                  ) : (
                    /* --- ÉTAT INITIAL --- */
                    <>
                      {/* Icône avec halo dynamique */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/50 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
                        <Video className="h-5 w-5" /> {/* Remplacé par une icône Video pour le contexte */}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Glissez une vidéo ici ou{" "}
                          <span className="text-primary underline-offset-2 group-hover:underline font-semibold">
                            parcourez vos fichiers
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          MP4, WebM, Ogg — {"jusqu'à "}50 Mo
                        </p>
                      </div>
                    </>
                  )}
                </label>
              )}
            </div>
          ));
        }    
        case "audio": {
          const isUploading = uploading === `audio-${index}`;
          const inputId = `audio-${index}`;

          const handleAudioFiles = (files: FileList | null) => {
            if (!files?.[0] || isUploading) return;
            const fakeEvent = { target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleFileUpload(fakeEvent, index, 'audio');
          };

          return renderBlockWrapper("Audio", blockIcons.audio, (
            <div className="w-full max-w-2xl space-y-3 font-sans">
              {block.media_url ? (
                <div className="group relative flex flex-col gap-2 rounded-2xl  bg-muted/20 p-4 transition-all  hover:bg-muted/30">
                  <div className="flex items-center gap-3">

                    <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 gap-1 rounded-lg px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                        onClick={() => document.getElementById(inputId)?.click()}
                      >
                        <Upload className="h-3 w-3" />
                        Remplacer
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeFile(index, "audio")}
                        title="Supprimer l'audio"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <audio src={block.media_url} controls className="h-9 w-full mt-1" />

                  <input
                    id={inputId}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => handleAudioFiles(e.target.files)}
                  />
                </div>
              ) : (
                <label
                  htmlFor={inputId}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.dataset.drag = "true";
                  }}
                  onDragLeave={(e) => {
                    delete e.currentTarget.dataset.drag;
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    delete e.currentTarget.dataset.drag;
                    handleAudioFiles(e.dataTransfer.files);
                  }}
                  className={`group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-background px-6 py-10 text-center transition-all hover:border-primary/50 hover:bg-muted/30
                    data-[drag=true]:border-primary data-[drag=true]:bg-primary/5
                    ${isUploading ? 'pointer-events-none opacity-80' : ''}`}
                >
                  <input
                    id={inputId}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    disabled={isUploading}
                    onChange={(e) => handleAudioFiles(e.target.files)}
                  />

                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-4 py-2">
                      <div className="relative">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-primary/20" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">Téléchargement du fichier audio…</p>
                        <p className="text-xs text-muted-foreground">Traitement audio en cours</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/50 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
                        <Music className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Glissez un fichier audio ou{" "}
                          <span className="text-primary underline-offset-2 group-hover:underline font-semibold">
                            parcourez vos dossiers
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          MP3, WAV, M4A — {"jusqu'à 20 Mo"}
                        </p>
                      </div>
                    </>
                  )}
                </label>
              )}
            </div>
          ));
        }
        case "file": {
        const isUploading = uploading === `file-${index}`;
        const inputId = `file-upload-${index}`;

        const handleDocumentFiles = (files: FileList | null) => {
          if (!files?.[0] || isUploading) return;
          
          // Déclenche votre fonction existante de téléversement
          const fakeEvent = { target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>;
          handleFileUpload(fakeEvent, index, "file");
        };

        return renderBlockWrapper("Fichier", blockIcons.file, (
          <div className="w-full max-w-2xl space-y-3 font-sans">
            {block.file_url ? (
              /* --- AFFICHAGE DU FICHIER TÉLÉVERSÉ --- */
              <div className="group relative flex items-center justify-between rounded-2xl border border-border bg-muted/20 p-3.5 transition-all hover:bg-muted/30 hover:shadow-sm">
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Icône dynamique basée sur le type de fichier */}
                  <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/40 shadow-sm transition-transform group-hover:scale-105", getFileIconBg(block.mime_type))}>
                    {getFileIcon(block.mime_type)}
                  </div>
                  
                  {/* Métadonnées du fichier */}
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-medium text-sm text-foreground truncate max-w-[320px] md:max-w-100">
                      {block.file_name || "Document sans titre"}
                    </p>
                    {block.file_size && (
                      <p className="text-xs text-muted-foreground font-light">
                        {formatFileSize(block.file_size)}
                      </p>
                    )}
                  </div>
                </div>

                {/* --- BOUTONS D'ACTIONS COHÉRENTS --- */}
                <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {/* Bouton Remplacer */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 gap-1.5 rounded-xl px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => document.getElementById(inputId)?.click()}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Remplacer
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={() => window.open(block.file_url, "_blank")}
                    title="Ouvrir le fichier"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>

                  {/* Bouton Supprimer */}
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeFile(index, "file")}
                    title="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <input
                  id={inputId}
                  type="file"
                  className="hidden"
                  onChange={(e) => handleDocumentFiles(e.target.files)}
                />
              </div>
            ) : (
              <label
                htmlFor={inputId}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.dataset.drag = "true";
                }}
                onDragLeave={(e) => {
                  delete e.currentTarget.dataset.drag;
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  delete e.currentTarget.dataset.drag;
                  handleDocumentFiles(e.dataTransfer.files);
                }}
                className={`group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-background px-6 py-10 text-center transition-all hover:border-primary/50 hover:bg-muted/30
                  data-[drag=true]:border-primary data-[drag=true]:bg-primary/5
                  ${isUploading ? 'pointer-events-none opacity-80' : ''}`}
              >
                <input
                  id={inputId}
                  type="file"
                  className="hidden"
                  disabled={isUploading}
                  onChange={(e) => handleDocumentFiles(e.target.files)}
                />

                {isUploading ? (
                  /* --- ÉTAT DE CHARGEMENT ÉPURÉ --- */
                  <div className="flex flex-col items-center justify-center space-y-4 py-2">
                    <div className="relative">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-primary/20" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Téléchargement du document…</p>
                      <p className="text-xs text-muted-foreground">Mise en ligne sécurisée</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/50 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        Glissez un document ici ou{" "}
                        <span className="text-primary underline-offset-2 group-hover:underline font-semibold">
                          parcourez vos fichiers
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, DOCX, XLSX, ZIP — {"jusqu'à 20 Mo"}
                      </p>
                    </div>
                  </>
                )}
              </label>
            )}
          </div>
        ));
        }
      case "embed":
        return renderBlockWrapper("Intégration Externe", blockIcons.embed, (
          <div className="space-y-3">
            <Input
              value={block.media_url}
              placeholder="Insérer l'URL ou le lien d'intégration..."
              onChange={(e) => onUpdateBlock(module.id, lesson.id, index, { media_url: e.target.value })}
            />
            {block.media_url && (
              <div className="aspect-video rounded-md overflow-hidden border mt-2 bg-gray-900">
                <iframe src={block.media_url} title="Contenu embarqué" className="w-full h-full" allowFullScreen />
              </div>
            )}
          </div>
        ));
      case "quiz":
        return renderBlockWrapper("Quiz Éducatif", blockIcons.quiz, (
          <div className="space-y-3">
            <QuizEditor
              block={block}
              onUpdate={(updates) => onUpdateBlock(module.id, lesson.id, index, updates)}
            />
          </div>
        ));              
      case "divider":
      return renderBlockWrapper("Séparateur Visuel", blockIcons.divider, (
        <div className="py-2 space-y-3">
          <hr className={cn(
            "border-t-2",
            block.style === "dashed" && "border-dashed",
            block.style === "dotted" && "border-dotted",
            "border-gray-200"
          )} />
          <div className="flex justify-end">
          </div>
        </div>
      ));
      case "callout":
      return renderBlockWrapper("Encart d'Information", blockIcons.callout, (
      <div className={cn(
        "p-4 rounded-lg border-l-4 shadow-2xs",
        block.settings.type === "info" && "bg-sky-50/40 border-sky-400 text-sky-950",
        block.settings.type === "success" && "bg-green-50/60 border-green-500 text-green-900",
        block.settings.type === "warning" && "bg-yellow-50/60 border-yellow-500 text-yellow-900",
        block.settings.type === "danger" && "bg-red-50/60 border-red-500 text-red-900",
      )}>
      <div className="flex gap-3 items-start">
        <Textarea
          value={block.content}
          placeholder="Saisissez une remarque ou consigne importante..."
          className="flex-1 border-none shadow-none focus-visible:ring-0 resize-none bg-transparent p-0 min-h-12.5 font-medium placeholder:font-normal"
          onChange={(e) => onUpdateBlock(module.id, lesson.id, index, { content: e.target.value })}
        />
      </div>
    </div>
  ));
            default:
        return (
          <div key={index} className="p-4 rounded-xl border bg-yellow-50/50 text-xs text-yellow-700 italic">
            Type de bloc non supporté ou absent du rendu.
          </div>
        );

                  }
  })}
</ScrollArea>

    </main>
        <aside className="w-38 shrink-0 border-l bg-white overflow-y-auto shadow-sm">
          <div className="p-4">
            <div className="w-full flex flex-col gap-1">
              {Object.entries(blockLabels).map(([type, label]) => {
                const variants = blockVariants[type as BlockType];

                if (variants) {
                  return (
                    <DropdownMenu key={type}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3 hover:bg-orange-50 hover:text-orange-700 text-gray-700 transition-colors duration-200 rounded-lg py-2 h-9"
                        >
                          <span className="text-orange-500">{blockIcons[type as BlockType]}</span>
                          <span className="text-xs font-medium">{label}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-46">
                        {variants.map((v) => (
                          <DropdownMenuItem
                            key={v.key}
                            onClick={() => handleAddBlock(type as BlockType, v.data)}
                            className="gap-2"
                          >
                            {v.badge && (
                              <span className="text-[10px] font-bold text-orange-400 w-6">{v.badge}</span>
                            )}
                            <span className="text-sm">{v.label}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }

                return (
                  <Button
                    key={type}
                    variant="ghost"
                    className="w-full justify-start gap-3 hover:bg-orange-50 hover:text-orange-700 text-gray-700 transition-colors duration-200 rounded-lg py-2 h-9"
                    onClick={() => handleAddBlock(type as BlockType)}
                  >
                    <span className="text-orange-500">{blockIcons[type as BlockType]}</span>
                    <span className="text-xs font-medium">{label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </aside>
        </div>

        {/* Boîte de dialogue de confirmation de suppression */}
        <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={(open) => {
          if (!open) cancelDelete();
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce bloc{" "}
                <span className="font-semibold text-foreground">
                  {getBlockTypeLabel(deleteConfirmation.blockType)}
                </span>
                {" "}? Cette action est irréversible et supprimera définitivement tout le contenu associé à ce bloc.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDelete}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer définitivement
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
</div>


  );
}