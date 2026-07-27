'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/* Header skeleton — avatar + nom + statut                                    */
/* -------------------------------------------------------------------------- */

interface ChatHeaderSkeletonProps {
  className?: string;
}

export function ChatHeaderSkeleton({ className }: ChatHeaderSkeletonProps) {
  return (
    <div className={cn('flex items-center gap-3 px-4 py-3 border-b border-gray-100 shrink-0', className)}>
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton className="h-3.5 w-32 sm:w-40 rounded-md" />
        <Skeleton className="h-2.5 w-20 sm:w-24 rounded-full" />
      </div>
    </div>
  );
}

interface ChatMessagesSkeletonProps {
  className?: string;
  messageCount?: number;
  showAvatars?: boolean;
}

const STUDENT_WIDTHS = ['w-40 sm:w-56 lg:w-48', 'w-52 sm:w-72 lg:w-60', 'w-32 sm:w-44 lg:w-40'];
const OTHER_WIDTHS = ['w-48 sm:w-64 lg:w-56', 'w-36 sm:w-48 lg:w-44', 'w-56 sm:w-80 lg:w-64'];

export function ChatMessagesSkeleton({
  className,
  messageCount = 6,
  showAvatars = true,
}: ChatMessagesSkeletonProps) {
  const messages = Array.from({ length: messageCount }).map((_, i) => {
    const isStudent = i % 3 === 0 || i % 4 === 0;
    return {
      id: i,
      isStudent,
      width: isStudent ? STUDENT_WIDTHS[i % STUDENT_WIDTHS.length] : OTHER_WIDTHS[i % OTHER_WIDTHS.length],
      lines: isStudent ? (i % 2 === 0 ? 2 : 1) : i % 3 === 0 ? 3 : 2,
    };
  });

  return (
    <div className={cn('flex-1 min-h-0 space-y-4 sm:space-y-5 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6', className)}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn('flex gap-2 items-end w-full', msg.isStudent ? 'justify-end' : 'justify-start')}
        >
          {!msg.isStudent && showAvatars && <Skeleton className="h-8 w-8 rounded-full shrink-0" />}

          <div
            className={cn(
              'flex items-end max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] gap-1.5',
              msg.isStudent ? 'flex-row-reverse' : 'flex-row',
            )}
          >
            <div
              className={cn(
                'rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3',
                msg.isStudent ? 'rounded-br-md bg-orange-500/20' : 'rounded-bl-md bg-muted',
              )}
            >
              <div className="space-y-2">
                {Array.from({ length: msg.lines }).map((_, lineIdx) => (
                  <Skeleton
                    key={lineIdx}
                    className={cn('h-3.5 sm:h-4 rounded-md', lineIdx === msg.lines - 1 ? msg.width : 'w-full')}
                  />
                ))}
              </div>
            </div>

            <Skeleton className="h-2.5 w-8 rounded-full shrink-0 mb-0.5" />
          </div>

          {msg.isStudent && showAvatars && <Skeleton className="h-8 w-8 rounded-full shrink-0" />}
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Input skeleton — barre de saisie style pilule                              */
/* -------------------------------------------------------------------------- */

interface ChatInputSkeletonProps {
  className?: string;
}

export function ChatInputSkeleton({ className }: ChatInputSkeletonProps) {
  return (
    <div className={cn('px-4 py-3 shrink-0', className)}>
      <div className="flex items-center gap-3 bg-white rounded-3xl px-5 py-2.5 sm:py-3 border border-gray-200">
        <Skeleton className="h-4 flex-1 rounded-md" />
        <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 rounded-full shrink-0" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Composition complète — drop-in replacement pour un état de chargement      */
/* -------------------------------------------------------------------------- */

interface ChatWindowSkeletonProps {
  className?: string;
  messageCount?: number;
  showHeader?: boolean;
  showInput?: boolean;
  showAvatars?: boolean;
}

export function ChatWindowSkeleton({
  className,
  messageCount = 6,
  showHeader = true,
  showInput = true,
  showAvatars = true,
}: ChatWindowSkeletonProps) {
  return (
    <div className={cn('flex h-full min-h-0 flex-col overflow-hidden bg-background', className)}>
      {showHeader && <ChatHeaderSkeleton />}
      <ChatMessagesSkeleton messageCount={messageCount} showAvatars={showAvatars} />
      {showInput && <ChatInputSkeleton />}
    </div>
  );
}

export const ChatSkeleton = ChatMessagesSkeleton;