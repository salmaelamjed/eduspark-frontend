"use client"
import { QuizBlock , QuizQuestion} from "@/types/block";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";

interface QuizEditorProps {
  block: QuizBlock;
  onUpdate: (updates: Partial<QuizBlock>) => void;
}

export function QuizEditor({ block, onUpdate }: QuizEditorProps) {
const quizData = block.quiz_data || { questions: [],
   settings: {  title: "",
                description: "",
                passing_score_percent: 70 
              } 
              };

  const updateQuestion = (qIndex: number, updatedQuestion: Partial<QuizQuestion>) => {
    const newQuestions = [...quizData.questions];
    newQuestions[qIndex] = { ...newQuestions[qIndex], ...updatedQuestion } as QuizQuestion;
    onUpdate({
      quiz_data: { ...quizData, questions: newQuestions }
    });
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      question_text: "",
      type: "single",
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
    if (q.options.length <= 2) return;
    
    const newOptions = q.options.filter((_, i) => i !== optIndex);
    let newCorrect = q.correct_answers
      .map((v) => (v > optIndex ? v - 1 : v))
      .filter((v) => v !== optIndex && v >= 0 && v < newOptions.length);
    if (newCorrect.length === 0) newCorrect = [0];

    updateQuestion(qIndex, { options: newOptions, correct_answers: newCorrect });
  };
  return (
    <div className="space-y-6 mt-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">

         {/* Titre et Description du Quiz */}
      <div className="space-y-3 p-4 bg-white rounded-lg border">
        <h4 className="text-sm font-semibold text-gray-700">Informations générales</h4>
        
        <div>
          <label className="text-xs font-medium text-gray-600">Titre du quiz</label>
          <Input
            value={quizData.settings.title || block.title || ""}
            placeholder="Ex: Évaluation du module 1"
            className="text-sm"
            onChange={(e) => {
              const newTitle = e.target.value;
              onUpdate({
                title: newTitle,
                quiz_data: {
                  ...quizData,
                  settings: {
                    ...quizData.settings,
                    title: newTitle
                  }
                }
              });
            }}
          />
        </div>
        
        <div>
          <label className="text-xs font-medium text-gray-600">Description du quiz</label>
          <Textarea
            value={quizData.settings.description || block.description || ""}
            placeholder="Ex: Ce quiz évalue vos connaissances sur les concepts fondamentaux..."
            className="text-sm resize-none min-h-15"
            onChange={(e) => {
              const newDescription = e.target.value;
              onUpdate({
                description: newDescription,
                quiz_data: {
                  ...quizData,
                  settings: {
                    ...quizData.settings,
                    description: newDescription
                  }
                }
              });
            }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
      <h4 className="text-sm font-semibold text-gray-700">Configuration des Questions</h4>         
       <div className="flex items-center gap-4 text-xs">

          <label className="flex items-center gap-1 font-medium">
            Score requis (%) :
            <Input
              type="number"
              className="w-16 h-7 text-xs px-1"
              value={quizData.settings.passing_score_percent ?? 70}
              onChange={(e) =>
                onUpdate({
                  quiz_data: {
                    ...quizData,
                    settings: {
                      ...quizData.settings,
                      passing_score_percent: parseInt(e.target.value) || 0,
                    },
                  },
                })
              }
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
              value={q.question_text}
              placeholder="Ex : Quelle est la définition d'une API ?"
              onChange={(e) => updateQuestion(qIndex, { question_text: e.target.value })}
            />
          </div>

          {/* Type de question */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-medium">Format :</span>
            <Select
              value={q.type}
              onValueChange={(val: QuizQuestion["type"]) => updateQuestion(qIndex, { 
                type: val, 
                 // 1 seule bonne réponse forcée en mode "single"
                correct_answers: val === "single" ? [q.correct_answers[0] ?? 0] : q.correct_answers,
              })}
            >
              <SelectTrigger className="w-48 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Choix unique (Radio)</SelectItem>
                <SelectItem value="multiple">Choix multiples (Checkbox)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options de réponses */}
           <div className="space-y-2 pl-2">
            <span className="text-xs font-semibold text-gray-600">Options & Bonnes réponses :</span>
            {q.options.map((opt, optIndex) => {
              const isCorrect = q.correct_answers.includes(optIndex);
              return (
                <div key={optIndex} className="flex items-center gap-2">
                  <input
                    type={q.type === "single" ? "radio" : "checkbox"}
                    name={`q-${qIndex}-options`}
                    checked={isCorrect}
                    onChange={() => {
                      if (q.type === "single") {
                        updateQuestion(qIndex, { correct_answers: [optIndex] });
                      } else {
                        const next = q.correct_answers.includes(optIndex)
                          ? q.correct_answers.filter((i) => i !== optIndex)
                          : [...q.correct_answers, optIndex];
                        updateQuestion(qIndex, { correct_answers: next });
                      }
                    }}
                    className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <Input
                    value={opt}
                    className="h-8 text-sm flex-1"
                    placeholder={`Option ${optIndex + 1}`}
                    onChange={(e) => {
                      const nextOpts = [...q.options];
                      nextOpts[optIndex] = e.target.value;
                      updateQuestion(qIndex, { options: nextOpts });
                    }}
                  />
                  {q.options.length > 2 && (
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


          {/* Explication technique */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Explication / Justification (optionnel) :</span>
            <Textarea
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
