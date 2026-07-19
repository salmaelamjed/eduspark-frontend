import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Bot } from 'lucide-react';

const Responding = () => {
  return (
    <div className="flex gap-2 items-end mb-4">
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarImage src="/bot-avatar.png" alt="Assistant" />
        <AvatarFallback className="bg-blue-100">
          <Bot className="w-4 h-4 text-blue-500" />
        </AvatarFallback>
      </Avatar>

      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="typing-indicator">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>

      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 0;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #94a3b8;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .dot:nth-child(1) {
          animation-delay: -0.32s;
        }
        .dot:nth-child(2) {
          animation-delay: -0.16s;
        }
        .dot:nth-child(3) {
          animation-delay: 0s;
        }
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Responding;