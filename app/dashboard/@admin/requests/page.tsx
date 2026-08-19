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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, Trash2, Linkedin, FolderGit2, MessageSquareText, ExternalLink } from 'lucide-react';
import { useTeacherRequestsManagement } from '@/hooks/teacher-requests/use-teacher-requests';
import type { TeacherRequestDetail } from '@/types/request';
import type { User } from '@/types/user';
import type { Domain } from '@/types/domain';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, ChevronDown, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
type TeacherRequestRow = TeacherRequestDetail & { user: User; domain: Domain };

import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RequestEmptyDemo } from '@/components/empty/no-demande';

// --- Status styling -----------------------------------------------------

const statusStyles: Record<string, string> = {
  approved: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  rejected: 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
};

const statusDot: Record<string, string> = {
  approved: 'bg-emerald-500',
  rejected: 'bg-rose-500',
};

const statusLabel: Record<string, string> = {
  approved: 'Approuvée',
  rejected: 'Rejetée',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1.5 rounded-full border-0 px-2.5 py-1 text-xs font-medium capitalize',
        statusStyles[status] ?? 'bg-muted text-muted-foreground'
      )}
    >
      <span className={cn('size-1.5 rounded-full', statusDot[status] ?? 'bg-muted-foreground')} />
      {statusLabel[status] ?? status}
    </Badge>
  );
}

// --- Skeleton matching the real row structure ---------------------------

function RequestsTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow className="border-b hover:bg-transparent">
            <TableHead className="h-12 px-4 font-medium">Utilisateur</TableHead>
            <TableHead className="h-12 px-4 font-medium">Email</TableHead>
            <TableHead className="h-12 px-4 font-medium">Domaine</TableHead>
            <TableHead className="h-12 px-4 text-center font-medium">Statut</TableHead>
            <TableHead className="h-12 px-4 font-medium">Date</TableHead>
            <TableHead className="h-12 w-32 px-4 text-center font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              <TableCell className="h-16 px-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />
                  <div className="h-3.5 w-28 animate-pulse rounded bg-muted" />
                </div>
              </TableCell>
              <TableCell className="h-16 px-4">
                <div className="h-3.5 w-36 animate-pulse rounded bg-muted" />
              </TableCell>
              <TableCell className="h-16 px-4">
                <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
              </TableCell>
              <TableCell className="h-16 px-4">
                <div className="mx-auto h-6 w-20 animate-pulse rounded-full bg-muted" />
              </TableCell>
              <TableCell className="h-16 px-4">
                <div className="h-3.5 w-20 animate-pulse rounded bg-muted" />
              </TableCell>
              <TableCell className="h-16 px-4">
                <div className="mx-auto flex w-16 gap-1.5">
                  <div className="size-8 animate-pulse rounded-md bg-muted" />
                  <div className="size-8 animate-pulse rounded-md bg-muted" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// --- Detail sheet section helper -----------------------------------------

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1.5 text-sm">{value}</div>
    </div>
  );
}

