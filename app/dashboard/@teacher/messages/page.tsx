'use client';

import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import ConversationMenu from '@/components/messages/index';
import Messenger from '@/components/messages/messenger';
import InfoBar from '@/components/infobar';
import type { ChatRoom } from '@/types/chat';

const Messages = () => {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

  return (
    <div className="w-full h-screen overflow-hidden flex">
      <ConversationMenu
        selectedRoomId={selectedRoom?.id ?? null}
        onSelectRoom={setSelectedRoom}
      />

      <Separator orientation="vertical" />

      <div className="w-full h-full flex flex-col min-h-0 overflow-hidden">
        <div className="px-5 shrink-0">
          <InfoBar room={selectedRoom} />
        </div>
        <Messenger roomId={selectedRoom?.id ?? null} />
      </div>
    </div>
  );
};

export default Messages;