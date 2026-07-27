import { apiClient } from "@/lib/client";
import type {
  ApiEnvelope,
  ChatMessage,
  ChatRoom,
  SendMessageResult,
} from "@/types/chat";

const BASE = "/rooms";

export const chatApi = {
  /**
   * Liste les rooms actives de l'utilisateur connecté
   */
  listRooms: (token: string) =>
    apiClient.get<ApiEnvelope<ChatRoom[]>>(BASE, token),

  /**
   * Crée ou récupère la room active pour un cours (et une leçon optionnelle).
   */
  createRoom: (courseId: number, token: string, lessonId?: number) =>
    apiClient.post<ApiEnvelope<ChatRoom>>(
      BASE,
      { course_id: courseId, lesson_id: lessonId ?? null },
      token,
    ),

  /**
   * Récupère l'historique complet des messages d'une room.
   */
  getMessages: (roomId: number, token: string) =>
    apiClient.get<ApiEnvelope<ChatMessage[]>>(
      `${BASE}/${roomId}/messages`,
      token,
    ),

  /**
   * Envoie un message. En mode "ai", ai_message contient la réponse générée.
   */
  sendMessage: (roomId: number, content: string, token: string) =>
    apiClient.post<ApiEnvelope<SendMessageResult>>(
      `${BASE}/${roomId}/messages`,
      { content },
      token,
    ),

  switchToHuman: (roomId: number, token: string) =>
    apiClient.post<ApiEnvelope<ChatRoom>>(
      `${BASE}/${roomId}/switch-to-human`,
      {},
      token,
    ),

  switchToAi: (roomId: number, token: string) =>
    apiClient.post<ApiEnvelope<ChatRoom>>(
      `${BASE}/${roomId}/switch-to-ai`,
      {},
      token,
    ),

  markAsRead: (roomId: number, token: string) =>
    apiClient.post<ApiEnvelope<ChatRoom>>(`${BASE}/${roomId}/read`, {}, token),
};
