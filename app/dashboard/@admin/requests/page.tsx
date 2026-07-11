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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, Loader2, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTeacherRequestsManagement } from '@/hooks/teacher-requests/use-teacher-requests';
import type { TeacherRequestDetail } from '@/types/request';
import type { User } from '@/types/user';
import type { Domain } from '@/types/domain';
type TeacherRequestRow = TeacherRequestDetail & { user: User; domain: Domain };

import Link from 'next/link';

function getStatusBadge(status: string) {
  const variants: Record<string, string> = {
    approved: 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    rejected: 'bg-rose-500/15 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  };

  return (
    <Badge
      variant="outline"
      className={`border-0 capitalize ${variants[status] || 'bg-gray-500/15 text-gray-700'}`}
    >
      {status === 'approved' ? 'Approuvée' : 'Rejetée'}
    </Badge>
  );
}

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

 const [selectedRequest, setSelectedRequest] = useState<TeacherRequestRow | null>(null);
 const openDetails = (req: TeacherRequestRow) => setSelectedRequest(req);
  const closeDetails = () => setSelectedRequest(null);

  const getInitials = (name?: string) =>
    name
      ? name.split(' ').map((n) => n[0]).join('').toUpperCase()
      : '??';

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des demandes</h1>
          <p className="text-muted-foreground mt-1">
            Gérez et suivez vos demandes
          </p>
        </div>
      </div>

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
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="border-b hover:bg-transparent">
                <TableHead className="h-12 px-4 font-medium">Utilisateur</TableHead>
                <TableHead className="h-12 px-4 font-medium">Email</TableHead>
                <TableHead className="h-12 px-4 font-medium">Domaine</TableHead>
                <TableHead className="h-12 px-4 font-medium text-center">Statut</TableHead>
                <TableHead className="h-12 px-4 font-medium">Date</TableHead>
                <TableHead className="h-12 w-32 px-4 font-medium text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => {
                const updating = isRequestUpdating(req.id);

                return (
                  <TableRow key={req.id} className="hover:bg-muted/50">
                    <TableCell className="h-16 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={req.user?.profile_picture ?? undefined} alt={req.user?.name} />
                          <AvatarFallback className="bg-orange-100 text-orange-700 font-medium">
                            {getInitials(req.user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{req.user?.name || '—'}</p>
                      </div>
                    </TableCell>

                    <TableCell className="h-16 px-4 text-muted-foreground">
                      {req.user?.email || '—'}
                    </TableCell>

                    <TableCell className="h-16 px-4">
                      {req.domain?.name || '—'}
                    </TableCell>

                    <TableCell className="h-16 px-4 text-center">
                      {updating ? (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
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
                          <SelectTrigger className="h-8 rounded-full bg-amber-500/15 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-0 font-medium justify-center gap-1 [&>svg]:h-3.5 [&>svg]:w-3.5">
                            <SelectValue placeholder="En attente" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="approved">Approuver</SelectItem>
                            <SelectItem value="rejected">Rejeter</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        getStatusBadge(req.status)
                      )}
                    </TableCell>

                    <TableCell className="h-16 px-4 text-muted-foreground font-mono">
                      {new Date(req.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>

                    <TableCell className="h-16 px-4">
                      <TooltipProvider>
                        <div className="flex items-center justify-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openDetails(req)}
                              >
                                <Eye className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Voir détails</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-destructive hover:bg-destructive hover:text-white h-8 w-8"
                                onClick={() => handleDelete(req.id)}
                                disabled={isAnyUpdatePending}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Supprimer</TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {hasPagination && (
        <div className="mt-8 py-6 flex justify-center border-t">
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
        <SheetContent className="sm:max-w-lg md:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl">
              Demande #{selectedRequest?.id || '...'}
            </SheetTitle>
            <SheetDescription>
              Informations complètes de la demande soumise
            </SheetDescription>
          </SheetHeader>

          {selectedRequest ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    {selectedRequest.status === 'pending' ? (
                      <Badge variant="outline" className="border-0 bg-amber-500/15 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 text-base px-4 py-1">
                        En attente
                      </Badge>
                    ) : (
                      getStatusBadge(selectedRequest.status)
                    )}
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

              <div className="space-y-4 border-t pt-5">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profil LinkedIn</p>
                  {selectedRequest.linkedin_url ? (
                    <a
                      href={selectedRequest.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:underline break-all"
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
                    <Link
                      href={selectedRequest.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:underline break-all"
                    >
                      {selectedRequest.project_url}
                    </Link>
                  ) : (
                    <p className="text-muted-foreground italic">Non renseigné</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-5">
                <p className="text-sm font-medium text-muted-foreground mb-2">Lettre de motivation</p>
                <div className="prose prose-slate max-w-none bg-muted/60 p-6 rounded-lg">
                  {selectedRequest.motivation || "Aucune lettre de motivation n'a été fournie."}
                </div>
              </div>

              {selectedRequest.admin_comment && (
                <div className="border-t pt-5">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Commentaire de l&apos;administrateur
                  </p>
                  <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
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