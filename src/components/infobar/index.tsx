'use client';

import React from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Bot, BookOpen } from 'lucide-react';
import type { ChatRoom } from '@/types/chat';

type Props = {
  room: ChatRoom | null;
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const formatLastSeen = (isoDate: string | null) => {
  if (!isoDate) return null;

  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Actif à l\'instant';
  if (diffMin < 60) return `Actif il y a ${diffMin} min`;

  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Actif il y a ${diffH} h`;

  const diffDays = Math.floor(diffH / 24);
  return `Actif il y a ${diffDays} j`;
};

const InfoBar = ({ room }: Props) => {
  if (!room) {
    return (
      <div className="flex w-full justify-between items-center py-1 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Conversations</h2>
          <p className="text-muted-foreground mt-1">
            Sélectionnez une conversation pour voir les détails.
          </p>
        </div>
      </div>
    );
  }

  const isHuman = room.mode === 'human';
  const lastSeen = formatLastSeen(room.last_message_at);

  return (
    <div className="flex w-full justify-between items-center py-3 mb-4 border-b border-gray-100">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="w-11 h-11">
          <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
            {getInitials(room.student.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900 truncate">
              {room.student.name}
            </h2>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                isHuman
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-blue-100 text-blue-600'
              }`}
            >
              {isHuman ? 'En direct' : (
                <>
                  <Bot className="w-3 h-3" /> IA
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <BookOpen className="w-3 h-3 shrink-0" />
            <span className="truncate">{room.course.title}</span>
            {room.lesson && (
              <>
                <span className="shrink-0">·</span>
                <span className="truncate">{room.lesson.title}</span>
              </>
            )}
          </div>

          {lastSeen && (
            <p className="text-[11px] text-gray-400 mt-0.5">{lastSeen}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoBar;