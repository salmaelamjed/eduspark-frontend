'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Bubble from '../chatbot/bubble';
import { Button } from '../ui/button';
import { Send, Loader2, ArrowDown } from 'lucide-react';
import { useTeacherChat } from '@/hooks/chat/use-teacher-chat';
import { EmptyMessagesComponent } from '../empty/no-messages';
import { ChatSkeleton } from '../skeleton/chat-skeleton';

type Props = {
  roomId: number | null;
};

const SCROLL_BOTTOM_THRESHOLD = 120;
const MAX_TEXTAREA_HEIGHT = 120; 

const Messenger = ({ roomId }: Props) => {
  const { messages, isLoading, isSending, error, sendMessage } = useTeacherChat(roomId);
  const [inputValue, setInputValue] = useState('');
  const [showJumpToBottom, setShowJumpToBottom] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wasNearBottomRef = useRef(true);
  const prevMessageCountRef = useRef(0);

  const isNearBottom = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_BOTTOM_THRESHOLD;
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const handleScroll = useCallback(() => {
    const nearBottom = isNearBottom();
    wasNearBottomRef.current = nearBottom;
    setShowJumpToBottom(!nearBottom);
  }, [isNearBottom]);

  useEffect(() => {
    const hasNewMessage = messages.length > prevMessageCountRef.current;
    prevMessageCountRef.current = messages.length;

    if (!hasNewMessage) return;

    if (wasNearBottomRef.current) {
      scrollToBottom();
    } else {
      queueMicrotask(() => setShowJumpToBottom(true));
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    prevMessageCountRef.current = 0;
    wasNearBottomRef.current = true;
    queueMicrotask(() => setShowJumpToBottom(false));
  }, [roomId]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const content = inputValue;
    setInputValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    wasNearBottomRef.current = true;
    await sendMessage(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!roomId) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center text-muted-foreground text-sm">
       <EmptyMessagesComponent/>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3 px-5 py-5"
      >
        {isLoading && (
          <ChatSkeleton/>
        )}

        {!isLoading &&
          messages.map((message) => <Bubble key={message.id} message={message} />)}

        <div ref={messagesEndRef} />
      </div>

      {showJumpToBottom && (
        <button
          onClick={() => {
            scrollToBottom();
            setShowJumpToBottom(false);
          }}
          className="absolute bottom-24 right-5 bg-white text-gray-500 border border-orange-200 rounded-full p-2.5 shadow-md hover:bg-orange-50 transition-colors"
          aria-label="Revenir aux derniers messages"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}

      {error && (
        <div className="px-5 py-2 bg-red-50 border-t border-red-100 shrink-0">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-4 py-3 bg-[#f7f5f3] shrink-0">
        <div className="flex items-end gap-2 bg-white rounded-3xl px-4 py-2 shadow-sm border border-gray-200">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Écrivez un message..."
            rows={1}
            disabled={isSending}
            className="flex-1 resize-none bg-transparent border-0 outline-none text-sm
                       placeholder:text-gray-400 py-1.5 max-h-30 leading-relaxed
                       disabled:opacity-60"
          />

          <Button
            type="submit"
            size="icon"
            disabled={!inputValue.trim() || isSending}
            className="shrink-0 rounded-full h-9 w-9 bg-orange-500 hover:bg-orange-600
                       disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Messenger;