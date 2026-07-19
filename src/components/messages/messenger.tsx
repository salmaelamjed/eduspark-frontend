'use client'
// import { useChatWindow } from '../../hooks/conversation/use-conversation'
import React from 'react'
import Bubble from '../chatbot/bubble'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Paperclip, Send } from 'lucide-react'
import { Label } from '../ui/label'
import { Loader } from '../loading'


const Messenger = () => {
//   const {
//     messageWindowRef,
//     chats,
//     loading,
//     chatRoom,
//     handleSubmit,
//      form
//   } = useChatWindow()

  return (
    <div className='flex-1 flex flex-col h-0 relative'>
      <div className="flex-1 h-0 w-full flex flex-col">
        {/* <Loader loading={loading}> */}
          <div 
            // ref={messageWindowRef}
            className="flex-1 h-0 w-full flex flex-col gap-3 pl-5 py-5 chat-window overflow-auto"
          >
            {/* {chats.length ? (
              chats.map((chat) => (
                <Bubble
                  key={chat.id}
                  message={{ 
                    role: chat.role!,
                    content: chat.message,
                  }}
                  createdAt={chat.createdAt}
                />
              ))
            ) : ( 
              <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                {chatRoom ? 'No message' : 'No conversation selected'}
              </div> 
            )} */}
          </div>
        {/* </Loader> */}
      </div>
      
      <form
        // onSubmit={handleSubmit}
        className='flex flex-col px-3 pb-10 backdrop-blur-sm bg-muted w-full'
      >
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center">
            <Input
            //   {...form.register('content')}
              placeholder='Type your message here...'
              className='focus-visible:ring-0 flex-1 p-0  shadow-none
                focus-visible:ring-offset-0 bg-muted rounded-none
                outline-none border-none focus:border-none focus:outline-none'
            />
          </div>
          
          <Label htmlFor='upload' className="cursor-pointer">
            <Paperclip className='text-muted-foreground'/>
            <Input
              type="file"
              id="upload"
            //   {...form.register('image')}
              className="hidden"
            />
          </Label>
          
          <Button
            type='submit'
            className='px-7 bg-orange-500 text-white hover:bg-orange-400 hover:cursor-pointer '
            // disabled={!chatRoom}
          >
            <Send/>
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Messenger