'use client'
import { useMemo, useState } from "react";
import { CheckCheck, Loader2 } from "lucide-react";
import { NotificationType } from "@/types/notification";
import type { AppNotification, NotificationData } from "@/types/notification";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/notifications/useNotifications";
import { EmptyNotifications } from "@/components/empty/no-notifications";
import NotificationsCategories from "@/components/notifications/notifications-categories";
import NotificationsItem from "@/components/notifications/notifications-item";
import { NotificationsSkeletonList } from "@/components/notifications/notifications-skeleton";
import { NotificationDetailView } from "./[id]/page";

type CategoryType = "all" | "unread" | "chat" | "course" | "security";

const NOTIFICATION_CATEGORY_MAP: Record<
  NotificationType,
  Exclude<CategoryType, "all" | "unread">
> = {
  [NotificationType.NewChatMessage]: "chat",
  [NotificationType.SwitchToHuman]: "chat",
  [NotificationType.SwitchToAi]: "chat",
  [NotificationType.NewLessonPublished]: "course",
  [NotificationType.AssignmentGraded]: "course",
  [NotificationType.AssignmentDeadlineReminder]: "course",
  [NotificationType.NewStudentEnrolled]: "course",
};

function getNotificationCategory(
  notification: AppNotification,
): Exclude<CategoryType, "all" | "unread"> {
  return NOTIFICATION_CATEGORY_MAP[notification.data.type];
}

function getNotificationMessage(data: NotificationData): string {
  switch (data.type) {
    case NotificationType.NewChatMessage:
      return `${data.sender_name} : ${data.preview}`;
    case NotificationType.SwitchToHuman:
      return `${data.student_name} demande un support humain${
        data.course_title ? ` — ${data.course_title}` : ""
      }`;
    case NotificationType.SwitchToAi:
      return `Conversation repassée en mode assistant IA${
        data.course_title ? ` — ${data.course_title}` : ""
      }`;
    case NotificationType.NewLessonPublished:
      return `Nouvelle leçon "${data.lesson_title}" dans ${data.course_title}`;
    case NotificationType.AssignmentGraded:
      return `Devoir "${data.assignment_title}" noté : ${data.grade}/20`;
    case NotificationType.NewStudentEnrolled:
      return `${data.student_name} a rejoint ${data.course_title}`;
    default: {
      const exhaustiveCheck: never = data;
      return exhaustiveCheck;
    }
  }
}

export default function Notifications() {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    remove,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<CategoryType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeNotification, setActiveNotification] = useState<AppNotification | null>(null);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredNotifications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return notifications.filter((notification) => {
      const matchesTab =
        activeTab === "all"
          ? true
          : activeTab === "unread"
            ? !notification.read_at
            : getNotificationCategory(notification) === activeTab;

      if (!matchesTab) return false;
      if (!query) return true;

      const haystack = `${notification.data.label} ${getNotificationMessage(
        notification.data,
      )}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [notifications, activeTab, searchQuery]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Notifications</h1>
          <p className="mt-1 text-muted-foreground">
            Gérez et suivez toutes vos notifications
          </p>
        </div>

        {unreadCount > 0 && !activeNotification && (
          <Button variant="outline" onClick={() => void markAllAsRead()}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {activeNotification ? (
        <NotificationDetailView
          notification={activeNotification}
          onBack={() => setActiveNotification(null)}
          onRemove={(id) => void remove(id)}
          onToggleRead={(id) => void markAsRead(id)}
        />
      ) : (
        <>
          <NotificationsCategories
            value={searchQuery}
            onSearchChange={setSearchQuery}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            unreadCount={unreadCount}
          />

          {error && (
            <div className="mb-4 mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              Impossible de charger les notifications : {error.message}
            </div>
          )}

          <div className="mt-6 rounded-md border border-border/60 bg-background overflow-hidden shadow-sm">
            {isLoading && notifications.length === 0 ? (
              <NotificationsSkeletonList count={8} />
            ) : filteredNotifications.length === 0 ? (
              <EmptyNotifications />
            ) : (
              filteredNotifications.map((notification) => (
                <NotificationsItem
                  key={notification.id}
                  notification={notification}
                  isSelected={selectedIds.has(notification.id)}
                  onToggleSelect={toggleSelect}
                  onMarkAsRead={(id) => void markAsRead(id)}
                  onRemove={(id) => void remove(id)}
                  onSelectNotification={(item) => setActiveNotification(item)}
                />
              ))
            )}
          </div>

          {isLoading && notifications.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </>
      )}
    </div>
  );
}