// --- Component -------------------------------------------------------

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
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '??';

  return (
    <div className="container mx-auto">
      {/* --- Header --- */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des demandes</h1>
          <p className="mt-1 text-muted-foreground">
            Gérez et suivez les demandes pour devenir enseignant
          </p>
        </div>

        {!isPageLoading && pagination && pagination.total > 0 && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{pagination.total}</span>{' '}
            demande{pagination.total > 1 ? 's' : ''} au total
          </div>
        )}
      </div>

      {isPageLoading ? (
        <RequestsTableSkeleton />
      ) : requests.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <RequestEmptyDemo />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-muted/40 hover:bg-muted/40">
                <TableHead className="h-12 px-4 font-medium">Utilisateur</TableHead>
                <TableHead className="h-12 px-4 font-medium">Email</TableHead>
                <TableHead className="h-12 px-4 font-medium">Domaine</TableHead>
                <TableHead className="h-12 px-4 text-center font-medium">Statut</TableHead>
                <TableHead className="h-12 px-4 font-medium">Date</TableHead>
                <TableHead className="h-12 w-32 px-4 text-center font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => {
                const updating = isRequestUpdating(req.id);

                return (
                  <TableRow
                    key={req.id}
                    className="cursor-pointer border-b last:border-0 transition-colors hover:bg-muted/40"
                    onClick={() => openDetails(req)}
                  >
                    <TableCell className="h-16 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 border">
                          <AvatarImage src={req.user?.profile_picture ?? undefined} alt={req.user?.name} />
                          <AvatarFallback className="bg-orange-100 text-xs font-semibold text-orange-700">
                            {getInitials(req.user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium leading-none">{req.user?.name || '—'}</p>
                      </div>
                    </TableCell>

                    <TableCell className="h-16 px-4 text-muted-foreground">
                      {req.user?.email || '—'}
                    </TableCell>

                    <TableCell className="h-16 px-4">
                      <Badge variant="secondary" className="rounded-full font-normal">
                        {req.domain?.name || '—'}
                      </Badge>
                    </TableCell>

                    <TableCell className="h-16 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      {updating ? (
                        <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-muted px-3 text-sm font-medium text-muted-foreground">
                          <Loader2 className="size-3.5 animate-spin" />
                          Mise à jour
                        </span>
                      ) : req.status === 'pending' ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              disabled={isAnyUpdatePending}
                              className="inline-flex h-8 items-center gap-1 rounded-full bg-amber-500/10 px-3 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 disabled:pointer-events-none disabled:opacity-50 dark:text-amber-400"
                            >
                              <span className="size-1.5 rounded-full bg-amber-500" />
                              En attente
                              <ChevronDown className="size-3.5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="center" className="w-40 animate-in fade-in-0 zoom-in-95">
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(req.id, 'approved')}
                              className="cursor-pointer gap-2 text-emerald-700 focus:bg-emerald-500/10 focus:text-emerald-700 dark:text-emerald-400"
                            >
                              <Check className="size-4" />
                              Approuver
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(req.id, 'rejected')}
                              className="cursor-pointer gap-2 text-rose-700 focus:bg-rose-500/10 focus:text-rose-700 dark:text-rose-400"
                            >
                              <X className="size-4" />
                              Rejeter
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <StatusBadge status={req.status} />
                      )}
                    </TableCell>

                    <TableCell className="h-16 px-4 font-mono text-sm text-muted-foreground">
                      {req.created_at ? format(new Date(req.created_at), 'dd MMM yyyy', { locale: fr }) : '—'}
                    </TableCell>

                    <TableCell className="h-16 px-4" onClick={(e) => e.stopPropagation()}>
                      <TooltipProvider>
                        <div className="flex items-center justify-center gap-1.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-full hover:bg-muted"
                                onClick={() => openDetails(req)}
                              >
                                <Eye className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Voir les détails</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
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
        <div className="mt-8 flex justify-center border-t py-6">
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
                        className={
                          pageNum === currentPage
                            ? 'bg-orange-500 text-white hover:bg-orange-600 hover:text-white'
                            : ''
                        }
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

      {/* --- Detail sheet --- */}
      <Sheet open={!!selectedRequest} onOpenChange={closeDetails}>
        <SheetContent className="overflow-y-auto sm:max-w-lg md:max-w-xl">
          {selectedRequest ? (
            <>
              <SheetHeader className="mb-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12 border">
                    <AvatarImage
                      src={selectedRequest.user?.profile_picture ?? undefined}
                      alt={selectedRequest.user?.name}
                    />
                    <AvatarFallback className="bg-orange-100 font-semibold text-orange-700">
                      {getInitials(selectedRequest.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-xl leading-tight">
                      {selectedRequest.user?.name || selectedRequest.user?.email || '—'}
                    </SheetTitle>
                    <SheetDescription className="mt-0.5">
                      Demande #{selectedRequest.id} · {selectedRequest.domain?.name}
                    </SheetDescription>
                  </div>
                </div>

                {selectedRequest.status === 'pending' ? (
                  <Badge
                    variant="outline"
                    className="w-fit gap-1.5 rounded-full border-0 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-700 dark:text-amber-400"
                  >
                    <span className="size-1.5 rounded-full bg-amber-500" />
                    En attente de traitement
                  </Badge>
                ) : (
                  <StatusBadge status={selectedRequest.status} />
                )}
              </SheetHeader>

              <div className="space-y-6">
                {/* Info principale */}
                <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4">
                  <DetailField label="Email" value={selectedRequest.user?.email || '—'} />
                  <DetailField
                    label="Soumise le"
                    value={new Date(selectedRequest.created_at).toLocaleString('fr-FR', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  />
                </div>

                {/* Liens */}
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Liens & références
                  </p>

                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <Linkedin className="size-4 shrink-0 text-muted-foreground" />
                    {selectedRequest.linkedin_url ? (
                      <a
                        href={selectedRequest.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center gap-1 truncate text-sm text-orange-600 hover:underline"
                      >
                        <span className="truncate">{selectedRequest.linkedin_url}</span>
                        <ExternalLink className="size-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-sm italic text-muted-foreground">Non renseigné</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <FolderGit2 className="size-4 shrink-0 text-muted-foreground" />
                    {selectedRequest.project_url ? (
                      <Link
                        href={selectedRequest.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center gap-1 truncate text-sm text-orange-600 hover:underline"
                      >
                        <span className="truncate">{selectedRequest.project_url}</span>
                        <ExternalLink className="size-3 shrink-0" />
                      </Link>
                    ) : (
                      <span className="text-sm italic text-muted-foreground">Non renseigné</span>
                    )}
                  </div>
                </div>

                {/* Motivation */}
                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <MessageSquareText className="size-3.5" />
                    Lettre de motivation
                  </p>
                  <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed">
                    {selectedRequest.motivation || "Aucune lettre de motivation n'a été fournie."}
                  </div>
                </div>

                {/* Commentaire admin */}
                {selectedRequest.admin_comment && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Commentaire de l&apos;administrateur
                    </p>
                    <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-relaxed dark:border-rose-900/40 dark:bg-rose-950/30">
                      {selectedRequest.admin_comment}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4 py-10">
              <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-40 w-full animate-pulse rounded bg-muted" />
              <div className="h-24 w-full animate-pulse rounded bg-muted" />
            </div>
          )}

          <SheetFooter className="mt-8 border-t pt-4">
            <Button variant="outline" onClick={closeDetails} className="w-full sm:w-auto">
              Fermer
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}