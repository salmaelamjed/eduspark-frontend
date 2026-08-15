import { BookOpen } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"



export function CoursEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookOpen />
        </EmptyMedia>
        <EmptyTitle>Aucun cours trouvé</EmptyTitle>
        <EmptyDescription>
          Vous {"n'avez"} pas encore créé de cours. Ajoutez-en un pour commencer.
        </EmptyDescription>
      </EmptyHeader>
    
    </Empty>
  )
}