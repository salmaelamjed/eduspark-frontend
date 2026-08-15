import {  FileText, } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function RequestEmptyDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileText />
        </EmptyMedia>
        <EmptyTitle>Aucune Demande en Cours</EmptyTitle>
        <EmptyDescription>
          Vous {"n'avez"} pas encore soumis de demande. Que souhaitez-vous faire ?
        </EmptyDescription>
      </EmptyHeader>
      
    </Empty>
  )
}