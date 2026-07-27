// components/messages/chat-card.tsx
'use client';

import React from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { BellRing, User, Pin } from 'lucide-react';

type Props = {
  title: string;
  description: string;
  createdAt: Date;
  id: string;
  onChat(): void;
  isActive?: boolean; // ← nouveau : conversation actuellement ouverte
  seen?: boolean;
  unreadCount?: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  lastMessageType?: 'text' | 'image' | 'voice' | 'link';
  isTyping?: boolean;
};

const ChatCard = ({
  title,
  description,
  createdAt,
  isActive = false,
  seen = true,
  unreadCount = 0,
  isPinned = false,
  isMuted = false,
  isArchived = false,
  lastMessageType = 'text',
  isTyping = false,
  onChat,
}: Props) => {
  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (messageDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    if (messageDate.getTime() === yesterday.getTime()) return 'Hier';

    const diffDays = Math.floor((today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) return date.toLocaleDateString('fr-MA', { weekday: 'short' });

    return date.toLocaleDateString('fr-MA', { day: 'numeric', month: 'short' });
  };

  const formatDescription = (text: string) => {
    if (!text) return 'Ce chat est vide';
    let displayText = text;
    if (lastMessageType === 'image') displayText = '📷 Photo';
    else if (lastMessageType === 'voice') displayText = '🎤 Message vocal';
    else if (lastMessageType === 'link') displayText = '🔗 ' + text;
    return displayText.length > 40 ? displayText.substring(0, 40) + '...' : displayText;
  };

  const getInitials = (name: string) =>
    name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-green-100 text-green-600',
      'bg-blue-100 text-blue-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
      'bg-yellow-100 text-yellow-600',
      'bg-red-100 text-red-600',
      'bg-indigo-100 text-indigo-600',
    ];
    return colors[name.length % colors.length];
  };

  return (
    <div
      onClick={onChat}
      className={`
        transition-all duration-150 cursor-pointer px-4 py-2.5
        border-b border-gray-100 last:border-b-0 rounded-md
        ${isActive
          ? 'bg-orange-50 border-l-4 border-l-orange-500'
          : 'hover:bg-gray-50 active:bg-gray-100 border-l-4 border-l-transparent'
        }
        ${!seen && !isActive ? 'bg-gray-50/80' : ''}
        ${isArchived ? 'opacity-60' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <Avatar className="w-12 h-12">
            <AvatarFallback className={`${getAvatarColor(title)} text-sm font-semibold`}>
              {getInitials(title) || <User className="w-5 h-5" />}
            </AvatarFallback>
          </Avatar>

          {!seen && !isArchived && !isActive && (
            <div className="absolute -bottom-0.5 -right-0.5">
              <div className="w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <h3
                className={`text-sm truncate ${
                  isActive || !seen ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                }`}
              >
                {title}
              </h3>

              {isMuted && !isArchived && <BellRing className="w-3 h-3 text-gray-400 shrink-0" />}
              {isPinned && !isArchived && <Pin className="w-3 h-3 text-orange-400 shrink-0" />}
            </div>

            <span
              className={`text-[11px] shrink-0 ${
                isActive || !seen ? 'text-gray-900 font-medium' : 'text-gray-400'
              }`}
            >
              {isTyping ? (
                <span className="text-green-500 font-medium">En cours...</span>
              ) : (
                formatMessageTime(createdAt)
              )}
            </span>
          </div>

          <div className="flex items-center justify-between mt-0.5 gap-2">
            <p
              className={`text-xs truncate flex-1 ${
                isActive || !seen ? 'text-gray-900 font-medium' : 'text-gray-500'
              } ${isTyping ? 'text-green-500 font-medium' : ''}`}
            >
              {isTyping ? (
                <span className="flex items-center gap-1">
                  <span className="animate-pulse">●</span>
                  {"En train d'écrire..."}
                </span>
              ) : (
                formatDescription(description)
              )}
            </p>

            {unreadCount > 0 && !isArchived && !isActive && (
              <div className="shrink-0 min-w-5">
                <div className="bg-orange-500 text-white text-[10px] font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5 shadow-sm">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;