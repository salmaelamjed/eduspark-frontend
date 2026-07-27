import { useCallback, useEffect, useMemo, useState } from "react";
import { chatApi } from "@/api/chat";
import { useAuth } from "@/context/auth-context";
import type { ChatRoom } from "@/types/chat";

interface CourseOption {
  id: number;
  title: string;
}

type ConversationTab = "all" | "unread";

interface UseTeacherConversationsReturn {
  rooms: ChatRoom[];
  courses: CourseOption[];
  isLoading: boolean;
  error: string | null;
  courseFilter: number | null;
  setCourseFilter: (id: number | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: ConversationTab;
  setActiveTab: (tab: ConversationTab) => void;
  unreadRoomsCount: number;
  refresh: () => Promise<void>;
  markRoomAsReadLocally: (roomId: number) => void;
}

export function useTeacherConversations(): UseTeacherConversationsReturn {
  const { token } = useAuth();

  const [allRooms, setAllRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseFilter, setCourseFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ConversationTab>("all");

  const fetchRooms = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await chatApi.listRooms(token);
      setAllRooms(res.data);
    } catch {
      setError("Impossible de charger les conversations.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Cours distincts dérivés des rooms reçues (un enseignant ne voit que ses propres cours)
  const courses = useMemo<CourseOption[]>(() => {
    const map = new Map<number, string>();
    allRooms.forEach((room) => map.set(room.course.id, room.course.title));
    return Array.from(map, ([id, title]) => ({ id, title }));
  }, [allRooms]);

  // Nombre de conversations ayant au moins un message non lu — pour le badge de l'onglet
  const unreadRoomsCount = useMemo(
    () => allRooms.filter((room) => room.unread_count > 0).length,
    [allRooms],
  );

  const rooms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return allRooms.filter((room) => {
      const matchesCourse = courseFilter
        ? room.course.id === courseFilter
        : true;
      const matchesSearch = query
        ? room.student.name.toLowerCase().includes(query)
        : true;
      const matchesTab = activeTab === "unread" ? room.unread_count > 0 : true;

      return matchesCourse && matchesSearch && matchesTab;
    });
  }, [allRooms, courseFilter, searchQuery, activeTab]);

  const markRoomAsReadLocally = useCallback((roomId: number) => {
    setAllRooms((prev) =>
      prev.map((room) =>
        room.id === roomId ? { ...room, unread_count: 0 } : room,
      ),
    );
  }, []);
  return {
    rooms,
    courses,
    isLoading,
    error,
    courseFilter,
    setCourseFilter,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    unreadRoomsCount,
    refresh: fetchRooms,
    markRoomAsReadLocally,
  };
}
