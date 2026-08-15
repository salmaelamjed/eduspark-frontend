"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useTeacherStudents,
  useUpdateStudent,
  useRemoveEnrollment,
} from "@/hooks/teacher/useTeacherStudents";
import type { StudentListItem } from "@/types/student";

function getStatusBadge(isActive: boolean) {
  return (
    <Badge
      variant="outline"
      className={`border-0 capitalize ${
        isActive
          ? "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-rose-500/15 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
      }`}
    >
      {isActive ? "Actif" : "Inactif"}
    </Badge>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(price: number | null, isFree: boolean | null) {
  if (isFree) return "Gratuit";
  if (price === null || price === undefined) return "—";
  return `${price.toFixed(2)} €`;
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type RemovalTarget = {
  studentId: number;
  courseId: number;
  studentName: string;
  courseTitle: string;
};

export default function StudentsPage() {
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [removalTarget, setRemovalTarget] = useState<RemovalTarget | null>(null);

  const { students, isLoading, error, refetch } = useTeacherStudents({
    per_page: 20,
  });

  const { updateStudent, isLoading: isUpdating } = useUpdateStudent();
  const { removeEnrollment, isLoading: isRemoving } = useRemoveEnrollment();

  const isBusy = (id: string | number) => pendingAction === String(id);

  const handleToggleActive = async (studentId: number, currentStatus: boolean) => {
    setPendingAction(String(studentId));
    try {
      await updateStudent(studentId, { is_active: !currentStatus });
      await refetch();
    } catch {
      // Erreur déjà affichée via toast dans le hook.
    } finally {
      setPendingAction(null);
    }
  };

  const confirmRemove = async () => {
    if (!removalTarget) return;
    const { studentId, courseId } = removalTarget;

    setPendingAction(String(studentId));
    try {
      await removeEnrollment(studentId, courseId);
      await refetch();
    } catch {
      // Erreur déjà affichée via toast dans le hook.
    } finally {
      setPendingAction(null);
      setRemovalTarget(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-muted-foreground">Chargement des étudiants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
          Réessayer
        </Button>
      </div>
    );
  }

  const list: StudentListItem[] = students?.data ?? [];
  const total = students?.meta?.total ?? 0;

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Étudiants</h1>
          <p className="text-muted-foreground mt-1">
            {total} étudiant{total > 1 ? "s" : ""} inscrit{total > 1 ? "s" : ""}
          </p>
        </div>

        <Link href="/students/create">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-3xl px-6 py-6 flex items-center gap-2 transition-all">
            <PlusCircle className="h-5 w-5" />
            Ajouter un étudiant
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="border-b hover:bg-transparent">
              <TableHead className="h-12 px-4 font-medium">Étudiant</TableHead>
              <TableHead className="h-12 px-4 font-medium text-center">Pays</TableHead>
              <TableHead className="h-12 px-4 font-medium text-center">Statut</TableHead>
              <TableHead className="h-12 px-4 font-medium">Cours</TableHead>
              <TableHead className="h-12 px-4 font-medium text-center">Niveau</TableHead>
              <TableHead className="h-12 px-4 font-medium text-center">Prix</TableHead>
              <TableHead className="h-12 px-4 font-medium text-center">
                Date d&apos;inscription
              </TableHead>
              <TableHead className="h-12 w-16 px-4 font-medium text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  Aucun étudiant inscrit pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              list.map((item: StudentListItem) => {
                const student = item.student;
                const course = item.course;
                const busy = isBusy(student.id);

                return (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    {/* Étudiant */}
                    <TableCell className="h-16 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={
                              student.profile_picture ||
                              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                            }
                            alt={student.name}
                          />
                          <AvatarFallback className="bg-orange-100 text-orange-700 font-medium">
                            {initials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Pays */}
                    <TableCell className="h-16 px-4 text-muted-foreground">
                      {student.country || "—"}
                    </TableCell>

                    {/* Statut */}
                    <TableCell className="h-16 px-4 text-center">
                      {getStatusBadge(student.is_active)}
                    </TableCell>

                    {/* Cours */}
                    <TableCell className="h-16 px-4">
                      <p className="font-medium text-sm line-clamp-1 max-w-75">
                        {course.title}
                      </p>
                    </TableCell>

                    {/* Niveau */}
                    <TableCell className="h-16 px-4 capitalize text-muted-foreground">
                      {course.level || "—"}
                    </TableCell>

                    {/* Prix */}
                    <TableCell className="h-16 px-4 text-muted-foreground">
                      {formatPrice(course.price, course.is_free)}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="h-16 px-4 text-muted-foreground font-mono text-sm">
                      {formatDate(item.enrolled_at)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="h-16 px-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={busy}
                            aria-label="Actions"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/students/${student.id}`}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Eye className="size-4" />
                              Voir détails
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer"
                            disabled={isUpdating}
                            onSelect={() => handleToggleActive(student.id, student.is_active)}
                          >
                            <Edit className="size-4" />
                            {student.is_active ? "Désactiver" : "Activer"}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                            disabled={isRemoving}
                            onSelect={() =>
                              setRemovalTarget({
                                studentId: student.id,
                                courseId: course.id,
                                studentName: student.name,
                                courseTitle: course.title,
                              })
                            }
                          >
                            <Trash2 className="size-4" />
                            Retirer du cours
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de confirmation, contrôlé — indépendant du dropdown */}
      <AlertDialog
        open={removalTarget !== null}
        onOpenChange={(open) => !open && setRemovalTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retirer cet étudiant du cours ?</AlertDialogTitle>
            <AlertDialogDescription>
              {removalTarget?.studentName} sera retiré(e) de « {removalTarget?.courseTitle} ».
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={confirmRemove}
            >
              Retirer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}