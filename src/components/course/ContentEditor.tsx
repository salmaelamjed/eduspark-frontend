"use client";
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
  File,
  Upload,
  Download,
} from "lucide-react";
import { Lesson, Block, BlockType } from "@/types/block";
import { useState, useRef, ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ACCEPTED_FILE_TYPES, ACCEPTED_IMAGE_TYPES, ACCEPTED_VIDEO_TYPES, getFileIcon, getFileIconBg } from "@/constants/content-editor";
import { formatFileSize } from "@/constants/content-editor";
import { blockIcons } from "@/constants/content-editor";
import { blockLabels } from "@/constants/content-editor";
import { Module } from "@/types/module";
import { ScrollArea } from "../ui/scroll-area";


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
}


export function ContentEditor({
  lesson,
  module,
  onAddBlock,
  onUpdateBlock
}: ContentEditorProps) {
  const [uploading, setUploading] = useState<string | null>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  if (!lesson || !module) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background min-h-[70vh]">
        <div className="text-center max-w-md px-8 py-12">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Aucune leçon sélectionnée</h2>
          <p className="text-muted-foreground">
            Sélectionnez une leçon dans la barre latérale pour commencer.
          </p>
        </div>
      </div>
    );
  }

 const handleAddBlock = (type: BlockType) => {
    if (!module?.id || !lesson?.id) return;

    let initialData: Partial<Block> = {};
    
    console.log("Type du bloc cliqué :", type);

    switch (type) {
      case "paragraph":
        
        initialData = { content_text: "" };
        break;
      case "heading":
        initialData = { content_text: ""};
        break;
      case "list":
        initialData = { content_text: "", list_type: "unordered" };
        break;
      case "quote":
        initialData = { content_text: "", author: "" };
        break;
      case "callout":
        initialData = { content_text: "", callout_type: "info" };
        break;
      case "divider":
        initialData = { style: "solid" };
        break;
      case "code":
        initialData = { 
          code_data: { 
            code: "// Écrivez votre code ici...\n\nfunction example() {\n  return 'Hello, World!';\n}", 
            language: "javascript" 
          } 
        };
        break;
      case "video":
        initialData = { 
          media_url: "",
          duration_seconds: 0
        };
        break;
      case "audio":
        initialData = { 
          media_url: "",
          duration_seconds: 0
        };
        break;
      case "image":
        initialData = { 
          media_url: "",
          alt_text: "",
          caption: ""
        };
        break;
      case "file":
        initialData = { 
          file_name: "",
          file_url: "", 
          file_size: 0,
          mime_type: "" 
        };
        break;
      case "embed":
        initialData = {
          media_url: "",
          embed_type: "other"
        };
        break;
      case "quiz":
        initialData = {
          quiz_data: {
            questions: [{
              question: "",
              type: "multiple_choice",
              options: ["", "", "", ""],
              correct_answers: [0],
              points: 1
            }],
            passing_score: 70,
            shuffle_questions: false,
            show_explanation_after_submit: true
          }
        };
        break;
    }

    onAddBlock(module.id, lesson.id, type, initialData);
  };

  const simulateFileUpload = async (file: File, blockIndex: number, type: 'video' | 'file') => {
    setUploading(`${type}-${blockIndex}`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    const objectUrl = URL.createObjectURL(file);
    
    if (type === 'video') {
      onUpdateBlock(module.id, lesson.id, blockIndex, {
        media_url: objectUrl,
        file_name: file.name,
        file_size: file.size,
      });
    } else {
      onUpdateBlock(module.id, lesson.id, blockIndex, {
        file_url: objectUrl,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type
      });
    }
    
    setUploading(null);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, blockIndex: number, type: 'video' | 'file') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'video' && !ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      alert("Type de fichier vidéo non supporté. Utilisez MP4, WebM ou OGG.");
      return;
    }

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

  const removeFile = (blockIndex: number, type: 'video' | 'file') => {
    if (type === 'video') {
      onUpdateBlock(module.id, lesson.id, blockIndex, {
        media_url: "",
        file_name: "",
        file_size: 0,
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


return (
    <div className="flex flex-col h-screen from-gray-50 w-full  ">
  {/* Header */}
  <header className=" bg-white/90 backdrop-blur-md shadow-md border-b">
    <div className="px-6 py-4 flex items-center justify-between">
      <div>
        <h3 className="font-bold text-xl text-gray-900">{module.title}</h3>
        <p className="text-sm text-gray-500 mt-0.5">• {lesson.title}</p>
      </div>
    </div>
  </header>

  {/* Main content + Sidebar */}
  <div className="flex flex-1 overflow-hidden">
    {/* Content */}
    <main className="flex-1  overflow-y-auto">
      <ScrollArea className="p-6 space-y-6">
  {lesson.blocks.map((block, index) => {
    console.log("Rendu du bloc type:", block.type);
    switch (block.type) {
    case "heading":
  return (
    <div
      key={index}
      className="group relative rounded-xl border border-border/60 bg-linear-to-br from-card to-muted/30 p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
    >
  

      <div className="relative">
        <Input
          value={block.content_text}
          placeholder="Saisissez le titre de votre section…"
          className="h-auto border-0 bg-transparent px-0 py-2 text-3xl font-bold tracking-tight shadow-none placeholder:text-muted-foreground/50 placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) =>
            onUpdateBlock(module.id, lesson.id, index, { content_text: e.target.value })
          }
        />
      </div>

      
    </div>
  );




      case "paragraph":
        return (
          <Textarea
            key={index}
            value={block.content_text}
            placeholder="Écrivez votre texte..."
            className="border-none shadow-none focus:ring-0 resize-none"
            onChange={(e) =>
              onUpdateBlock(module.id, lesson.id, index, { content_text: e.target.value })
            }
          />
        );

      case "quote":
        return (
          <div key={index} className="pl-4 border-l-4 border-orange-500">
            <Textarea
              value={block.content_text}
              placeholder="Citation..."
              className="border-none shadow-none focus:ring-0 resize-none italic"
              onChange={(e) =>
                onUpdateBlock(module.id, lesson.id, index, { content_text: e.target.value })
              }
            />
            <Input
              value={block.author}
              placeholder="Auteur"
              className="mt-2 text-sm border-none shadow-none focus:ring-0"
              onChange={(e) =>
                onUpdateBlock(module.id, lesson.id, index, { author: e.target.value })
              }
            />
          </div>
        );

      case "code":
        return (
          <Textarea
            key={index}
            value={block.code_data?.code}
            placeholder="// Votre code ici..."
            className="font-mono text-sm border border-gray-200 rounded-md p-3"
            onChange={(e) =>
              onUpdateBlock(module.id, lesson.id, index, {
                code_data: { ...block.code_data, code: e.target.value },
              })
            }
          />
        );

      case "image":
        return (
          <div key={index} className="space-y-2">
            {block.media_url ? (
              <Image
                src={block.media_url}
                alt={block.alt_text || "Image"}
                width={400}
                height={300}
                className="rounded-md"
              />
            ) : (
              <p className="text-gray-400 italic">Aucune image téléchargée</p>
            )}
            <Input
              value={block.caption}
              placeholder="Légende..."
              className="border-none shadow-none focus:ring-0"
              onChange={(e) =>
                onUpdateBlock(module.id, lesson.id, index, { caption: e.target.value })
              }
            />
          </div>
        );

        case "video":
      return (
        <div key={index} className="space-y-3 border rounded-lg p-4 bg-white">
          {block.media_url ? (
            <video src={block.media_url} controls className="w-full rounded-md" />
          ) : (
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileUpload(e, index, 'video')}
                ref={videoRef}
                className="hidden"
              />
              <Button onClick={() => videoRef.current?.click()} variant="outline">
                <Upload className="mr-2 h-4 w-4" /> Télécharger une vidéo
              </Button>
            </div>
          )}
          {uploading === `video-${index}` && <p>Téléchargement...</p>}
        </div>
      );
        
     case "list":
  return (
    <div key={index} className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <div className="flex gap-3 items-center">
        <label className="text-sm font-medium text-muted-foreground">
          Type de liste
        </label>
        <Select
          value={block.list_type || "unordered"}
          onValueChange={(val) =>
            onUpdateBlock(module.id, lesson.id, index, { list_type: val as "ordered" | "unordered" })
          }
        >
          <SelectTrigger className="w-40 border rounded-md shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unordered">• Puces</SelectItem>
            <SelectItem value="ordered">1. Numérotée</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Textarea
        value={block.content_text}
        placeholder="Saisissez votre liste (un élément par ligne)"
        className="font-mono text-sm border rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary"
        rows={6}
        onChange={(e) =>
          onUpdateBlock(module.id, lesson.id, index, { content_text: e.target.value })
        }
      />
      <p className="text-xs text-muted-foreground italic">
        Séparez chaque élément par un retour à la ligne.
      </p>
    </div>
  );

case "audio":
  return (
    <div key={index} className="space-y-3 border rounded-lg p-4 bg-white">
      {block.media_url ? (
        <audio src={block.media_url} controls className="w-full" />
      ) : (
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => handleFileUpload(e, index, "file")} // Réutilisation de la logique fichier
            className="hidden"
            id={`audio-upload-${index}`}
          />
          <Button
            onClick={() => document.getElementById(`audio-upload-${index}`)?.click()}
            variant="outline"
          >
            <Upload className="mr-2 h-4 w-4" /> Télécharger un fichier audio
          </Button>
        </div>
      )}
      {uploading === `file-${index}` && <p>Téléchargement...</p>}
    </div>
  );

case "file":
  return (
    <div key={index} className="border rounded-lg p-4 bg-white space-y-3">
      {block.file_url ? (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", getFileIconBg(block.mime_type))}>
              {getFileIcon(block.mime_type)}
            </div>
            <div>
              <p className="font-medium text-sm">{block.file_name || "Fichier"}</p>
              {block.file_size && (
                <p className="text-xs text-muted-foreground">{formatFileSize(block.file_size)}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(block.file_url, "_blank")}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => removeFile(index, "file")}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <input
            type="file"
            onChange={(e) => handleFileUpload(e, index, "file")}
            className="hidden"
            id={`file-upload-${index}`}
          />
          <Button
            onClick={() => document.getElementById(`file-upload-${index}`)?.click()}
            variant="outline"
          >
            <Upload className="mr-2 h-4 w-4" /> Télécharger un fichier
          </Button>
        </div>
      )}
    </div>
  );

case "embed":
  return (
    <div key={index} className="space-y-3 border rounded-lg p-4 bg-white">
      <Input
        value={block.media_url}
        placeholder="URL à intégrer (YouTube, Vimeo, etc.)"
        onChange={(e) =>
          onUpdateBlock(module.id, lesson.id, index, { media_url: e.target.value })
        }
      />
      {block.media_url && (
        <div className="aspect-video rounded-md overflow-hidden border">
          <iframe
            src={block.media_url}
            title="Contenu intégré"
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );

case "quiz":
  return (
    <div key={index} className="space-y-4 border rounded-lg p-4 bg-white">
      <Input
        value={block.title || "Quiz"}
        placeholder="Titre du quiz"
        onChange={(e) =>
          onUpdateBlock(module.id, lesson.id, index, { title: e.target.value })
        }
      />
      <Textarea
        value={block.description || ""}
        placeholder="Description (optionnelle)"
        onChange={(e) =>
          onUpdateBlock(module.id, lesson.id, index, { description: e.target.value })
        }
      />
      <div className="text-sm text-muted-foreground">
        ⚙️ Interface {"d'édition"} avancée à venir (questions, réponses, etc.)
      </div>
      <pre className="text-xs bg-gray-100 p-2 rounded">
        {JSON.stringify(block.quiz_data, null, 2)}
      </pre>
    </div>
  );

case "divider":
  return (
    <div key={index} className="py-4">
      <hr className={cn(
        "border-t",
        block.style === "dashed" && "border-dashed",
        block.style === "dotted" && "border-dotted"
      )} />
      <div className="flex justify-end mt-2">
        <Select
          value={block.style || "solid"}
          onValueChange={(val) =>
            onUpdateBlock(module.id, lesson.id, index, { style: val as "solid" | "dashed" | "dotted" })
          }
        >
          <SelectTrigger className="w-28 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Plein</SelectItem>
            <SelectItem value="dashed">Tirets</SelectItem>
            <SelectItem value="dotted">Pointillés</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

case "callout":
  return (
    <div key={index} className={cn(
      "p-4 rounded-lg border-l-4",
      block.callout_type === "note" && "bg-blue-50 border-blue-500",
      block.callout_type === "tip" && "bg-green-50 border-green-500",
      block.callout_type === "warning" && "bg-yellow-50 border-yellow-500",
      block.callout_type === "danger" && "bg-red-50 border-red-500",
      block.callout_type === "info" && "bg-gray-50 border-gray-500"
    )}>
      <div className="flex gap-2 items-start">
        <Select
          value={block.callout_type || "info"}
          onValueChange={(val) =>
            onUpdateBlock(module.id, lesson.id, index, { callout_type: val as any })
          }
        >
          <SelectTrigger className="w-28 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="note">📘 Note</SelectItem>
            <SelectItem value="tip">💡 Astuce</SelectItem>
            <SelectItem value="warning">⚠️ Attention</SelectItem>
            <SelectItem value="danger">🚨 Danger</SelectItem>
            <SelectItem value="info">ℹ️ Info</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          value={block.content_text}
          placeholder="Texte de l'encart..."
          className="flex-1 border-none shadow-none focus:ring-0 resize-none bg-transparent"
          onChange={(e) =>
            onUpdateBlock(module.id, lesson.id, index, { content_text: e.target.value })
          }
        />
      </div>
    </div>
  );
      default:
        return (
          <div key={index} className="text-gray-400 italic">
            Bloc  non encore implémenté
          </div>
        );
    }
  })}
</ScrollArea>

    </main>

    {/* Sidebar */}
    <aside className="w-64 shrink-0 border-l bg-white/80 backdrop-blur-md shadow-lg overflow-y-auto">
      <div className="p-4">
        <h4 className="font-semibold text-sm mb-4 text-gray-700">Ajouter un bloc</h4>
        <div className="flex flex-col gap-2 divide-y">
          {Object.entries(blockLabels).map(([type, label]) => (
            <Button
              key={type}
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-orange-100 hover:text-orange-700 transition-all duration-300 rounded-md"
              onClick={() => handleAddBlock(type as BlockType)}
            >
              <span className="text-orange-600 group-hover:text-orange-700">
                {blockIcons[type as BlockType]}
              </span>
              <span className="text-sm font-medium">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </aside>
  </div>
</div>


  );
}