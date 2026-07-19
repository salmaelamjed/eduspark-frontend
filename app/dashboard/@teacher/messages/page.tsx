'use client'

import { Separator } from "@/components/ui/separator"
import ConversationMenu from '@/components/messages/index'
import Messenger from "@/components/messages/messenger"
import InfoBar from "@/components/infobar"
const Messages = () => {
  return (
    <div className="w-full h-full flex">
    <ConversationMenu  />
 
     <Separator orientation="vertical" />
     <div className="w-full flex flex-col">
        <div className="px-5">
          <InfoBar />
        </div>
        <Messenger />
      </div>
    </div>
  )
}

export default Messages