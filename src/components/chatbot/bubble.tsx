import { cn } from '@/lib/utils';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User, Bot, Clock, Check, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

type Props = {
  message: {
    id: number;
    sender_type: 'student' | 'teacher' | 'ai' | 'system';
    sender_name?: string | null;
    content: string;
    created_at: string;
    status?: 'pending' | 'sent' | 'failed';
  };
  onRetry?: (id: number) => void;
};

const Bubble = ({ message, onRetry }: Props) => {
  const isTeacher = message.sender_type === 'teacher';
  const isStudent = message.sender_type === 'student';
  const isSystem = message.sender_type === 'system';

  const date = new Date(message.created_at);
  const formattedTime = format(date, 'HH:mm');

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex gap-2 items-end ',
        isStudent ? 'justify-end' : 'justify-start'
      )}
    >
      {!isStudent && (
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarImage
            src={isTeacher ? '/teacher-avatar.png' : '/bot-avatar.png'}
            alt={message.sender_name || 'Assistant'}
          />
          <AvatarFallback className="bg-orange-100">
            {isTeacher ? (
              <User className="w-4 h-4 text-orange-500" />
            ) : (
              <Bot className="w-4 h-4 text-blue-500" />
            )}
          </AvatarFallback>
        </Avatar>
      )}


      <div
        className={cn(
          'flex items-end max-w-[70%] gap-1.5',
          isStudent ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <div
          className={cn(
            'rounded-2xl px-4 py-2 text-sm',
            isStudent
              ? 'bg-orange-500 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-800 rounded-bl-md',
            message.status === 'failed' && 'opacity-60'
          )}
        >
          <p className="whitespace-pre-wrap wrap-break-words">{message.content}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0 pb-0.5">
          <span className="text-[10px] text-gray-400">
            {formattedTime}
          </span>

          {isStudent && message.status === 'pending' && (
            <Clock className="w-3 h-3 text-gray-400" />
          )}

          {isStudent && message.status === 'sent' && (
            <Check className="w-3 h-3 text-gray-400" />
          )}

          {isStudent && message.status === 'failed' && (
            <button
              type="button"
              onClick={() => onRetry?.(message.id)}
              className="flex items-center gap-0.5 text-red-500"
              title="Réessayer l'envoi"
            >
              <AlertCircle className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>


      {isStudent && (
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarFallback className="bg-orange-500 text-white">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default Bubble;