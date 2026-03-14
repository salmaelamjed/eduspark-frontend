"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import Image from "next/image";
import { DomainResponse } from "@/types/domain";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DomainViewSheetProps {
  domain: DomainResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DomainViewSheet({
  domain,
  open,
  onOpenChange,
}: DomainViewSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg md:max-w-xl">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">{domain.name}</SheetTitle>
          <SheetDescription>Détails du domaine</SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {domain.image && (
            <div>
              <h3 className="text-sm font-medium mb-2">Image</h3>
              <div className="relative h-48 w-full rounded-lg overflow-hidden border">
                <Image
                  src={`http://localhost:8000/storage/${domain.image}`}
                  alt={domain.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">ID</h3>
              <p className="mt-1">{domain.id}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Slug</h3>
              <p className="mt-1 font-mono">{domain.slug}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Créé le</h3>
              <p className="mt-1">
                {format(new Date(domain.created_at), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Mis à jour le</h3>
              <p className="mt-1">
                {format(new Date(domain.updated_at), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
              </p>
            </div>
          </div>

          {domain.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
              <p className="whitespace-pre-wrap">{domain.description}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}