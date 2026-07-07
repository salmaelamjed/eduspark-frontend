'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useCourseDetailBySlug } from '@/hooks/courses/use-course';
import { useSubmitQuiz } from '@/hooks/quiz/use-submit-quiz';
import { findQuizByNumber } from '@/lib/quiz-numbering';
import type { QuizQuestionResult } from '@/types/quiz';
import { XCircle, ArrowLeft, Trophy, Loader2, Check } from 'lucide-react';
import Link from 'next/link';

type OptionLike = string | { id?: string; text: string };

function getOptionText(option: OptionLike): string {
  return typeof option === 'string' ? option : option.text;
}
function getOptionKey(option: OptionLike, index: number): string | number {
  return typeof option === 'string' ? index : (option.id ?? index);
}
function getOptionId(option: OptionLike, index: number): string {
  return typeof option === 'string' ? String(index) : (option.id ?? String(index));
}

interface QuizResult {
  score_percent: number;
  passed: boolean;
  correct_count: number;
  total: number;
}

type AnswerValue = number[];

const QuizPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const courseSlug = params.courseSlug as string;
  const quizNumber = searchParams.get('quiz');

  const { course, loading: courseLoading, error: courseError } = useCourseDetailBySlug(courseSlug);

  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [questionResults, setQuestionResults] = useState<QuizQuestionResult[] | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const quizLocation = useMemo(
    () => findQuizByNumber(course, quizNumber),
    [course, quizNumber]
  );

  const questions = quizLocation?.block.quiz_data?.questions ?? [];
  const passingScore = quizLocation?.block.quiz_data?.settings?.passing_score_percent;

  const pointsPerQuestion = questions.length > 0 ? (passingScore ?? 0) / questions.length : 0;
  const formattedPoints = Number.isInteger(pointsPerQuestion)
    ? pointsPerQuestion
    : pointsPerQuestion.toFixed(2);

  const allAnswered = questions.length > 0 && questions.every((_, idx) => {
    const answer = answers[idx];
    return answer && answer.length > 0;
  });

  const { submitQuiz, isSubmitting: submitting } = useSubmitQuiz({
    onSuccess: (data) => {
      setResult({
        score_percent: data.attempt.score_percentage,
        passed: data.attempt.is_passed,
        correct_count: data.attempt.correct_answers,
        total: data.attempt.total_questions,
      });
      setQuestionResults(data.results);
    },
    onError: () => {
      setSubmitError("Impossible d'envoyer vos réponses. Réessayez.");
    },
  });

  const handleToggleOption = (questionIdx: number, optionIdx: number) => {
    if (result) return;
    setAnswers((prev) => {
      const current = prev[questionIdx] || [];
      const next = current.includes(optionIdx)
        ? current.filter((i) => i !== optionIdx)
        : [...current, optionIdx];
      return { ...prev, [questionIdx]: next };
    });
  };

  const handleSubmit = async () => {
    if (!quizLocation?.block.id || !course?.id) return;
    setSubmitError(null);

    const payloadAnswers = questions.map((question, qIdx) => {
      const selectedIndexes = answers[qIdx] || [];
      const selectedOptions = selectedIndexes.map((oIdx) =>
        getOptionId(question.options[oIdx], oIdx)
      );

      return {
        question_id: question.id ?? `q_${qIdx}`,
        selected_options: selectedOptions,
      };
    });

    try {
      await submitQuiz({
        courseId: course.id,
        lessonId: quizLocation.lessonId,
        blockId: quizLocation.block.id,
        payload: { answers: payloadAnswers },
      });
    } catch {
      // déjà géré via onError
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
    setQuestionResults(null);
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
          {quizLocation.block.title || `Quiz — ${quizLocation.lessonTitle}`}
        </h1>
        {quizLocation.block.description && (
          <p className="text-sm text-gray-500 mt-1">{quizLocation.block.description}</p>
        )}
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
        {questions.map((question, qIdx) => {
          const selected = answers[qIdx] || [];
          const qResult =
            questionResults?.find((r) => r.id === question.id) ?? questionResults?.[qIdx];
          const isCorrected = !!result && !!qResult;

          return (
            <div key={qIdx} className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-4">
                <p className="font-semibold text-gray-900">
                  {qIdx + 1}. {question.question_text}
                  <span className="ml-2 text-xs items-end font-normal text-gray-400">
                    ({formattedPoints}pts)
                  </span>
                </p>
                {isCorrected && (
                  <span
                    className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      qResult.is_correct
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {qResult.is_correct ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {qResult.is_correct ? 'Correct' : 'Incorrect'}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {question.options.map((option, oIdx) => {
                  const optionText = getOptionText(option);
                  const optionId = getOptionId(option, oIdx);
                  const isSelected = selected.includes(oIdx);

                  // Est-ce que cette option fait partie des bonnes réponses ?
                  // (nécessite que le backend renvoie correct_options)
                  const isCorrectOption =
                    isCorrected && qResult.correct_options?.includes(optionId) === true;

                  let optionClass: string;
                  let boxClass: string;

                  if (isCorrected) {
                    if (isSelected && isCorrectOption) {
                      // Cochée + bonne réponse → vert
                      optionClass = 'border-emerald-500 bg-emerald-50 text-emerald-900';
                      boxClass = 'border-emerald-500 bg-emerald-500';
                    } else if (isSelected && !isCorrectOption) {
                      // Cochée + mauvaise réponse → rouge
                      optionClass = 'border-rose-500 bg-rose-50 text-rose-900';
                      boxClass = 'border-rose-500 bg-rose-500';
                    } else if (!isSelected && isCorrectOption) {
                      // Pas cochée mais c'était la bonne réponse → vert (même si l'utilisateur s'est trompé)
                      optionClass = 'border-emerald-400 bg-emerald-50/60 text-emerald-800';
                      boxClass = 'border-emerald-400 bg-white';
                    } else {
                      // Ni cochée ni correcte → neutre
                      optionClass = 'border-gray-200 text-gray-400';
                      boxClass = 'border-gray-300 bg-white';
                    }
                  } else if (isSelected) {
                    optionClass = 'border-orange-500 bg-orange-50 text-orange-900';
                    boxClass = 'border-orange-500 bg-orange-500';
                  } else {
                    optionClass = 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/40 text-gray-700';
                    boxClass = 'border-gray-300 bg-white';
                  }

                  return (
                    <button
                      key={getOptionKey(option, oIdx)}
                      onClick={() => handleToggleOption(qIdx, oIdx)}
                      disabled={!!result}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 ${optionClass} ${
                        result ? 'cursor-default opacity-90' : 'cursor-pointer'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 shrink-0 flex items-center justify-center rounded-md border-2 transition-all ${boxClass}`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        {isCorrected && !isSelected && isCorrectOption && (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                      </div>
                      {optionText}
                    </button>
                  );
                })}
              </div>

              {!isCorrected && selected.length > 0 && (
                <div className="mt-3 text-xs text-gray-400">
                  {selected.length} option{selected.length > 1 ? 's' : ''} sélectionnée{selected.length > 1 ? 's' : ''}
                </div>
              )}

              {/* Explication après correction — toujours en vert, même si la question est incorrecte */}
              {isCorrected && qResult.explanation && (
                <div className="mt-3 p-3 rounded-lg text-xs border bg-emerald-50 border-emerald-100 text-emerald-800">
                  <span className="font-semibold">Explication : </span>
                  {qResult.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!result && (
        <div className="mt-8">
          {submitError && <p className="text-sm text-rose-600 mb-3">{submitError}</p>}
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 hover:cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all"
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
              Sélectionnez au moins une option pour chaque question avant de valider.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;