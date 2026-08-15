'use client'
import { forwardRef, useRef, useEffect, useState, useMemo } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, Loader2 } from 'lucide-react';
import RealTimeMode from './real-time';
import Bubble from './bubble';
import Responding from './responding';
import UnreadDivider from './unread-divider';
import { useChat } from '@/hooks/chat/use-chat';
import { Textarea } from '../ui/textarea';

interface BotWindowProps {
  courseId: number;
  lessonId?: number;
}

const BotWindow = forwardRef<HTMLDivElement, BotWindowProps>(
  ({ courseId, lessonId }, ref) => {
    const {
      room,
      messages,
      mode,
      isLoading,
      isSending,
      error,
      unreadSnapshot,
      sendMessage,
      switchToHuman,
      switchToAi,
    } = useChat({
      courseId,
      lessonId,
    });

    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    // Index du premier message à partir duquel afficher le séparateur "nouveaux messages".
    // Calculé une seule fois par snapshot : les messages envoyés/reçus après l'ouverture
    // (via sendMessage ou polling) ne déplacent pas la ligne, exactement comme WhatsApp.
    const unreadDividerIndex = useMemo(() => {
      if (unreadSnapshot <= 0) return null;
      const index = messages.length - unreadSnapshot;
      return index > 0 ? index : null;
    }, [unreadSnapshot, messages.length]);

    const handleSendMessage = async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!inputValue.trim() || isSending) return;

      const messageContent = inputValue;
      setInputValue('');

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      await sendMessage(messageContent);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);

      const textarea = e.target;
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    };

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-4" />
          <p className="text-sm text-gray-500">Chargement de la conversation...</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full min-h-0 overflow-hidden bg-white" ref={ref}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/bot-avatar.png" alt="Assistant" />
              <AvatarFallback className="bg-orange-100">
                <Bot className="w-5 h-5 text-orange-500" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                Assistant EduSpark
              </h3>
              <RealTimeMode
                mode={mode}
                onSwitchToHuman={switchToHuman}
                onSwitchToAi={switchToAi}
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 min-h-0 px-4">
          <div className="py-4 space-y-1">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Bot className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">
                  Posez votre première question !
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={message.id}>
                {unreadDividerIndex === index && (
                  <UnreadDivider count={unreadSnapshot} />
                )}
                <Bubble message={message} />
              </div>
            ))}

           {isSending && mode === 'ai' && <Responding />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Error Message */}
        {error && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-100 shrink-0">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className="border-t border-gray-100 p-3 bg-gray-50 shrink-0"
        >
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez votre message..."
              className="min-h-10 max-h-30 resize-none bg-white border-gray-200 
                         focus:border-orange-300 focus:ring-orange-200 rounded-xl text-sm"
              rows={1}
              disabled={isSending}
            />

            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim()}
              className="shrink-0 bg-orange-500 hover:bg-orange-600 rounded-xl h-10 w-10"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-center py-2 bg-gray-50 border-t border-gray-100 shrink-0">
          <p className="text-xs text-gray-400">Propulsé par EduSpark</p>
        </div>
      </div>
    );
  }
);

BotWindow.displayName = 'BotWindow';
export default BotWindow;