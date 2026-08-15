import { ArrowLeft, Trash2, Mail, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationType } from "@/types/notification";
import type { AppNotification, NotificationData } from "@/types/notification";

interface NotificationDetailViewProps {
  readonly notification: AppNotification;
  readonly onBack: () => void;
  readonly onRemove: (id: string) => void;
  readonly onToggleRead: (id: string) => void;
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

function formatFullDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function NotificationDetailView({
  notification,
  onBack,
  onRemove,
  onToggleRead,
}: NotificationDetailViewProps) {
  const isUnread = !notification.read_at;

  return (
    <div className="flex flex-col  ">
      {/* Action Bar (Top Toolbar) */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour aux notifications</span>
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            title={isUnread ? "Marquer comme lu" : "Marquer comme non lu"}
            onClick={() => onToggleRead(notification.id)}
          >
            {isUnread ? <CheckCheck className="h-4 w-4 text-orange-500" /> : <Mail className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            title="Supprimer"
            onClick={() => {
              onRemove(notification.id);
              onBack();
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      {/* Message Header & Content */}
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">{notification.data.label}</h2>
              <Badge variant="outline" className="text-xs capitalize">
                {notification.data.type}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatFullDate(notification.created_at)}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-muted/20 p-5 border border-border/40 text-sm leading-relaxed text-foreground">
          {getNotificationMessage(notification.data)}
        </div>
      </div>
    </div>
  );
}