import { forwardRef } from "react";
import { Avatar, AvatarImage ,AvatarFallback} from "../ui/avatar";
import Image from "next/image";
import {  Paperclip } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import RealTimeMode from "./real-time";
import { ScrollArea } from "@/components/ui/scroll-area"


const BotWindow = forwardRef<HTMLDivElement>(
  (
  ) => {


     
    return (
      <div
        className=" flex flex-col
           overflow-hidden"
      >
        <div className="flex justify-between px-4 pt-4">
          <div className="flex gap-2">
                <Avatar className="w-14 h-14">
                      <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>

                </Avatar>

                <div className="flex items-start flex-col">
                  <h3 className="text-md font-black leading-none">
                    Mohammed el amjed 
                  </h3>
                  <p className="text-sm"></p>
                  {/* {realtimeMode?.mode && (
                    
                  )} */}
                  <RealTimeMode/>
                </div>
          </div>
          <div className="relative w-20 h-20">
            
         </div>
        </div>

        
            <div className="flex-col flex h-full">
              <div className="px-3 chat-window overflow-y-auto gap-3 flex-col py-5
              flex h-[74vh]"
              // ref={ref}
              >
                 <ScrollArea className="h-screen w-90  p-4">

       
      </ScrollArea>
                {/* {chats.map((chat,key)=>(
                  
                ))} */}
                {/* <Bubble
                  key={"key"}
                  message={"key"}
                  /> */}
               {/* {onResponding && <Responding />} */}
              </div>
              <form 
              // onSubmit={onChat}
              className="flex px-3 flex-col flex-1  bg-gray-200">
                <div className="flex justify-between">
                  <textarea
                  // {...register("content")}
                  placeholder="Type your message..."
                  className="flex-1 min-h-6 max-h-30 resize-none border-none bg-transparent 
                             placeholder:text-gray-400 focus:outline-none text-base leading-relaxed
                             scrollbar-thin scrollbar-thumb-gray-300 py-1"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      // onChat();
                    }
                  }}
                />
                  <Button
                  type="submit"
                  className="mt-3 bg-orange-500 hover:cursor-pointer hover:bg-orange-400"
                  >
                    Send
                  </Button>

                </div>
                <Label htmlFor='upload'>
                  <Paperclip/>
                  <Input
                  type="file"
                  id="upload"
                  // {...register('image')}
                  className="hidden"
                  />
                </Label>
              </form>
            </div>
        <div className="flex justify-center p-1">
          <p className="text-gray-400 text-sm">
            Powered By EduSpark
          </p>
        </div>
      </div>
    )
  }
)


export default BotWindow
BotWindow.displayName = "BotWindow"
