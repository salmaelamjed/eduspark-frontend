import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatMode, ChatRoom } from "@/types/chat";
import { chatApi } from "@/api/chat";
import { useAuth } from "@/context/auth-context";

interface UseChatOptions {
  courseId: number;
  lessonId?: number;
  humanPollingInterval?: number;
}

interface UseChatReturn {
  room: ChatRoom | null;
  messages: ChatMessage[];
  mode: ChatMode | null;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  unreadSnapshot: number;
  sendMessage: (content: string) => Promise<void>;
  retryMessage: (tempId: number) => Promise<void>;
  switchToHuman: () => Promise<void>;
  switchToAi: () => Promise<void>;
}

export function useChat({
  courseId,
  lessonId,
  humanPollingInterval = 4000,
}: UseChatOptions): UseChatReturn {
  const { token } = useAuth();

  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadSnapshot, setUnreadSnapshot] = useState(0);

  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const syncedLessonIdRef = useRef<number | undefined>(undefined);

  const clearPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const markRead = useCallback(
    (id: number) => {
      if (!token) return;
      chatApi.markAsRead(id, token).catch(() => {});
    },
    [token],
  );

  const refreshMessages = useCallback(
    async (roomId: number) => {
      if (!token) return;
      try {
        const res = await chatApi.getMessages(roomId, token);
        setMessages(res.data);
        markRead(roomId);
      } catch {
        // erreur de polling silencieuse : on retentera au prochain tick
      }
    },
    [token, markRead],
  );

  const startHumanPolling = useCallback(
    (roomId: number) => {
      clearPolling();
      pollTimerRef.current = setInterval(() => {
        refreshMessages(roomId);
      }, humanPollingInterval);
    },
    [clearPolling, refreshMessages, humanPollingInterval],
  );

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setError("Vous devez être connecté pour utiliser l'assistant.");
      return;
    }

    let cancelled = false;

    async function init() {
      setIsLoading(true);
      setError(null);

      try {
        const roomRes = await chatApi.createRoom(courseId, token!, lessonId);
        if (cancelled) return;

        const createdRoom = roomRes.data;
        setRoom(createdRoom);
        syncedLessonIdRef.current = lessonId;

        setUnreadSnapshot(createdRoom.unread_count ?? 0);

        const historyRes = await chatApi.getMessages(createdRoom.id, token!);
        if (cancelled) return;

        setMessages(historyRes.data);
        markRead(createdRoom.id);
        if (createdRoom.mode === "human") {
          startHumanPolling(createdRoom.id);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Erreur chat init:", err);
          setError(
            "Impossible de charger la conversation. Réessaie dans un instant.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    init();

    return () => {
      cancelled = true;
      clearPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, token]);

  useEffect(() => {
    if (!room || !token) return;
    if (lessonId === syncedLessonIdRef.current) return; // déjà synchronisé, rien à faire

    let cancelled = false;

    async function syncLesson() {
      try {
        const roomRes = await chatApi.createRoom(courseId, token!, lessonId);
        if (cancelled) return;

        setRoom(roomRes.data);
        syncedLessonIdRef.current = lessonId;
      } catch {
        // Échec silencieux : le contexte de leçon ne sera pas à jour pour le prochain
        // message IA, mais l'UX du chat n'est pas interrompue pour autant.
      }
    }

    syncLesson();

    return () => {
      cancelled = true;
    };
  }, [lessonId, room, token, courseId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!room || !token || !content.trim()) return;

      setError(null);

      const tempId = -Date.now();
      const tempUserMessage: ChatMessage = {
        id: tempId,
        chat_room_id: room.id,
        sender_type: "student",
        sender_id: room.student.id,
        sender_name: room.student.name,
        content: content.trim(),
        created_at: new Date().toISOString(),
        status: "pending",
      };

       setMessages((prev) => [...prev, tempUserMessage]);

       setIsSending(true);

       const shouldResumePolling =
         room.mode === "human" && pollTimerRef.current !== null;
       clearPolling();

      try {
        const res = await chatApi.sendMessage(room.id, content.trim(), token);
        const result = res.data;

        setMessages((prev) => {
          const withoutTemp = prev.filter(
            (msg) => msg.id !== tempUserMessage.id,
          );
          const newMessages: ChatMessage[] = [
            { ...result.user_message, status: "sent" },
          ];
          if (result.ai_message) newMessages.push(result.ai_message);
          return [...withoutTemp, ...newMessages];
        });
      } catch {
        // On NE retire PAS le message : on le marque "failed" (icône rouge, comme WhatsApp)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "failed" } : msg,
        ),
      );
      setError("Le message n'a pas pu être envoyé. Réessaie.");
        setError("Le message n'a pas pu être envoyé. Réessaie.");
      } finally {
         setIsSending(false);
         if (shouldResumePolling) {
           startHumanPolling(room.id);
         }
      }
    },
    [room, token, , clearPolling, startHumanPolling],
  );

  const retryMessage = useCallback(
    async (tempId: number) => {
      const failed = messages.find((m) => m.id === tempId);
      if (!failed) return;
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      await sendMessage(failed.content);
    },
    [messages, sendMessage],
  );

  const switchToHuman = useCallback(async () => {
    if (!room || !token) return;

    try {
      const res = await chatApi.switchToHuman(room.id, token);
      const updatedRoom = res.data;
      setRoom(updatedRoom);
      await refreshMessages(updatedRoom.id);
      startHumanPolling(updatedRoom.id);
    } catch {
      setError("Impossible de basculer vers un enseignant pour le moment.");
    }
  }, [room, token, refreshMessages, startHumanPolling]);

  const switchToAi = useCallback(async () => {
    if (!room || !token) return;

    try {
      const res = await chatApi.switchToAi(room.id, token);
      const updatedRoom = res.data;
      setRoom(updatedRoom);
      clearPolling();
      await refreshMessages(updatedRoom.id);
    } catch {
      setError("Impossible de repasser en mode assistant IA.");
    }
  }, [room, token, refreshMessages, clearPolling]);

  return {
    room,
    messages,
    mode: room?.mode ?? null,
    isLoading,
    isSending,
    error,
    unreadSnapshot,
    sendMessage,
    switchToHuman,
    switchToAi,
    retryMessage,
  };
}
