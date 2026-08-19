'use client'
import { useCallback, useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle2,
  Trash2,
  UserCog,
  Search,
  X,
  Loader2,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react"
import { useAdminUsers } from "@/hooks/admin/useAdminUsers"
import { cn } from "@/lib/utils"
import { PaginationControl } from "../pagination"
import { SortableHeader, type SortDirection } from "@/components/shared/sortable-header"

// --- Style helpers -------------------------------------------------

const roleStyles: Record<string, string> = {
  teacher:
    "bg-purple-100 text-purple-700 border border-purple-400 hover:bg-purple-100",
  student:
    "bg-blue-100 text-blue-700 border border-blue-400 hover:bg-blue-100",
  admin:
    "bg-amber-100 text-amber-700 border border-amber-400 hover:bg-amber-100",
}

const roleLabels: Record<string, string> = {
  teacher: "Enseignant",
  student: "Étudiant",
  admin: "Admin",
}

function RoleBadge({ role }: { role: string }) {
  return (
    <Badge
      className={cn(
        "rounded-full px-3 py-0.5 text-xs font-medium capitalize transition-colors",
        roleStyles[role] ?? "bg-muted text-muted-foreground border border-border"
      )}
    >
      {roleLabels[role] ?? role}
    </Badge>
  )
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge
      className={cn(
        "rounded-full px-3 py-0.5 text-xs font-medium transition-colors",
        isActive
          ? "bg-emerald-100 text-emerald-700 border border-emerald-400 hover:bg-emerald-100"
          : "bg-red-100 text-red-700 border border-red-400 hover:bg-red-100"
      )}
    >
      <span
        className={cn(
          "mr-1.5 inline-block size-1.5 rounded-full",
          isActive ? "bg-emerald-500" : "bg-red-500"
        )}
      />
      {isActive ? "Actif" : "Inactif"}
    </Badge>
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// --- Component -------------------------------------------------------

export function UsersManagment() {
  const {
    users,
    pagination,
    isLoading,
    error,
    fetchUsers,
    fetchUser,
    toggleStatus,
    updateRole,
    deleteUser,
    filters,
    setFilters,
    clearFilters,
    goToPage,
  } = useAdminUsers()

  const [sort, setSort] = useState<{ key: string; direction: SortDirection } | null>(null)
  const [searchInput, setSearchInput] = useState(filters.search ?? "")
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  // --- Tri (colonnes) ---
  const handleSort = useCallback(
    (key: string, direction: SortDirection) => {
      setSort({ key, direction })
      fetchUsers({ ...filters, sort_by: key, sort_direction: direction ?? undefined, page: 1 })
    },
    [filters, fetchUsers]
  )

  // --- Recherche debouncée ---
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setFilters({ ...filters, search: searchInput || undefined })
      fetchUsers({ ...filters, search: searchInput || undefined, page: 1 })
    }, 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  // --- Filtre rôle ---
  const handleRoleFilterChange = useCallback(
    (value: string) => {
      const role = value === "all" ? undefined : (value as "student" | "teacher" | "admin")
      setFilters({ ...filters, role })
      fetchUsers({ ...filters, role, page: 1 })
    },
    [filters, setFilters, fetchUsers]
  )

  // --- Filtre statut (aligné sur le contrôleur Laravel: 'active' | 'inactive') ---
  const handleStatusFilterChange = useCallback(
    (value: string) => {
      const status = value === "all" ? undefined : (value as "active" | "inactive")
      setFilters({ ...filters, status })
      fetchUsers({ ...filters, status, page: 1 })
    },
    [filters, setFilters, fetchUsers]
  )

  const handleClearFilters = useCallback(() => {
    setSearchInput("")
    setSort(null)
    clearFilters()
    fetchUsers({ page: 1 })
  }, [clearFilters, fetchUsers])

  const hasActiveFilters = !!filters.search || !!filters.role || !!filters.status

  // --- Actions avec loading par ligne ---
  const handleToggleStatus = useCallback(
    async (userId: number) => {
      setActionLoadingId(userId)
      await toggleStatus(userId)
      setActionLoadingId(null)
    },
    [toggleStatus]
  )

  const handleDelete = useCallback(
    async (userId: number) => {
      setActionLoadingId(userId)
      await deleteUser(userId)
      setActionLoadingId(null)
    },
    [deleteUser]
  )

  return (
    <div className="mx-auto flex w-full flex-col gap-4">
      {/* --- Toolbar: recherche + filtres --- */}
     <div className="flex flex-col gap-3 rounded-xl border bg-card/50 p-3  backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Barre de recherche */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
        <Input
          placeholder="Rechercher par nom ou email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="h-9 pl-9 pr-9 transition-all duration-200 focus-visible:ring-1 hover:border-muted-foreground/40"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Effacer la recherche"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Conteneur des filtres et actions */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Filtre : Rôle */}
        <Select
          value={filters.role ?? "all"}
          onValueChange={handleRoleFilterChange}
        >
          <SelectTrigger className="h-9 w-full sm:w-40 border-dashed focus:ring-1">
            <div className="flex items-center gap-2 truncate">
              <SlidersHorizontal className="size-3.5 text-muted-foreground" />
              <SelectValue placeholder="Rôle" />
            </div>
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all">Tous les rôles</SelectItem>
            <SelectItem value="student">Étudiant</SelectItem>
            <SelectItem value="teacher">Enseignant</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtre : Statut */}
        <Select
          value={filters.status ?? "all"}
          onValueChange={handleStatusFilterChange}
        >
          <SelectTrigger className="h-9 w-full sm:w-36 focus:ring-1">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
          </SelectContent>
        </Select>

        {/* Bouton de réinitialisation */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-9 gap-1.5 px-2.5 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <RotateCcw className="size-3.5" />
            Réinitialiser
          </Button>
        )}
      </div>
    </div>

    
      {/* --- Table --- */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead>
              <SortableHeader
                label="Utilisateur"
                sortKey="name"
                currentSort={sort}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-center">
              <SortableHeader
                label="Date d'inscription"
                sortKey="created_at"
                currentSort={sort}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead className="w-12 text-end"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center">
                <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                Aucun utilisateur trouvé.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="transition-colors hover:bg-muted/50"
              >
                <TableCell className="text-center text-sm font-bold text-muted-foreground">
                  {user.id}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarImage src={user.profile_picture ?? undefined} />
                      <AvatarFallback className="text-xs font-medium">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <RoleBadge role={user.role} />
                </TableCell>

                <TableCell>
                  <StatusBadge isActive={user.is_active} />
                </TableCell>

                <TableCell className="text-center text-sm text-muted-foreground">
                  {formatDate(user.created_at)}
                </TableCell>

                <TableCell className="text-end">
                  {actionLoadingId === user.id ? (
                    <Loader2 className="ml-auto size-4 animate-spin text-muted-foreground" />
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full transition-colors hover:bg-muted"
                        >
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Ouvrir le menu</span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-48 animate-in fade-in-0 zoom-in-95"
                      >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                          Actions
                        </DropdownMenuLabel>

                        <DropdownMenuItem
                          onClick={() => fetchUser(user.id)}
                          className="cursor-pointer gap-2"
                        >
                          <Eye className="size-4" />
                          Voir le profil
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => updateRole(user.id, user.role)}
                          className="cursor-pointer gap-2"
                        >
                          <UserCog className="size-4" />
                          Modifier le rôle
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(user.id)}
                          className="cursor-pointer gap-2"
                        >
                          {user.is_active ? (
                            <>
                              <Ban className="size-4" />
                              Désactiver
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="size-4" />
                              Activer
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => handleDelete(user.id)}
                          className="cursor-pointer gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
                        >
                          <Trash2 className="size-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pagination.total > 0 && (
        <PaginationControl
          currentPage={pagination.currentPage}
          lastPage={pagination.lastPage}
          onPageChange={goToPage}
        />
      )}
    </div>
  )
}