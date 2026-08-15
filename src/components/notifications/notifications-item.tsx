import { useState } from "react";
import { Trash2, MailOpen, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationType } from "@/types/notification";
import type { AppNotification, NotificationData } from "@/types/notification";

interface NotificationItemProps {
  readonly notification: AppNotification;
  readonly isSelected: boolean;
  readonly onToggleSelect: (id: string) => void;
  readonly onMarkAsRead: (id: string) => void;
  readonly onRemove: (id: string) => void;
  readonly onSelectNotification: (notification: AppNotification) => void;
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

function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) return "à l'instant";
  if (diffMinutes < 60) return `il y a ${diffMinutes} min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `il y a ${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `il y a ${diffDays} j`;

  return new Date(isoDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

const NotificationsItem = ({
  notification,
  isSelected,
  onToggleSelect,
  onMarkAsRead,
  onRemove,
  onSelectNotification,
}: NotificationItemProps) => {
  const isUnread = !notification.read_at;
  const [isHovered, setIsHovered] = useState(false);

  const handleRowClick = () => {
    if (isUnread) {
      onMarkAsRead(notification.id);
    }
    onSelectNotification(notification);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex h-10 w-full items-center gap-3 border-b border-border/40 px-3 text-sm transition-all duration-75 select-none cursor-pointer",
        isUnread ? "bg-background font-semibold text-foreground" : "bg-muted/30 font-normal text-muted-foreground",
        isSelected && "bg-orange-100/70 hover:bg-orange-100 dark:bg-orange-950/30",
        !isSelected && "hover:border-transparent hover:shadow-[inset_1px_0_0_#dadce0,inset_-1px_0_0_#dadce0,0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] hover:z-10 hover:bg-background"
      )}
    >
      <div className="flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(notification.id)}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "h-4 w-4 rounded border-gray-400 accent-orange-500 cursor-pointer transition-opacity",
            isSelected || isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-60"
          )}
        />
      </div>

      <div className="w-2 shrink-0 flex justify-center">
        {isUnread && <span className="h-2 w-2 rounded-full bg-orange-500" />}
      </div>

      <div
        className="grid flex-1 min-w-0 grid-cols-[180px_1fr] items-center gap-4"
        onClick={handleRowClick}
      >
        <span
          className={cn(
            "truncate text-sm",
            isUnread ? "font-bold text-foreground" : "text-foreground/80 font-normal"
          )}
        >
          {notification.data.label}
        </span>

        <p className="truncate text-sm">
          <span className={cn(isUnread ? "font-semibold text-foreground" : "font-normal text-muted-foreground")}>
            {getNotificationMessage(notification.data)}
          </span>
        </p>
      </div>

      <div className="relative flex h-full w-24 shrink-0 items-center justify-end">
        <div
          className={cn(
            "absolute right-0 flex items-center gap-1 bg-background/90 backdrop-blur-sm pl-2 transition-opacity",
            isHovered ? "opacity-100 z-20" : "opacity-0 pointer-events-none"
          )}
        >
          <button
            type="button"
            title={isUnread ? "Marquer comme lu" : "Marquer comme non lu"}
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {isUnread ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
          </button>

          <button
            type="button"
            title="Supprimer"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(notification.id);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <span
          className={cn(
            "whitespace-nowrap text-xs text-muted-foreground transition-opacity",
            isHovered ? "opacity-0" : "opacity-100"
          )}
        >
          {formatRelativeTime(notification.created_at)}
        </span>
      </div>
    </div>
  );
};

export default NotificationsItem;