'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useCourseDetail, useCourseDetailBySlug } from '@/hooks/courses/use-course';
import { findQuizByNumber } from '@/lib/quiz-numbering';
import { CheckCircle2, XCircle, ArrowLeft, Trophy, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  question_text: string;
  type: 'single' | 'multiple';
  options: QuizOption[];
}

interface QuizResult {
  score_percent: number;
  passed: boolean;
  correct_count: number;
  total: number;
}

const QuizPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const courseSlug = params.courseSlug as string;
  const quizNumber = searchParams.get('quiz');

  const { course, loading: courseLoading, error: courseError } = useCourseDetailBySlug(courseSlug);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const quizLocation = useMemo(
    () => findQuizByNumber(course, quizNumber),
    [course, quizNumber]
  );

  const questions: QuizQuestion[] = quizLocation?.block.quiz_data?.questions ?? [];
  const passingScore = quizLocation?.block.quiz_data?.settings?.passing_score_percent;
  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id]);

  const handleSelect = (questionId: string, optionId: string) => {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!quizLocation) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/proxy/blocks/${quizLocation.block.id}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) throw new Error('Échec de la soumission');

      const data: QuizResult = await res.json();
      setResult(data);
    } catch (err) {
      setSubmitError("Impossible d'envoyer vos réponses. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
    setSubmitError(null);
  };

  if (courseLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
      </div>
    );
  }

  if (courseError || !course) {
    return <div className="p-8 text-center text-gray-500">Cours introuvable.</div>;
  }

  if (!quizLocation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-center px-4">
        <XCircle className="w-10 h-10 text-gray-300" />
        <p className="font-medium text-gray-700">Quiz introuvable</p>
        <Link href={`/courses/${courseSlug}`} className="text-sm text-orange-600 hover:underline">
          Retour au cours
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au cours
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
            Quiz {quizNumber}
          </span>
          {typeof passingScore === 'number' && (
            <span className="text-xs text-gray-500">
              Seuil de réussite : {passingScore}%
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {quizLocation.block.content || `Quiz — ${quizLocation.lessonTitle}`}
        </h1>
      </div>

      {result && (
        <div
          className={`mb-8 p-5 rounded-2xl border flex items-center gap-4 ${
            result.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              result.passed ? 'bg-emerald-600' : 'bg-rose-600'
            }`}
          >
            {result.passed ? <Trophy className="w-6 h-6 text-white" /> : <XCircle className="w-6 h-6 text-white" />}
          </div>
          <div className="flex-1">
            <p className={`font-bold ${result.passed ? 'text-emerald-900' : 'text-rose-900'}`}>
              {result.passed ? 'Quiz réussi !' : 'Quiz non validé'}
            </p>
            <p className="text-sm text-gray-600">
              {result.correct_count}/{result.total} bonnes réponses ({result.score_percent}%)
            </p>
          </div>
          {!result.passed && (
            <button onClick={handleRetry} className="text-sm font-semibold text-orange-600 hover:underline shrink-0">
              Réessayer
            </button>
          )}
        </div>
      )}

      <div className="space-y-6">
        {questions.map((question, idx) => (
          <div key={question.id} className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
            <p className="font-semibold text-gray-900 mb-4">
              {idx + 1}. {question.question_text}
            </p>
            <div className="space-y-2">
              {question.options.map((option) => {
                const isSelected = answers[question.id] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(question.id, option.id)}
                    disabled={!!result}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 text-orange-900'
                        : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/40 text-gray-700'
                    } ${result ? 'cursor-default opacity-90' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-orange-500' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                    </span>
                    {option.text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!result && (
        <div className="mt-8">
          {submitError && <p className="text-sm text-rose-600 mb-3">{submitError}</p>}
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              'Valider mes réponses'
            )}
          </button>
          {!allAnswered && (
            <p className="text-xs text-gray-400 text-center mt-2">
              Répondez à toutes les questions pour valider.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;