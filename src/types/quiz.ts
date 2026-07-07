// ----- Payload envoyé par le front -----
export interface SubmitQuizAnswer {
  question_id: string;
  selected_options: string[];
}

export interface SubmitQuizPayload {
  answers: SubmitQuizAnswer[];
}

// ----- Réponse du serveur -----
export interface QuizAttemptSummary {
  id: number;
  score: number;
  score_percentage: number;
  points_per_question: number;
  correct_answers: number;
  total_questions: number;
  is_passed: boolean;
  passing_score_percent: number;
  attempt_number: number;
  max_attempts: number | null;
  completed_at: string; // "YYYY-MM-DD HH:mm:ss"
}

export interface QuizQuestionResult {
  id: string;
  question_text: string;
  type: "single" | "multiple";
  selected_options: string[];
  is_correct: boolean;
  points_earned: number;
  points_possible: number;
  correct_options?: string[]; // présent seulement si show_correct_answers_after_submit
  explanation?: string | null; // présent seulement si show_explanation_after_submit
}

export interface QuizSubmitSettings {
  show_explanation_after_submit: boolean;
  show_correct_answers_after_submit: boolean;
}

export interface QuizSubmitResponse {
  success: boolean;
  message: string;
  attempt: QuizAttemptSummary;
  results: QuizQuestionResult[];
  settings: QuizSubmitSettings;
}

// ----- Réponses d'erreur possibles -----
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>; // 422 validation
  max_attempts?: number; // 403 tentatives épuisées
  attempts_made?: number;
}
