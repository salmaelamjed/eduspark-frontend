'use client';

import React from 'react';
import ConversationSearch from './search';
import { CardDescription } from '../ui/card';
import ChatCard from './chat-card';
import { useForm } from 'react-hook-form';
import { Form } from '../ui/form';
import { useTeacherConversations } from '@/hooks/chat/use-teacher-conversations';
import { Loader2 } from 'lucide-react';
import { ChatRoom } from '@/types/chat';

type Props = {
  selectedRoomId: number | null;
  onSelectRoom: (room: ChatRoom) => void;
};

const ConversationMenu = ({ selectedRoomId, onSelectRoom }: Props) => {
  const form = useForm({ defaultValues: { domain: 'all' } });

  const {
    rooms,
    courses,
    isLoading,
    error,
    courseFilter,
    setCourseFilter,
    searchQuery,
     activeTab,
    setActiveTab,
    unreadRoomsCount,
    setSearchQuery,
     markRoomAsReadLocally,
  } = useTeacherConversations();

  const handleSelectRoom = (room: ChatRoom) => {
  onSelectRoom(room);
  markRoomAsReadLocally(room.id); 
  };
  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden gap-3 p-4 bg-white rounded-xl border border-gray-100 w-85 shrink-0">
      {/* En-tête / Recherche */}
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-bold text-gray-900">Discussions</h3>
        <CardDescription>Gérez vos conversations avec les étudiants</CardDescription>

        <Form {...form}>
          <ConversationSearch
            value={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadCount={unreadRoomsCount}
          />
        </Form>

        {/* Filtre par cours */}
        <select
          value={courseFilter ?? ''}
          onChange={(e) => setCourseFilter(e.target.value ? Number(e.target.value) : null)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 bg-white"
        >
          <option value="">Tous les cours</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des conversations */}

<div className="flex flex-col gap-1 overflow-y-auto pr-1 flex-1 min-h-0">
  {isLoading && (
    <div className="flex items-center justify-center py-8 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" />
    </div>
  )}

  {!isLoading && error && (
    <p className="text-xs text-red-500 text-center py-4">{error}</p>
  )}

  {!isLoading && !error && rooms.length === 0 && (
    <p className="text-xs text-gray-400 text-center py-8">
      Aucune conversation pour le moment.
    </p>
  )}

  {rooms.map((room) => (
    <ChatCard
      key={room.id}
      id={String(room.id)}
      title={room.student.name}
      description={room.last_message?.content ?? ''}
      createdAt={new Date(room.last_message_at ?? room.created_at)}
      isActive={selectedRoomId === room.id}
      seen={room.unread_count === 0}
       unreadCount={room.unread_count}
      isPinned={false}
      isMuted={false}
      onChat={() => handleSelectRoom(room)}
    />
  ))}
</div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-1 shrink-0">
        <span className="text-xs text-gray-400">{rooms.length} discussions</span>
      </div>
    </div>
  );
};

export default ConversationMenu;