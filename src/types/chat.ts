export type ChatMode = "ai" | "human";
export type ChatRoomStatus = "active" | "closed";
export type SenderType = "student" | "teacher" | "ai" | "system";

export interface ChatRoomLastMessage {
  content: string;
  sender_type: SenderType;
}
export interface ChatRoomCourse {
  id: number;
  title: string;
  slug: string;
}

export interface ChatRoomLesson {
  id: number;
  title: string;
}

export interface ChatRoomParticipant {
  id: number;
  name: string;
}

export interface ChatRoom {
  id: number;
  mode: ChatMode;
  status: ChatRoomStatus;
  course: ChatRoomCourse;
  lesson: ChatRoomLesson | null;
  student: ChatRoomParticipant;
  teacher?: ChatRoomParticipant;
  last_message_at: string | null;
  last_message?: ChatRoomLastMessage | null;
  unread_count: number;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  chat_room_id: number;
  sender_type: SenderType;
  sender_id: number | null;
  sender_name: string | null;
  content: string;
  created_at: string;
  status?: "pending" | "sent" | "failed";
}

export interface SendMessageResult {
  user_message: ChatMessage;
  ai_message: ChatMessage | null;
}

export interface ApiEnvelope<T> {
  data: T;
}
