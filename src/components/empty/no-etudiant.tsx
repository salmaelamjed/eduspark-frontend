// components/empty/no-etudiant.tsx
import { GraduationCap, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

interface EtudiantEmptyProps {
  onCreate?: () => void
}

export function EtudiantEmpty({ onCreate }: EtudiantEmptyProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <GraduationCap />
        </EmptyMedia>
        <EmptyTitle>Aucun étudiant trouvé</EmptyTitle>
        <EmptyDescription>
          Vous {"n'avez"} pas encore ajouté d{"'"}étudiant. Commencez par en inscrire un.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un étudiant
        </Button>
      </EmptyContent>
    </Empty>
  )
}