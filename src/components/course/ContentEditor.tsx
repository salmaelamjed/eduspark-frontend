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
  Plus,
  X,
} from "lucide-react";
import { Lesson, Block, BlockType, QuizBlock, QuizQuestion } from "@/types/block";
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
  onDeleteBlock?: (moduleId: number, lessonId: number, blockIndex: number) => void; 
}

interface QuizEditorProps {
  block: QuizBlock;
  onUpdate: (updates: Partial<QuizBlock>) => void;
}

function QuizEditor({ block, onUpdate }: QuizEditorProps) {
const quizData = block.quiz_data || { questions: [], passing_score: 70 };

  const updateQuestion = (qIndex: number, updatedQuestion: Partial<QuizQuestion>) => {
    const newQuestions = [...quizData.questions];
    newQuestions[qIndex] = { ...newQuestions[qIndex], ...updatedQuestion } as QuizQuestion;
    onUpdate({
      quiz_data: { ...quizData, questions: newQuestions }
    });
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      question: "",
      type: "multiple_choice",
      options: ["Option 1", "Option 2"],
      correct_answers: [0],
      points: 1,
      explanation: ""
    };
    onUpdate({
      quiz_data: { ...quizData, questions: [...quizData.questions, newQuestion] }
    });
  };

  const removeQuestion = (qIndex: number) => {
    onUpdate({
      quiz_data: { ...quizData, questions: quizData.questions.filter((_, i) => i !== qIndex) }
    });
  };

  const addOption = (qIndex: number) => {
    const q = quizData.questions[qIndex];
    const currentOptions = q.options || [];
    updateQuestion(qIndex, { options: [...currentOptions, `Option ${currentOptions.length + 1}`] });
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const q = quizData.questions[qIndex];
    if (!q.options) return;
    
    const newOptions = q.options.filter((_, i) => i !== optIndex);
    let newCorrect: number[] = [];
    if (Array.isArray(q.correct_answers)) {
      newCorrect = q.correct_answers
        .map(v => (v > optIndex ? v - 1 : v))
        .filter(v => v !== optIndex && v >= 0 && v < newOptions.length);
      if (newCorrect.length === 0 && newOptions.length > 0) newCorrect = [0];
    } else {
      newCorrect = [0];
    }

    updateQuestion(qIndex, { options: newOptions, correct_answers: newCorrect });
  };
  return (
    <div className="space-y-6 mt-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">Configuration des Questions</h4>
        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-1 font-medium">
            Score requis (%) :
            <Input
              type="number"
              className="w-16 h-7 text-xs px-1"
              value={quizData.passing_score ?? 70}
              onChange={(e) => onUpdate({
                quiz_data: { ...quizData, passing_score: parseInt(e.target.value) || 0 }
              })}
            />
          </label>
        </div>
      </div>

      {quizData.questions?.map((q, qIndex) => (
        <div key={qIndex} className="p-4 bg-white border rounded-lg shadow-xs space-y-4 relative group">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-red-50"
            onClick={() => removeQuestion(qIndex)}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Énoncé de la question */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-orange-600">Question n°{qIndex + 1}</span>
            <Input
              value={q.question}
              placeholder="Ex : Quelle est la définition d'une API ?"
              onChange={(e) => updateQuestion(qIndex, { question: e.target.value })}
            />
          </div>

          {/* Type de question */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-medium">Format :</span>
            <Select
              value={q.type}
              onValueChange={(val: any) => updateQuestion(qIndex, { 
                type: val, 
                correct_answers: val === "short_answer" ? "" : [0],
                options: val === "short_answer" ? undefined : ["Option 1", "Option 2"]
              })}
            >
              <SelectTrigger className="w-48 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple_choice">Choix unique (Radio)</SelectItem>
                <SelectItem value="multiple_select">Choix multiples (Checkbox)</SelectItem>
                <SelectItem value="short_answer">Réponse écrite courte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options de réponses */}
          {q.type !== "short_answer" && q.options && (
            <div className="space-y-2 pl-2">
              <span className="text-xs font-semibold text-gray-600">Options & Bonnes réponses :</span>
              {q.options.map((opt, optIndex) => {
                const isCorrect = Array.isArray(q.correct_answers) && q.correct_answers.includes(optIndex);
                return (
                  <div key={optIndex} className="flex items-center gap-2">
                    <input
                      type={q.type === "multiple_choice" ? "radio" : "checkbox"}
                      name={`q-${qIndex}-options`}
                      checked={isCorrect}
                      onChange={() => {
                        if (q.type === "multiple_choice") {
                          updateQuestion(qIndex, { correct_answers: [optIndex] });
                        } else {
                          const currentCorrect = Array.isArray(q.correct_answers) ? q.correct_answers : [];
                          const nextCorrect = currentCorrect.includes(optIndex)
                            ? currentCorrect.filter(i => i !== optIndex)
                            : [...currentCorrect, optIndex];
                          updateQuestion(qIndex, { correct_answers: nextCorrect });
                        }
                      }}
                      className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500"
                    />
                    <Input
                      value={opt}
                      className="h-8 text-sm flex-1"
                      placeholder={`Option ${optIndex + 1}`}
                      onChange={(e) => {
                        const nextOpts = [...(q.options || [])];
                        nextOpts[optIndex] = e.target.value;
                        updateQuestion(qIndex, { options: nextOpts });
                      }}
                    />
                    {(q.options?.length ?? 0) > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                        onClick={() => removeOption(qIndex, optIndex)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
              <Button
                variant="link"
                size="sm"
                onClick={() => addOption(qIndex)}
                className="text-xs p-0 h-auto text-orange-600"
              >
                + Ajouter une option
              </Button>
            </div>
          )}

          {/* Cas réponse courte textuelle */}
          {q.type === "short_answer" && (
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-600">Réponse attendue :</span>
              <Input
                value={typeof q.correct_answers === 'string' ? q.correct_answers : ""}
                placeholder="Mot-clé ou réponse exacte attendue..."
                onChange={(e) => updateQuestion(qIndex, { correct_answers: e.target.value })}
              />
            </div>
          )}

          {/* Explication technique */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Explication / Justification (optionnel) :</span>
            <Input
              value={q.explanation || ""}
              className="text-xs"
              placeholder="Pourquoi cette réponse est correcte..."
              onChange={(e) => updateQuestion(qIndex, { explanation: e.target.value })}
            />
          </div>
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={addQuestion} className="w-full border-dashed">
        <Plus className="h-4 w-4 mr-1" /> Ajouter une question
      </Button>
    </div>
  );
}


export function ContentEditor({
  lesson,
  module,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock
}: ContentEditorProps) {
  const [uploading, setUploading] = useState<string | null>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

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

 const handleAddBlock = (type: BlockType) => {
    if (!module?.id || !lesson?.id) return;

    let initialData: Partial<Block> = {
      type: type,
      order: lesson.blocks.length + 1,
      is_preview: false,
      is_hidden: false
    };
    
    switch (type) {
      case "paragraph":
        initialData = { ...initialData, content: "" };
        break;
      case "heading":
        initialData = { ...initialData, content: "", level: 2 };
        break;
      case "list":
        initialData = { ...initialData, content: "", list_type: "unordered" };
        break;
      case "quote":
        initialData = { ...initialData, content: "", author: "" };
        break;
      case "callout":
        initialData = { ...initialData, content: "", callout_type: "info" };
        break;
      case "divider":
        initialData = { ...initialData, style: "solid" };
        break;
      case "code":
        initialData = { 
          ...initialData,
          code_data: { 
            code: "// Écrivez votre code ici...", 
            language: "javascript" 
          }
        };
        break;
      case "video":
        initialData = { ...initialData, media_url: "", duration_seconds: 0, thumbnail_url: "" };
        break;
      case "audio":
        initialData = { ...initialData, media_url: "", duration_seconds: 0 };
        break;
      case "image":
        initialData = { ...initialData, media_url: "", alt_text: "", caption: "" };
        break;
      case "file":
        initialData = { ...initialData, file_url: "", file_name: "", file_size: 0, mime_type: "" };
        break;
      case "embed":
        initialData = { ...initialData, media_url: "", embed_type: "other" };
        break;
      case "quiz":
        initialData = {
          ...initialData,
          title: "Quiz d'évaluation",
          description: "",
          quiz_data: {
            questions: [
              {
                question: "Votre première question ?",
                type: "multiple_choice",
                options: ["Option A", "Option B"],
                correct_answers: [0],
                points: 1,
                explanation: ""
              }
            ],
            passing_score: 70,
            shuffle_questions: false,
            show_explanation_after_submit: true
          }
        };
        break;
    }

    onAddBlock(module.id, lesson.id, type, initialData);
  };

  const simulateFileUpload = async (file: File, blockIndex: number, type: 'video' | 'file'| 'image') => {
    setUploading(`${type}-${blockIndex}`);
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    const objectUrl = URL.createObjectURL(file);
    
    if (type === 'video') {
      onUpdateBlock(module.id, lesson.id, blockIndex, {
        media_url: objectUrl,
        file_name: file.name,
        file_size: file.size,
      })
    } else if(type === 'image'){
        onUpdateBlock(module.id, lesson.id, blockIndex, {
        media_url: objectUrl,
        alt_text: file.name
      });
    }else {
      onUpdateBlock(module.id, lesson.id, blockIndex, {
        file_url: objectUrl,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type
      });
    }
    
    setUploading(null);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, blockIndex: number, type: 'video' | 'file'|'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'video' && !ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      alert("Type de fichier vidéo non supporté. Utilisez MP4, WebM ou OGG.");
      return;
    }

    if (type === 'image' && !ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      alert("Type d'image non supporté.");
      return;
    }

    if (type === 'file') {
      const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
      const isOtherFile = ACCEPTED_FILE_TYPES.includes(file.type);
      
      if (!isImage && !isOtherFile) {
        alert("Type de fichier non supporté. Veuillez choisir une image, un PDF, un document Office, etc.");
        return;
      }
      simulateFileUpload(file, blockIndex, type);
    e.target.value = '';
    }

    simulateFileUpload(file, blockIndex, type);
        e.target.value = '';
  };

  const removeFile = (blockIndex: number, type: 'video' | 'file'| 'image') => {
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
  <header className=" bg-white/90 backdrop-blur-md  border-b">
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

    // Conteneur réutilisable avec bouton de suppression global pour l'éditeur
                const renderBlockWrapper = (label: string, icon: React.ReactNode, children: React.ReactNode) => (
                  <div key={index} className="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:border-orange-200 hover:shadow-xs">
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => onDeleteBlock && onDeleteBlock(module.id, lesson.id, index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 mb-3 tracking-wider uppercase">
                      {icon} {label}
                    </div>
                    {children}
                  </div>
                );

    switch (block.type) {
                  case "heading":
                    return renderBlockWrapper("Titre", blockIcons.heading, (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Importance :</span>
                          <Select
                            value={String(block.level || 2)}
                            onValueChange={(val) => onUpdateBlock(module.id, lesson.id, index, { level: parseInt(val) as any })}
                          >
                            <SelectTrigger className="w-24 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6].map(lvl => (
                                <SelectItem key={lvl} value={String(lvl)}>H{lvl}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          value={block.content}
                          placeholder="Saisissez le titre de votre section…"
                          className={cn(
                            "h-auto border-0 bg-transparent px-0 font-bold shadow-none focus-visible:ring-0 rounded-none border-b border-gray-100 focus:border-orange-400",
                            block.level === 1 ? "text-3xl" : block.level === 3 ? "text-xl" : "text-2xl"
                          )}
                          onChange={(e) => onUpdateBlock(module.id, lesson.id, index, { content: e.target.value })}
                        />
                      </div>
                    ));
                case "paragraph":
                    return renderBlockWrapper("Paragraphe", blockIcons.paragraph, (
                      <Textarea
                        value={block.content}
                        placeholder="Écrivez votre paragraphe de cours ici..."
                        className="border-none shadow-none focus-visible:ring-0 resize-y min-h-20 p-0 text-gray-800 leading-relaxed bg-transparent"
                        onChange={(e) => onUpdateBlock(module.id, lesson.id, index, { content: e.target.value })}
                      />
                    ));
                case "list":
                    return renderBlockWrapper("Liste", blockIcons.list, (
                      <div className="space-y-3">
                        <div className="flex gap-2 items-center">
                          <span className="text-xs text-muted-foreground">Format :</span>
                          <Select
                            value={block.list_type || "unordered"}
                            onValueChange={(val: string) => onUpdateBlock(module.id, lesson.id, index, { list_type: val })}
                          >
                            <SelectTrigger className="w-36 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unordered">• Puces</SelectItem>
                              <SelectItem value="ordered">1. Numérotée</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Textarea
                          value={block.content}
                          placeholder="Élément de liste 1&#10;Élément de liste 2&#10;(Un élément par ligne)"
                          className="font-mono text-sm border-gray-200 focus-visible:ring-orange-500"
                          rows={4}
                          onChange={(e) => onUpdateBlock(module.id, lesson.id, index, { content: e.target.value })}
                        />
                      </div>
                    ));

      case "quote":
                    return renderBlockWrapper("Citation", blockIcons.quote, (
                      <div className="pl-4 border-l-4 border-orange-500 bg-gray-50/50 p-2 rounded-r-lg space-y-2">
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
      case "code":
                    return renderBlockWrapper("Bloc de Code", blockIcons.code, (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Langage :</span>
                          <Select
                            value={block.code_data?.language || "javascript"}
                            onValueChange={(val) => onUpdateBlock(module.id, lesson.id, index, {
                              code_data: { ...(block.code_data || { code: "" }), language: val }
                            })}
                          >
                            <SelectTrigger className="w-36 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="javascript">JavaScript</SelectItem>
                              <SelectItem value="php">PHP</SelectItem>
                              <SelectItem value="python">Python</SelectItem>
                              <SelectItem value="html">HTML / CSS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Textarea
                          value={block.code_data?.code || ""}
                          placeholder="// Entrez votre code ou script d'exemple ici..."
                          className="font-mono text-xs bg-slate-900 text-slate-100 p-3 rounded-md min-h-[120px] focus-visible:ring-0"
                          onChange={(e) => onUpdateBlock(module.id, lesson.id, index, {
                            code_data: { ...(block.code_data || { language: "javascript" }), code: e.target.value }
                          })}
                        />
                      </div>
                    ));

      case "image":
                    return renderBlockWrapper("Image", blockIcons.image, (
                      <div className="space-y-3">
                        {block.media_url ? (
                          <div className="relative max-w-xs border rounded-lg overflow-hidden bg-gray-50">
                            <Image
                              src={block.media_url}
                              alt={block.alt_text || "Aperçu"}
                              width={320}
                              height={180}
                              className="object-contain max-h-44 w-full"
                            />
                            <Button
                              size="xs"
                              variant="destructive"
                              className="absolute top-1 right-1 h-6 px-2 text-[10px]"
                              onClick={() => onUpdateBlock(module.id, lesson.id, index, { media_url: "" })}
                            >
                              Enlever
                            </Button>
                          </div>
                        ) : (
                          <div className="border border-dashed rounded-lg p-4 text-center bg-gray-50/50">
                            <input
                              type="file"
                              accept="image/*"
                              id={`img-${index}`}
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, index, 'image')}
                            />
                            <Button size="sm" variant="outline" onClick={() => document.getElementById(`img-${index}`)?.click()}>
                              <Upload className="mr-2 h-3.5 w-3.5" /> Charger une image
                            </Button>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Légende de l'image (caption)..."
                            value={block.caption || ""}
                            className="h-8 text-xs"
                            onChange={(e) => onUpdateBlock(module.id, lesson.id, index, { caption: e.target.value })}
                          />
                          <Input
                            placeholder="Texte alternatif (Alt) pour accessibilité..."
                            value={block.alt_text || ""}
                            className="h-8 text-xs"
                            onChange={(e) => onUpdateBlock(module.id, lesson.id, index, { alt_text: e.target.value })}
                          />
                        </div>
                        {uploading === `image-${index}` && <p className="text-xs text-orange-500 animate-pulse">Chargement de l'image...</p>}
                      </div>
                    ));
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
        
      case "audio":
                    return renderBlockWrapper("Audio", blockIcons.audio, (
                      <div className="space-y-2">
                        {block.media_url ? (
                          <div className="flex items-center gap-2">
                            <audio src={block.media_url} controls className="flex-1" />
                            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => onUpdateBlock(module.id, lesson.id, index, { media_url: "" })}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="border border-dashed rounded-lg p-4 text-center bg-gray-50/50">
                            <input
                              type="file"
                              accept="audio/*"
                              id={`audio-${index}`}
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, index, 'file')}
                            />
                            <Button size="sm" variant="outline" onClick={() => document.getElementById(`audio-${index}`)?.click()}>
                              <Upload className="mr-2 h-3.5 w-3.5" /> Sélectionner un audio
                            </Button>
                          </div>
                        )}
                      </div>
                    ));
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
                    return renderBlockWrapper("Intégration Externe", blockIcons.embed, (
                      <div className="space-y-3">
                        <div className="flex gap-2 items-center">
                          <span className="text-xs text-muted-foreground">Source :</span>
                          <Select
                            value={block.embed_type || "other"}
                            onValueChange={(val: any) => onUpdateBlock(module.id, lesson.id, index, { embed_type: val })}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="youtube">YouTube</SelectItem>
                              <SelectItem value="vimeo">Vimeo</SelectItem>
                              <SelectItem value="figma">Figma</SelectItem>
                              <SelectItem value="other">Autre (Iframe)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-medium text-gray-500">Titre de l'exercice :</label>
                            <Input
                              value={block.title || ""}
                              placeholder="Ex: Évaluation sommative - Chapitre 1"
                              className="font-semibold text-sm"
                              onChange={(e) => onUpdateBlock(module.id, lesson.id, index, { title: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-medium text-gray-500">Description / Directives :</label>
                            <Input
                              value={block.description || ""}
                              placeholder="Ex: Répondez correctement aux questions pour valider ce module."
                              className="text-xs text-muted-foreground"
                              onChange={(e) => onUpdateBlock(module.id, lesson.id, index, { description: e.target.value })}
                            />
                          </div>
                        </div>

                        {/* Rendu de l'éditeur avancé de questions */}
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
                          <Select
                            value={block.style || "solid"}
                            onValueChange={(val: any) => onUpdateBlock(module.id, lesson.id, index, { style: val })}
                          >
                            <SelectTrigger className="w-28 h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="solid">Trait plein</SelectItem>
                              <SelectItem value="dashed">Tirets</SelectItem>
                              <SelectItem value="dotted">Pointillés</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ));
case "callout":
                    return renderBlockWrapper("Encart d'Information", blockIcons.callout, (
                      <div className={cn(
                        "p-4 rounded-lg border-l-4 shadow-2xs",
                        block.callout_type === "note" && "bg-blue-50/60 border-blue-500 text-blue-900",
                        block.callout_type === "tip" && "bg-green-50/60 border-green-500 text-green-900",
                        block.callout_type === "warning" && "bg-yellow-50/60 border-yellow-500 text-yellow-900",
                        block.callout_type === "danger" && "bg-red-50/60 border-red-500 text-red-900",
                        block.callout_type === "info" && "bg-sky-50/40 border-sky-400 text-sky-950"
                      )}>
                        <div className="flex gap-3 items-start">
                          <Select
                            value={block.callout_type || "info"}
                            onValueChange={(val: any) => onUpdateBlock(module.id, lesson.id, index, { callout_type: val })}
                          >
                            <SelectTrigger className="w-28 h-8 text-xs bg-white text-gray-800">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="note">📘 Note</SelectItem>
                              <SelectItem value="tip">💡 Astuce</SelectItem>
                              <SelectItem value="warning">⚠️ Warning</SelectItem>
                              <SelectItem value="danger">🚨 Danger</SelectItem>
                              <SelectItem value="info">ℹ️ Info</SelectItem>
                            </SelectContent>
                          </Select>
                          <Textarea
                            value={block.content}
                            placeholder="Saisissez une remarque ou consigne importante..."
                            className="flex-1 border-none shadow-none focus-visible:ring-0 resize-none bg-transparent p-0 min-h-[50px] font-medium placeholder:font-normal"
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

    {/* Sidebar */}
    {/* Sidebar latérale : Liste des Blocs insérables */}
        <aside className="w-64 shrink-0 border-l bg-white overflow-y-auto shadow-sm">
          <div className="p-4">
            <h4 className="font-semibold text-xs tracking-wider uppercase mb-3 text-gray-500">Composants de cours</h4>
            <div className="flex flex-col gap-1">
              {Object.entries(blockLabels).map(([type, label]) => (
                <Button
                  key={type}
                  variant="ghost"
                  className="w-full justify-start gap-3 hover:bg-orange-50 hover:text-orange-700 text-gray-700 transition-colors duration-200 rounded-lg py-2 h-9"
                  onClick={() => handleAddBlock(type as BlockType)}
                >
                  <span className="text-orange-500">
                    {blockIcons[type as BlockType]}
                  </span>
                  <span className="text-xs font-medium">{label}</span>
                </Button>
              ))}
            </div>
          </div>
        </aside>
  </div>
</div>


  );
}