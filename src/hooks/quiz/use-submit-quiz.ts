import { useState, useCallback } from "react";
import { SubmitQuizPayload, QuizSubmitResponse } from "@/types/quiz";
import { useAuth } from "@/context/auth-context";
import { quizApi } from "@/api/quiz";
import { toast } from "sonner";
import { getErrorMessage } from "@/components/ErrorMessage";

interface SubmitQuizParams {
  courseId: number | string;
  lessonId: number | string;
  blockId: number | string;
  payload: SubmitQuizPayload;
}

interface UseSubmitQuizOptions {
  onSuccess?: (data: QuizSubmitResponse) => void;
  onError?: (error: Error) => void;
}

export function useSubmitQuiz(options?: UseSubmitQuizOptions) {
  const { token } = useAuth();

  const [data, setData] = useState<QuizSubmitResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitQuiz = useCallback(
    async ({ courseId, lessonId, blockId, payload }: SubmitQuizParams) => {
      setIsSubmitting(true);
      setError(null);
      setIsSuccess(false);

      try {
        const result = await quizApi.submit(
          courseId,
          lessonId,
          blockId,
          payload,
          token,
        );

        setData(result);
        setIsSuccess(true);
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        toast.error(getErrorMessage(error, "Erreur lors de la création"));
      } finally {
        setIsSubmitting(false);
      }
    },
    [token, options],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsSuccess(false);
    setIsSubmitting(false);
  }, []);

  return {
    submitQuiz,
    isSubmitting,
    isSuccess,
    isError: !!error,
    error,
    data,
    reset,
  };
}
