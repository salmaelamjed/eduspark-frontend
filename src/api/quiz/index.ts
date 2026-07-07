import { apiClient } from "@/lib/client";
import { SubmitQuizPayload, QuizSubmitResponse } from "@/types/quiz";

export const quizApi = {
  submit: (
    courseId: number | string,
    lessonId: number | string,
    blockId: number | string,
    data: SubmitQuizPayload,
    token?: string,
  ) =>
    apiClient.post<QuizSubmitResponse>(
      `/courses/${courseId}/lessons/${lessonId}/blocks/${blockId}/quiz/submit`,
      data,
      token,
    ),
};
