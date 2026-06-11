"use client";

import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

const users = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Admin",
    status: "active",
    joinDate: "2023-09-12",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Bruno Silva",
    email: "bruno.silva@example.com",
    role: "Editor",
    status: "invited",
    joinDate: "2024-01-05",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Clara Mendes",
    email: "clara.mendes@example.com",
    role: "Viewer",
    status: "inactive",
    joinDate: "2024-02-18",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "David Park",
    email: "david.park@example.com",
    role: "Editor",
    status: "active",
    joinDate: "2024-05-22",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
];

function getStatusBadge(status: string) {
  const variants: Record<string, string> = {
    active: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    invited: "bg-amber-500/15 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    inactive: "bg-rose-500/15 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  };

  return (
    <Badge
      variant="outline"
      className={`border-0 capitalize ${variants[status] || "bg-gray-500/15 text-gray-700"}`}
    >
      {status}
    </Badge>
  );
}

export default function StudentsPage() {
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const isBusy = (id: string) => pendingAction === id;

  const handleAction = (id: string, action: string) => {
    setPendingAction(id);
    setTimeout(() => {
      setPendingAction(null);
      console.log(`Action "${action}" sur l'étudiant ID: ${id}`);
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 py-6 lg:py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Étudiants</h1>
          <p className="text-muted-foreground mt-1">
            Gérez et suivez vos étudiants
          </p>
        </div>

        <Link href="/students/create">
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-3xl px-6 py-6 flex items-center gap-2 transition-all"
          >
            <PlusCircle className="h-5 w-5" />
            Ajouter un étudiant
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="border-b hover:bg-transparent">
              <TableHead className="h-12 px-4 font-medium">Étudiant</TableHead>
              <TableHead className="h-12 px-4 font-medium">Email</TableHead>
              <TableHead className="h-12 px-4 font-medium">Rôle</TableHead>
              <TableHead className="h-12 px-4 font-medium text-center">Statut</TableHead>
              <TableHead className="h-12 px-4 font-medium">Date de jointure</TableHead>
              <TableHead className="h-12 w-[180px] px-4 font-medium text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                {/* Colonne Étudiant avec Avatar + Nom */}
                <TableCell className="h-16 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-orange-100 text-orange-700 font-medium">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="h-16 px-4 text-muted-foreground">
                  {user.email}
                </TableCell>

                <TableCell className="h-16 px-4">{user.role}</TableCell>

                <TableCell className="h-16 px-4 text-center">
                  {getStatusBadge(user.status)}
                </TableCell>

                <TableCell className="h-16 px-4 text-muted-foreground font-mono">
                  {user.joinDate}
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
                            onClick={() => handleAction(user.id, "view")}
                            disabled={isBusy(user.id)}
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
                            className="h-8 w-8"
                            onClick={() => handleAction(user.id, "edit")}
                            disabled={isBusy(user.id)}
                          >
                            <Edit className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Modifier</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive hover:bg-destructive hover:text-white h-8 w-8"
                            onClick={() => handleAction(user.id, "delete")}
                            disabled={isBusy(user.id)}
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}