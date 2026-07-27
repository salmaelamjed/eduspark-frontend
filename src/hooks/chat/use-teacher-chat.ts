import { useCallback, useEffect, useRef, useState } from "react";
import { chatApi } from "@/api/chat";
import { useAuth } from "@/context/auth-context";
import type { ChatMessage } from "@/types/chat";

interface UseTeacherChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
}

export function useTeacherChat(
  roomId: number | null,
  pollingInterval = 4000,
): UseTeacherChatReturn {
  const { token, user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const markRead = useCallback(
    (id: number) => {
      if (!token) return;
      // fire-and-forget : pas besoin de bloquer l'UI dessus
      chatApi.markAsRead(id, token).catch(() => {});
    },
    [token],
  );
  const fetchMessages = useCallback(
    async (id: number) => {
      if (!token) return;
      try {
        const res = await chatApi.getMessages(id, token);
        setMessages(res.data);
        markRead(id);
      } catch {
        // erreur de polling silencieuse : on retentera au prochain tick
      }
    },
    [token, markRead],
  );

  useEffect(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }

    if (!roomId || !token) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function init() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await chatApi.getMessages(roomId!, token!);
        if (!cancelled) {
          setMessages(res.data);
          markRead(roomId!);
        }
      } catch {
        if (!cancelled) setError("Impossible de charger cette conversation.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    init();
    pollTimerRef.current = setInterval(
      () => fetchMessages(roomId),
      pollingInterval,
    );

    return () => {
      cancelled = true;
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [roomId, token, fetchMessages, pollingInterval, markRead]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!roomId || !token || !content.trim()) return;

      setIsSending(true);
      setError(null);

      const tempMessage: ChatMessage = {
        id: Date.now(),
        chat_room_id: roomId,
        sender_type: "teacher",
        sender_id: user?.id ?? null,
        sender_name: user?.name ?? "Vous",
        content: content.trim(),
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, tempMessage]);

      try {
        const res = await chatApi.sendMessage(roomId, content.trim(), token);

        setMessages((prev) => {
          const withoutTemp = prev.filter((m) => m.id !== tempMessage.id);
          // ai_message reste toujours null en mode human, rien à ajouter en plus
          return [...withoutTemp, res.data.user_message];
        });
      } catch {
        setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
        setError("Le message n'a pas pu être envoyé.");
      } finally {
        setIsSending(false);
      }
    },
    [roomId, token, user],
  );

  return { messages, isLoading, isSending, error, sendMessage };
}
