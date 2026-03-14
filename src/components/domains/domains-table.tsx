"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, PenBox } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import { DomainResponse } from "@/types/domain";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

// Import the correct hooks
import { useDeleteDomain } from "@/hooks/domains/use-domain";
import DomainViewSheet from "./DomainViewSheet";
import DomainEditSheet from "./DomainEditSheet";



interface DomainsTableProps {
  domains: DomainResponse[];
  loading: boolean;
}

export function DomainsTable({ domains, loading }: DomainsTableProps) {
  const { token } = useAuth();
  const deleteMutation = useDeleteDomain(); 

  const [selectedDomain, setSelectedDomain] = useState<DomainResponse | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleView = (domain: DomainResponse) => {
    setSelectedDomain(domain);
    setViewOpen(true);
  };

  const handleEdit = (domain: DomainResponse) => {
    setSelectedDomain(domain);
    setEditOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!token) {
      toast.error("Vous devez être connecté pour supprimer");
      return;
    }

    if (!confirm("Vraiment supprimer ce domaine ? Cette action est irréversible.")) {
      return;
    }

    deleteMutation.mutate(
      { id, token },
      {
        onSuccess: () => {
          toast.success("Domaine supprimé avec succès");
        },
        onError: () => {
          toast.error("Erreur lors de la suppression");
        },
      }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (domains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-muted-foreground text-lg mb-2">Aucun domaine trouvé</p>
        <p className="text-sm text-muted-foreground">
          Commencez par ajouter votre premier domaine
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Nom du domaine</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right mr-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.map((domain) => (
              <TableRow key={domain.id}>

                <TableCell>
                  {domain.image ? (
                    <Image
                      src={`http://localhost:8000/storage/${domain.image}`}
                      alt={domain.name || "Image du domaine"}
                      width={50}
                      height={50}
                      className="object-cover rounded"
                      unoptimized
                    />
                  ) : (
                    <div className="h-12.5 w-12.5 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      Pas {"d'image"}
                    </div>
                  )}
                </TableCell>

                <TableCell className="font-semibold">{domain.name}</TableCell>
                <TableCell 
                  className="max-w-55 truncate" 
                  title={domain.description || "Aucune description"}
                >
                  {domain.description 
                    ? domain.description.length > 65 
                      ? domain.description.substring(0, 65) + "..." 
                      : domain.description 
                    : "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(domain.created_at), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </TableCell>

                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => handleEdit(domain)}
                    title="Modifier"
                  >
                    <PenBox className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => handleView(domain)}
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(domain.id)}
                    disabled={deleteMutation.isPending}
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Sheets */}
      {selectedDomain && (
        <>
          <DomainViewSheet
            domain={selectedDomain}
            open={viewOpen}
            onOpenChange={setViewOpen}
          />
          <DomainEditSheet
            domain={selectedDomain}
            open={editOpen}
            onOpenChange={(open) => {
              setEditOpen(open);
              if (!open) setSelectedDomain(null);
            }}
          />
        </>
      )}
    </>
  );
}