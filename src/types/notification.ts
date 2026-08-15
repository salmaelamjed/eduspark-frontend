export const NotificationType = {
  NewChatMessage: "new_chat_message",
  SwitchToHuman: "switch_to_human",
  SwitchToAi: "switch_to_ai",
  NewLessonPublished: "new_lesson_published",
  AssignmentGraded: "assignment_graded",
  AssignmentDeadlineReminder: "assignment_deadline_reminder",
  NewStudentEnrolled: "new_student_enrolled",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

interface BaseNotificationData {
  readonly type: NotificationType;
  readonly label: string;
}

export interface NewChatMessageData extends BaseNotificationData {
  readonly type: typeof NotificationType.NewChatMessage;
  readonly room_id: number;
  readonly message_id: number;
  readonly sender_name: string;
  readonly preview: string;
}

export interface SwitchToHumanData extends BaseNotificationData {
  readonly type: typeof NotificationType.SwitchToHuman;
  readonly room_id: number;
  readonly student_name: string;
  readonly course_title: string | null;
}

export interface SwitchToAiData extends BaseNotificationData {
  readonly type: typeof NotificationType.SwitchToAi;
  readonly room_id: number;
  readonly course_title: string | null;
}

export interface NewLessonPublishedData extends BaseNotificationData {
  readonly type: typeof NotificationType.NewLessonPublished;
  readonly course_id: number;
  readonly course_title: string;
  readonly lesson_title: string;
}

export interface AssignmentGradedData extends BaseNotificationData {
  readonly type: typeof NotificationType.AssignmentGraded;
  readonly assignment_title: string;
  readonly grade: number;
}

export interface NewStudentEnrolledData extends BaseNotificationData {
  readonly type: typeof NotificationType.NewStudentEnrolled;
  readonly course_id: number;
  readonly course_title: string;
  readonly student_name: string;
}

/** Union discriminée sur `type` — TS narrow automatiquement le bon shape */
export type NotificationData =
  | NewChatMessageData
  | SwitchToHumanData
  | SwitchToAiData
  | NewLessonPublishedData
  | AssignmentGradedData
  | NewStudentEnrolledData;

export interface AppNotification {
  readonly id: string;
  readonly data: NotificationData;
  readonly read_at: string | null;
  readonly created_at: string;
}

export interface PaginatedNotifications {
  readonly data: readonly AppNotification[];
  readonly meta: {
  readonly current_page: number;
  readonly last_page: number;
  readonly total: number;
  };
}
