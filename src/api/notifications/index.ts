// src/api/notification/index.ts

import { apiClient } from "@/lib/client";
import type {
  AppNotification,
  PaginatedNotifications,
} from "@/types/notification";

const BASE = "/notifications";


export const notificationApi = {
  // ======================
  // LECTURE
  // ======================

  /**
   * Liste paginée des notifications de l'utilisateur connecté
   */
  list: (token: string) =>
    apiClient.get<PaginatedNotifications>(
      BASE,token
    ),

  /**
   * Nombre de notifications non lues
   */
  unreadCount: (token: string) =>
    apiClient.get<{ count: number }>(`${BASE}/unread-count`, token),

  // ======================
  // ACTIONS
  // ======================

  /**
   * Marque une notification comme lue
   */
  markAsRead: (notificationId: AppNotification["id"], token: string) =>
    apiClient.post<{ success: true }>(
      `${BASE}/${notificationId}/read`,
      undefined,
      token,
    ),

  /**
   * Marque toutes les notifications comme lues
   */
  markAllAsRead: (token: string) =>
    apiClient.post<{ success: true }>(
      `${BASE}/mark-all-read`,
      undefined,
      token,
    ),

  /**
   * Supprime une notification
   */
  remove: (notificationId: AppNotification["id"], token: string) =>
    apiClient.delete<{ success: true }>(`${BASE}/${notificationId}`, token),
};
