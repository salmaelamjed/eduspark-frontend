"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import { adminApi } from "@/api/admin";
import type {
  User,
  UsersListResponse,
  ListUsersParams,
  UpdateUserRolePayload,
} from "@/types/Admin.types";


interface UseAdminUsersOptions {
  autoFetch?: boolean;
  perPage?: number;
  initialFilters?: ListUsersParams;
}

interface UseAdminUsersReturn {
  users: User[];
  pagination: PaginationData;
  isLoading: boolean;
  error: Error | null;
  fetchUsers: (params?: ListUsersParams) => Promise<void>;
  fetchUser: (userId: number) => Promise<User | null>;
  toggleStatus: (userId: number) => Promise<void>;
  updateRole: (userId: number, role: User["role"]) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  reset: () => void;
  filters: ListUsersParams;
  setFilters: (filters: ListUsersParams) => void;
  clearFilters: () => void;
  goToPage: (page: number) => void;
  changePerPage: (perPage: number) => void;
}

interface PaginationData {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number;
  to: number;
  hasMorePages: boolean;
}

// ============================================================
// HOOK
// ============================================================

export function useAdminUsers(
  options: UseAdminUsersOptions = {},
): UseAdminUsersReturn {
  const { token } = useAuth();

  const {
    autoFetch = true,
    perPage: initialPerPage = 20,
    initialFilters = {},
  } = options;

  // --- State ---
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    lastPage: 1,
    perPage: initialPerPage,
    total: 0,
    from: 0,
    to: 0,
    hasMorePages: false,
  });
  const [filters, setFilters] = useState<ListUsersParams>({
    per_page: initialPerPage,
    ...initialFilters,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // --- Helper: Handle API Response ---
  const handleUsersResponse = useCallback((response: UsersListResponse) => {
    setUsers(response.data.data);
    setPagination({
      currentPage: response.data.current_page,
      lastPage: response.data.last_page,
      perPage: response.data.per_page,
      total: response.data.total,
      // ✅ Fix: Utiliser 0 si null
      from: response.data.from ?? 0,
      to: response.data.to ?? 0,
      hasMorePages: response.data.current_page < response.data.last_page,
    });
  }, []);

  // --- Actions ---

  const fetchUsers = useCallback(
    async (params?: ListUsersParams) => {
      if (!token) {
        setError(new Error("Token manquant"));
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const mergedParams = { ...filters, ...params };
        const response = await adminApi.listUsers(mergedParams, token);
        handleUsersResponse(response);
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Erreur lors du chargement des utilisateurs");
        setError(error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    },
    [token, filters, handleUsersResponse],
  );

  const fetchUser = useCallback(
    async (userId: number): Promise<User | null> => {
      if (!token) {
        setError(new Error("Token manquant"));
        return null;
      }

      try {
        const response = await adminApi.getUser(userId, token);
        return response.data;
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Erreur lors du chargement de l'utilisateur");
        setError(error);
        return null;
      }
    },
    [token],
  );

  const toggleStatus = useCallback(
    async (userId: number) => {
      if (!token) {
        setError(new Error("Token manquant"));
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await adminApi.toggleUserStatus(userId, token);
        await fetchUsers();
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Erreur lors du changement de statut");
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [token, fetchUsers],
  );

  const updateRole = useCallback(
    async (userId: number, role: User["role"]) => {
      if (!token) {
        setError(new Error("Token manquant"));
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const payload: UpdateUserRolePayload = { role };
        await adminApi.updateUserRole(userId, payload, token);
        await fetchUsers();
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Erreur lors du changement de rôle");
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [token, fetchUsers],
  );

  const deleteUser = useCallback(
    async (userId: number) => {
      if (!token) {
        setError(new Error("Token manquant"));
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await adminApi.deleteUser(userId, token);
        await fetchUsers();
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Erreur lors de la suppression");
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [token, fetchUsers],
  );

  const reset = useCallback(() => {
    setUsers([]);
    setPagination({
      currentPage: 1,
      lastPage: 1,
      perPage: initialPerPage,
      total: 0,
      from: 0,
      to: 0,
      hasMorePages: false,
    });
    setFilters({
      per_page: initialPerPage,
      ...initialFilters,
    });
    setError(null);
    setIsLoading(false);
  }, [initialPerPage, initialFilters]);

  const handleSetFilters = useCallback((newFilters: ListUsersParams) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // ✅ Fix: Ne pas inclure 'page' dans ListUsersParams
    }));
    // ✅ Séparer le changement de page
    if (newFilters.page) {
      // La pagination sera gérée par goToPage
    }
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      per_page: initialPerPage,
    });
  }, [initialPerPage]);

  const goToPage = useCallback(
    (page: number) => {
      if (page < 1 || page > pagination.lastPage) return;
      // ✅ Utiliser un paramètre séparé pour la page
      fetchUsers({ ...filters, page });
    },
    [pagination.lastPage, filters, fetchUsers],
  );

  const changePerPage = useCallback(
    (perPage: number) => {
      setFilters((prev) => ({ ...prev, per_page: perPage }));
      // ✅ Recharger avec la nouvelle taille de page
      fetchUsers({ ...filters, per_page: perPage, page: 1 });
    },
    [filters, fetchUsers],
  );

  // --- Auto-fetch ---
  useEffect(() => {
    if (autoFetch && token) {
      fetchUsers();
    }
  }, [autoFetch, token, fetchUsers]);

  // --- Memoized return ---
  return useMemo(
    () => ({
      users,
      pagination,
      isLoading,
      error,
      fetchUsers,
      fetchUser,
      toggleStatus,
      updateRole,
      deleteUser,
      reset,
      filters,
      setFilters: handleSetFilters,
      clearFilters,
      goToPage,
      changePerPage,
    }),
    [
      users,
      pagination,
      isLoading,
      error,
      fetchUsers,
      fetchUser,
      toggleStatus,
      updateRole,
      deleteUser,
      reset,
      filters,
      handleSetFilters,
      clearFilters,
      goToPage,
      changePerPage,
    ],
  );
}
