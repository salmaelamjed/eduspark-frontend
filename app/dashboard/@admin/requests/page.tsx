'use client';

import React, { Fragment, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Eye, Loader2, Trash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTeacherRequestsManagement } from '@/hooks/teacher-requests/use-teacher-requests';
import { cn } from '@/lib/utils';

export default function TeacherRequestsPage() {
  const {
    currentPage,
    setCurrentPage,
    requests,
    pagination,
    isPageLoading,
    hasPagination,
    handleStatusChange,
    handleDelete,
    isRequestUpdating,
    isAnyUpdatePending,
  } = useTeacherRequestsManagement();

  // État pour gérer le sheet + la demande sélectionnée
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const openDetails = (req: any) => {
    setSelectedRequest(req);
  };

  const closeDetails = () => {
    setSelectedRequest(null);
  };

  return (
    <div className="min-h-screen flex flex-col container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Demandes{" d'enseignants"}</h1>

      <div className="flex-1">
        {isPageLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground border rounded-lg bg-muted/30">
            Aucune demande trouvée.
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Domaine</TableHead>
                  <TableHead className="w-44">Statut</TableHead>
                  <TableHead className="w-32">Date</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => {
                  const updating = isRequestUpdating(req.id);

                  return (
                    <TableRow key={req.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{req.id}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {req.user?.name  || '—'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {req.user?.email  || '—'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {req.domain?.name || '—'}
                      </TableCell>

                      <TableCell>
                        {updating ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Mise à jour...</span>
                          </div>
                        ) : req.status === 'pending' ? (
                          <Select
                            value={req.status}
                            onValueChange={(value) =>
                              handleStatusChange(req.id, value as 'pending' | 'approved' | 'rejected')
                            }
                            disabled={isAnyUpdatePending}
                          >
                            <SelectTrigger className="py-1 rounded-full bg-yellow-400 text-white font-medium text-center ">
                              <SelectValue 
                              
                              placeholder="En attente" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="approved">Approuver</SelectItem>
                              <SelectItem value="rejected">Rejeter</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge
                            variant={req.status === 'approved' ? 'default' : 'destructive'}
                            className={cn(
                              'text-sm font-medium py-1 px-5',
                              req.status === 'rejected' && 'px-8 bg-red-100 text-red-800'
                            )}
                          >
                            {req.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(req.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>

                      <TableCell className="text-right flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          onClick={() => openDetails(req)}
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(req.id)}
                          disabled={isAnyUpdatePending}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination toujours en bas */}
      {hasPagination && (
        <div className="mt-auto py-6 flex justify-center border-t bg-background">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination?.hasPrevPage) setCurrentPage((p) => p - 1);
                  }}
                  className={!pagination?.hasPrevPage ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {Array.from({ length: pagination?.lastPage ?? 1 }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === pagination?.lastPage ||
                    (p >= currentPage - 1 && p <= currentPage + 1)
                )
                .map((pageNum, idx, arr) => (
                  <Fragment key={pageNum}>
                    {idx > 0 && arr[idx - 1] !== pageNum - 1 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        isActive={pageNum === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  </Fragment>
                ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination?.hasNextPage) setCurrentPage((p) => p + 1);
                  }}
                  className={!pagination?.hasNextPage ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <Sheet open={!!selectedRequest} onOpenChange={closeDetails}>
        <SheetContent className="sm:max-w-lg md:max-w-xl overflow-y-auto ">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl">
              Demande #{selectedRequest?.id || '...'}
            </SheetTitle>
            <SheetDescription>
              Informations complètes de la demande soumise
            </SheetDescription>
          </SheetHeader>

          {selectedRequest ? (
            <div className="space-y-6 ml-4">
              {/* Bloc infos principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Utilisateur</p>
                  <p className="mt-1 font-medium">
                    {selectedRequest.user?.name || selectedRequest.user?.email || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Domaine</p>
                  <p className="mt-1 font-medium">{selectedRequest.domain?.name || '—'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Statut</p>
                  <div className="mt-1">
                    <Badge
                      variant={
                        selectedRequest.status === 'approved'
                          ? 'default'
                          : selectedRequest.status === 'rejected'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className="text-base px-4 py-1"
                    >
                      {selectedRequest.status === 'pending'
                        ? 'En attente'
                        : selectedRequest.status === 'approved'
                        ? 'Approuvée'
                        : 'Rejetée'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date soumission</p>
                  <p className="mt-1">
                    {new Date(selectedRequest.created_at).toLocaleString('fr-FR', {
                      dateStyle: 'long',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>

              {/* Liens */}
              <div className="space-y-4 border-t pt-5">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profil LinkedIn</p>
                  {selectedRequest.linkedin_url ? (
                    <a
                      href={selectedRequest.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline hover:text-blue-800 transition-colors break-all"
                    >
                      {selectedRequest.linkedin_url}
                    </a>
                  ) : (
                    <p className="text-muted-foreground italic">Non renseigné</p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Projet / Portfolio</p>
                  {selectedRequest.project_url ? (
                    <a
                      href={selectedRequest.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline hover:text-blue-800 transition-colors break-all"
                    >
                      {selectedRequest.project_url}
                    </a>
                  ) : (
                    <p className="text-muted-foreground italic">Non renseigné</p>
                  )}
                </div>
              </div>

              {/* Motivation – partie la plus importante */}
              <div className="border-t pt-5 w-125">
                <p className="text-sm font-medium text-muted-foreground mb-2">Lettre de motivation</p>
                <div className="
    prose 
    prose-slate 
    max-w-125 
    mx-auto 
    md:mx-0 
    md:max-w-none 
    bg-muted/60 
    p-6 
    rounded-lg ">
                  {selectedRequest.motivation ||
                    "Aucune lettre de motivation n'a été fournie."}
                </div>
              </div>

              {/* Commentaire admin (si existe) */}
              {selectedRequest.admin_comment && (
                <div className="border-t pt-5">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Commentaire de {"l'administrateur"}
                  </p>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    {selectedRequest.admin_comment}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-10 space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}

          <SheetFooter className="mt-8 pt-4 border-t">
            <Button variant="outline" onClick={closeDetails} className="w-full sm:w-auto">
              Fermer
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}