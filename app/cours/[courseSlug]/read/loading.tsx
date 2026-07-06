import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Avatar, AvatarImage ,AvatarFallback} from '@/components/ui/avatar';
import RealTimeMode from "@/components/chatbot/real-time";


export default function Loading() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      
      {/* 1. SKELETON SIDEBAR GAUCHE (ModuleReadSidebar) */}
      <aside className="w-80 shrink-0 border-r border-gray-100 p-6 flex flex-col gap-6">
        <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-center mb-3">
                      <Image
                        src="/images/EduSparkL.svg"
                        alt="EduSpark logo"
                        width={150}
                        height={150}
                        priority
                    />
                  </div>
                </div>
        
        {/* Liste des Modules (Simule 3 modules) */}
        <div className="space-y-6">
          {[1, 2, 3].map((moduleIndex) => (
            <div key={moduleIndex} className="space-y-3">
              {/* En-tête du module */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-2/3 rounded-md" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              {/* Leçons à l'intérieur du module */}
              <div className="pl-4 space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* 2. SKELETON CONTENU CENTRAL (LessonContent) */}
      <main className="flex-1 p-8 space-y-6 ">
        <div className="max-w-3xl mx-auto space-y-6 mt-4">
          {/* Fil d'ariane / miettes de pain */}
          <Skeleton className="h-4 w-1/3 rounded-md" />
          
          {/* Titre de la leçon */}
          <Skeleton className="h-10 w-3/4 rounded-xl" />
          
          {/* Métadonnées (Temps de lecture, auteur, etc.) */}
          <div className="flex gap-3 items-center">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>

          <Separator className="my-4" />

          {/* Corps de la leçon (Simule des paragraphes et un bloc d'image/code) */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-11/12 rounded-md" />
          </div>

          {/* Simulation d'un bloc de code ou d'une illustration */}
          <Skeleton className="h-64 w-full rounded-xl" />

          <div className="space-y-4 pt-4">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
          </div>
        </div>
      </main>

      <Separator orientation="vertical" />

      {/* 3. SKELETON CHATBOT DROIT (BotWindow) */}
      <aside className="w-90 shrink-0 bg-gray-50/50 p-4 flex flex-col justify-between h-full">
        {/* Header du Bot */}
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

        {/* Zone des messages simulée */}
        <div className="flex-1 py-4 space-y-4 overflow-y-hidden">
          {/* Message du bot */}
          <div className="flex gap-2 max-w-[80%]">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <Skeleton className="h-16 w-full rounded-2xl rounded-tl-none" />
          </div>
          {/* Message de l'utilisateur */}
          <div className="flex gap-2 max-w-[80%] ml-auto justify-end">
            <Skeleton className="h-12 w-full rounded-2xl rounded-tr-none bg-orange-100/50" />
          </div>
        </div>

        {/* Input du chatbot en bas */}
        <div className="pt-2">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </aside>

    </div>
  )
}