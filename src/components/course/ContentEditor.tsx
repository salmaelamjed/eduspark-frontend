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
  MoveUp,
  MoveDown,
  Code,
  FileText,
  Video,
  File,
  HelpCircle,
  Upload,
  X,
  Play,
  Download,
} from "lucide-react";
import { Lesson, Block, BlockType } from "@/types/block";
import { useState, useRef, ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ACCEPTED_FILE_TYPES, ACCEPTED_IMAGE_TYPES, ACCEPTED_VIDEO_TYPES, codeLanguages, getFileIcon, getFileIconBg } from "@/constants/content-editor";
import { downloadFile } from "@/constants/landing";
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
  const fileRef = useRef<HTMLInputElement>(null);

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

    switch (type) {
      case "paragraph":
        initialData = { content_text: "" };
        break;
      case "heading":
        initialData = { content_text: "", level: 2 };
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
    
    // Simulation d'un upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Générer une URL locale pour la prévisualisation
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
    <div className="flex-1 flex bg-background  ">
      {/* Main content area */}
      <div className="flex-1 flex flex-col ">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background border-b">
          <div className="px-6 py-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{module.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">• {lesson.title}</p>
              </div>
            </div>
          </div>
        </div>
              <ScrollArea >
                   <div className="flex-1 overflow-y-auto mt-3 p-3">
          <input
            type="file"
            ref={videoRef}
            className="hidden"
            accept="video/*"
            onChange={(e) => {
              const blockIndex = parseInt(videoRef.current?.dataset.index || '0');
              handleFileUpload(e, blockIndex, 'video');
            }}
          />
          <input
            type="file"
            ref={fileRef}
            className="hidden"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt,.zip,.rar,.png,.jpg,.jpeg,.gif,.webp"
            onChange={(e) => {
              const blockIndex = parseInt(fileRef.current?.dataset.index || '0');
              handleFileUpload(e, blockIndex, 'file');
            }}
          />

          <div className="min-w-full mx-auto space-y-8 pb-32">
            {lesson.blocks.length === 0 ? (
              <div className="border-2 border-dashed border-border/60 rounded-2xl p-16 text-center bg-card/40">
                <div className="mx-auto w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Leçon vide</h3>
                <p className="text-muted-foreground mb-8">
                  Commencez par ajouter un bloc de contenu
                </p>
              </div>
            ) : (
              <>
                {lesson.blocks.map((block, index) => (
                  <div key={index} className="group relative">
                    <div>
                      {/* Actions flottantes */}
                      <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 flex gap-1 backdrop-blur-sm rounded-md p-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="p-6">
                        {/* TEXT */}
                        {block.type === "paragraph" && (
                          <div className="space-y-2">
                            <Textarea
                              value={block.content_text || ""}
                              onChange={(e) => onUpdateBlock(module.id, lesson.id, index, { content_text: e.target.value })}
                              placeholder="Commencez à écrire votre contenu ici..."
                              className="shadow-none text-base leading-relaxed resize-none border-none bg-transparent focus-visible:ring-0 p-0 "
                            />
                          </div>
                        )}

                        {/* CODE - ZONE AMÉLIORÉE */}
                        {block.type === "code" && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Code className="h-5 w-5 text-orange-600" />
                                <span className="font-medium">Bloc de code</span>
                              </div>
                              <Select
                                value={(block.code_data?.language) || "javascript"}
                                onValueChange={(lang) =>
                                  onUpdateBlock(module.id, lesson.id, index, {
                                    code_data: { ...block.code_data, language: lang }
                                  })
                                }
                              >
                                <SelectTrigger className="w-48 h-9">
                                  <SelectValue placeholder="Sélectionnez un langage" />
                                </SelectTrigger>
                                <SelectContent>
                                  {codeLanguages.map((lang) => (
                                    <SelectItem key={lang.value} value={lang.value}>
                                      {lang.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="relative rounded-lg overflow-hidden border border-border">
                              {/* En-tête du bloc de code */}
                              <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="text-xs text-zinc-400 font-mono">
                                  {block.code_data?.language?.toUpperCase() || "JS"}
                                </div>
                              </div>
                              
                              {/* Zone d'édition du code */}
                              <Textarea
                                value={block.code_data?.code || ""}
                                onChange={(e) =>
                                  onUpdateBlock(module.id, lesson.id, index, {
                                    code_data: { ...block.code_data, code: e.target.value }
                                  })
                                }
                                placeholder="// Écrivez votre code ici..."
                                className={cn(
                                  "font-mono text-sm resize-none border-none focus-visible:ring-0",
                                  "bg-zinc-950 00",
                                  "p-4 min-h-62.5 ",
                                  "leading-relaxed whitespace-pre"
                                )}
                                spellCheck="false"
                              />
                              
                              {/* Compteur de lignes (optionnel) */}
                              <div className="absolute left-0 top-12 bottom-0 w-12 bg-zinc-900/50 border-r border-zinc-800 text-xs text-zinc-500 font-mono hidden md:block">
                                {block.code_data?.code?.split('\n').map((_, i) => (
                                  <div key={i} className="px-3 py-0.5 text-right">
                                    {i + 1}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="text-xs text-muted-foreground flex items-center gap-4">
                              <span>Tips: Utilisez Tab pour indenter, Shift+Tab pour désindenter</span>
                            </div>
                          </div>
                        )}

                        {/* VIDEO */}
                        {block.type === "video" && (
                          <div className="space-y-4">
                            {!block.media_url ? (
                              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                <div 
                                  className="flex flex-col items-center justify-center"
                                  onClick={() => {
                                    if (videoRef.current) {
                                      videoRef.current.dataset.index = index.toString();
                                      videoRef.current.click();
                                    }
                                  }}
                                >
                                  {uploading === `video-${index}` ? (
                                    <>
                                      <div className="w-12 h-12 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mb-3"></div>
                                      <p className="font-medium mb-2">Téléchargement en cours...</p>
                                      <p className="text-sm text-muted-foreground">
                                        Veuillez patienter pendant le traitement de la vidéo
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <Video className="h-12 w-12 text-orange-600 mb-3" />
                                      <p className="font-medium mb-2">Ajouter une vidéo</p>
                                      <p className="text-sm text-muted-foreground mb-4">
                                        Cliquez pour sélectionner une vidéo MP4, WebM ou OGG
                                      </p>
                                      <Button variant="outline" size="sm">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Choisir une vidéo
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="relative rounded-lg overflow-hidden bg-black">
                                  <video
                                    src={block.media_url}
                                    controls
                                    className="w-full max-h-96"
                                  />
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8"
                                    onClick={() => removeFile(index, 'video')}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    <Play className="h-3 w-3 inline mr-1" />
                                    Lecture disponible
                                  </div>
                                </div>
                                
                              </div>
                            )}
                          </div>
                        )}

                        {/* FILE - VERSION AMÉLIORÉE */}
                        {block.type === "file" && (
                          <div className="space-y-4">
                            {!block.file_url ? (
                              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                <div 
                                  className="flex flex-col items-center justify-center"
                                  onClick={() => {
                                    if (fileRef.current) {
                                      fileRef.current.dataset.index = index.toString();
                                      fileRef.current.click();
                                    }
                                  }}
                                >
                                  {uploading === `file-${index}` ? (
                                    <>
                                      <div className="w-12 h-12 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mb-3"></div>
                                      <p className="font-medium mb-2">Téléchargement en cours...</p>
                                      <p className="text-sm text-muted-foreground">
                                        Traitement du fichier...
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <File className="h-12 w-12 text-orange-600 mb-3" />
                                      <p className="font-medium mb-2">Ajouter un fichier</p>
                                      <p className="text-sm text-muted-foreground mb-4">
                                        Images, PDF, Documents Office, ZIP, etc.
                                      </p>
                                      <Button variant="outline" size="sm">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Choisir un fichier
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {/* Si c'est une image : afficher la prévisualisation */}
                                {block.mime_type?.startsWith('image/') ? (
                                  <div className="border rounded-lg overflow-hidden bg-card">
                                    <div className="relative">
                                      <Image 
                                        src={block.file_url} 
                                        alt={block.file_name || "Image téléchargée"}
                                        className="w-full h-auto max-h-1000 object-contain bg-black/5"
                                      />
                                      <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-8 w-8"
                                        onClick={() => removeFile(index, 'file')}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <div className="p-4 border-t">
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileIconBg(block.mime_type)}`}>
                                            {getFileIcon(block.mime_type)}
                                          </div>
                                          <div>
                                            <Input
                                              value={block.file_name || ""}
                                              onChange={(e) =>
                                                onUpdateBlock(module.id, lesson.id, index, { file_name: e.target.value })
                                              }
                                              placeholder="Nom du fichier"
                                              className="font-medium border-none p-0 h-auto"
                                            />
                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                              <span>Image</span>
                                              <span>•</span>
                                              <span>{formatFileSize(block.file_size || 0)}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => downloadFile(block.file_url, block.file_name || 'download')}
                                          >
                                            <Download className="h-4 w-4 mr-2" />
                                            Télécharger
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* Si c'est un autre type de fichier : afficher la carte */
                                  <div className="border rounded-lg p-6 bg-card">
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center space-x-4">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getFileIconBg(block.mime_type)}`}>
                                          {getFileIcon(block.mime_type)}
                                        </div>
                                        <div className="flex-1">
                                          <Input
                                            value={block.file_name || ""}
                                            onChange={(e) =>
                                              onUpdateBlock(module.id, lesson.id, index, { file_name: e.target.value })
                                            }
                                            placeholder="Nom du fichier"
                                            className="font-medium text-lg border-none p-0 h-auto"
                                          />
                                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                            <span className="px-2 py-1 bg-muted rounded-md text-xs">
                                              {block.mime_type?.split('/')[1]?.toUpperCase() || "FICHIER"}
                                            </span>
                                            <span>•</span>
                                            <span>{formatFileSize(block.file_size || 0)}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t">
                                      <div className="text-sm text-muted-foreground">
                                        Ce fichier sera téléchargeable par les apprenants
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => window.open(block.file_url, '_blank')}
                                          disabled={!block.mime_type?.includes('pdf') && !block.mime_type?.startsWith('text/')}
                                        >
                                          {block.mime_type?.includes('pdf') ? "Voir le PDF" : "Ouvrir"}
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => downloadFile(block.file_url, block.file_name || 'download')}
                                        >
                                          <Download className="h-4 w-4 mr-2" />
                                          Télécharger
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          size="icon"
                                          className="h-9 w-9"
                                          onClick={() => removeFile(index, 'file')}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* QUIZ */}
                        {block.type === "quiz" && (
                          <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-3">
                              <HelpCircle className="h-5 w-5 text-orange-600" />
                              <span className="font-medium">Quiz</span>
                            </div>

                            <Textarea
                              placeholder="Posez votre question ici..."
                              value={block.question || ""}
                              onChange={(e) =>
                                onUpdateBlock(module.id, lesson.id, index, { question: e.target.value })
                              }
                              className="min-h-20"
                            />

                            <div className="space-y-3 mt-4">
                              <p className="text-sm font-medium">Options de réponse :</p>
                              {block.options?.map((option: string, optIndex: number) => (
                                <div key={optIndex} className="flex items-center gap-3">
                                  <input
                                    type="radio"
                                    name={`correct-${index}`}
                                    checked={block.correctAnswer === optIndex}
                                    onChange={() =>
                                      onUpdateBlock(module.id, lesson.id, index, { correctAnswer: optIndex })
                                    }
                                    className="h-4 w-4 text-orange-600"
                                  />
                                  <Input
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...(block.options || [])];
                                      newOptions[optIndex] = e.target.value;
                                      onUpdateBlock(module.id, lesson.id, index, { options: newOptions });
                                    }}
                                    placeholder={`Option ${optIndex + 1}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
    </ScrollArea>
        
      </div>

      {/* Sidebar droite verticale */}
      <aside className="w-34 border-l bg-card/30 h-screen overflow-y-auto">
        <div className="">
          <h4 className="font-semibold text-sm mb-4 px-2">Ajouter un bloc</h4>
          <div className="flex flex-col gap-1">
            {Object.entries(blockLabels).map(([type, label]) => (
              <Button
                key={type}
                variant="ghost"
                className="w-full justify-start gap-3 hover:bg-orange-50 hover:text-orange-600 group"
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
  );
}