// src/hooks/useNotifications.ts

import { useCallback, useEffect, useRef, useState } from "react";
import { notificationApi } from "@/api/notifications";
import type { AppNotification } from "@/types/notification";
import { useAuth } from "@/context/auth-context";

interface UseNotificationsOptions {
  readonly pollingIntervalMs?: number;
}

interface UseNotificationsResult {
  readonly notifications: readonly AppNotification[];
  readonly unreadCount: number;
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly markAsRead: (id: AppNotification["id"]) => Promise<void>;
  readonly markAllAsRead: () => Promise<void>;
  readonly remove: (id: AppNotification["id"]) => Promise<void>;
  readonly refresh: () => Promise<void>;
}

const DEFAULT_POLLING_INTERVAL_MS = 30_000;

export function useNotifications({
  pollingIntervalMs = DEFAULT_POLLING_INTERVAL_MS,
}: UseNotificationsOptions = {}): UseNotificationsResult {
  const [notifications, setNotifications] = useState<
    readonly AppNotification[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { token } = useAuth();
  // Évite de setState sur un composant démonté (ex: navigation rapide)
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    if (!token) return;

    try {
      const [listResponse, countResponse] = await Promise.all([
        notificationApi.list(token),
        notificationApi.unreadCount(token),
      ]);

      if (!isMountedRef.current) return;

      setNotifications(listResponse.data);
      setUnreadCount(countResponse.count);
      setError(null);
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [token]);

  const markAsRead = useCallback(
    async (id: AppNotification["id"]): Promise<void> => {
      if (!token) return;

      await notificationApi.markAsRead(id, token);

      if (!isMountedRef.current) return;

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    },
    [token],
  );

  const markAllAsRead = useCallback(async (): Promise<void> => {
    if (!token) return;

    await notificationApi.markAllAsRead(token);

    if (!isMountedRef.current) return;

    const now = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_at: n.read_at ?? now })),
    );
    setUnreadCount(0);
  }, [token]);

  const remove = useCallback(
    async (id: AppNotification["id"]): Promise<void> => {
      if (!token) return;

      await notificationApi.remove(id, token);

      if (!isMountedRef.current) return;

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },
    [token],
  );

  useEffect(() => {
    if (!token) return;

    void refresh();

    if (pollingIntervalMs <= 0) return;

    const intervalId = setInterval(() => void refresh(), pollingIntervalMs);
    return () => clearInterval(intervalId);
  }, [token, refresh, pollingIntervalMs]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    remove,
    refresh,
  };
}