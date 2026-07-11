"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateDomain } from "@/hooks/domains/use-domain";
import { toast } from "sonner";
import { Domain } from "@/types/domain";
import { useAuth } from "@/context/auth-context"; 
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  // image: on gérera l'upload séparément si besoin
});

type FormValues = z.infer<typeof formSchema>;

interface DomainEditSheetProps {
  domain: Domain;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DomainEditSheet({
  domain,
  open,
  onOpenChange,
}: DomainEditSheetProps) {
  const { token } = useAuth();
  const updateMutation = useUpdateDomain();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: domain.name,
      description: domain.description || "",
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!token) {
      toast.error("Vous devez être connecté");
      return;
    }

    updateMutation.mutate(
      {
        id: domain.id,
        data: values,
        token,
      },
      {
        onSuccess: () => {
          toast.success("Domaine modifié avec succès");
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Erreur lors de la modification");
        },
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">Modifier le domaine</SheetTitle>
          <SheetDescription>Modifiez les informations du domaine</SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Nom du domaine</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} rows={4} />
          </div>

          {/* Aperçu de l'image actuelle */}
          {domain.image && (
            <div>
              <Label>Image actuelle</Label>
              <div className="mt-2 relative h-32 w-32 rounded-md overflow-hidden border">
                <Image
                  src={domain.image}
                  alt="Image actuelle"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}

          {/* Pour l'instant on n'ajoute pas l'upload d'image dans ce Sheet */}
          {/* Tu peux l'ajouter plus tard avec un input file + FormData */}

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}