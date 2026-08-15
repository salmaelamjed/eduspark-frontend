// components/empty/no-enseignant.tsx
import { Users, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

interface EnseignantEmptyProps {
  onCreate?: () => void
}

export function EnseignantEmpty({ onCreate }: EnseignantEmptyProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Users />
        </EmptyMedia>
        <EmptyTitle>Aucun enseignant trouvé</EmptyTitle>
        <EmptyDescription>
          Vous {"n'avez"} pas encore ajouté d{"'"}enseignant. Commencez par en inviter un.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un enseignant
        </Button>
      </EmptyContent>
    </Empty>
  )
}