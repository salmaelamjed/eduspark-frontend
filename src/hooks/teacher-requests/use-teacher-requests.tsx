
'use client';
import { useState, useEffect, useCallback } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { requestsApi } from '@/api/requests';
import { useAuth } from '@/context/auth-context';
import {
  CreateTeacherRequestProps,
  CreateTeacherRequestSchema,
} from '@/schema/request.schema';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaginatedTeacherRequests, UpdateTeacherRequestPayload } from '@/types/request';

const QUERY_KEY = "teacher-requests";
interface UseTeacherRequestsOptions {
  page?: number;
  enabled?: boolean;
}


export const useCreateTeacherRequest = () => {
  const { token } = useAuth();

  const form = useForm<CreateTeacherRequestProps>({
    resolver: zodResolver(CreateTeacherRequestSchema),
    defaultValues: {
      domain_id: undefined,
      linkedin_url: '',
      project_url: '',
      motivation: '',
    },
    mode: 'onChange',
  });

  const mutation = useMutation({
    mutationFn: (values: CreateTeacherRequestProps) =>
      requestsApi.create(values, token!),
    onSuccess: (response) => {
      toast.success('Demande envoyée avec succès', {
        description: response?.message || 'En attente de validation.',
      });
      form.reset();        
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Erreur lors de l’envoi. Réessayez.';
      toast.error('Échec de l’envoi', { description: msg });
      console.error(error);
      form.reset();  
    },
  });

  return {
    form,
    isSubmitting: mutation.isPending,
    onSubmit: form.handleSubmit((values) => mutation.mutate(values)),
    mutationError: mutation.error,
  };
};


export const useTeacherRequests=(options: UseTeacherRequestsOptions = {})=>{
      const { page = 1, enabled = true } = options;
      const {token}=useAuth()
        return useQuery<PaginatedTeacherRequests>({
            queryKey: [QUERY_KEY, { page }],
            queryFn: () => requestsApi.getAll(page,token),
            enabled,
            staleTime: 1000 * 60 * 5, 
        });
}

export function useTeacherRequest(id: number | null) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => requestsApi.getOne(id!),
    enabled: id !== null,
  });
}

export function useUpdateTeacherRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      token,
    }: {
      id: number;
      data: UpdateTeacherRequestPayload;
      token: string;
    }) => requestsApi.update(id, data, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteTeacherRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string }) =>
      requestsApi.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

// Hook de pagination utilitaire
export function usePaginatedTeacherRequests(initialPage = 1) {
  const queryClient = useQueryClient();
  const {token}=useAuth()

  const query = useTeacherRequests({ page: initialPage });

  const prefetchPage = async (page: number) => {
    await queryClient.prefetchQuery({
      queryKey: [QUERY_KEY, { page }],
      queryFn: () => requestsApi.getAll(page,token),
      staleTime: 1000 * 60 * 5,
    });
  };

  const goToPage = (page: number) => {
    if (page >= 1 && (!query.data || page <= query.data.last_page)) {
      return page;
    }
    return null;
  };

  return {
    ...query,
    prefetchPage,
    goToPage,
    pagination: query.data
      ? {
          currentPage: query.data.current_page,
          lastPage: query.data.last_page,
          perPage: query.data.per_page,
          total: query.data.total,
          hasNextPage: query.data.current_page < query.data.last_page,
          hasPrevPage: query.data.current_page > 1,
        }
      : null,
  };
}



export function useTeacherRequestsManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const { token } = useAuth();

  const {
    data,
    isLoading: isPageLoading,
    prefetchPage,
    pagination,
    error: pageError,
  } = usePaginatedTeacherRequests(currentPage);

  const updateMutation = useUpdateTeacherRequest();
  const deleteMutation = useDeleteTeacherRequest();

  // Préchargement des pages voisines
  useEffect(() => {
    if (pagination?.hasNextPage) prefetchPage(currentPage + 1);
    if (pagination?.hasPrevPage) prefetchPage(currentPage - 1);
  }, [currentPage, pagination, prefetchPage]);

  // Handler changement de statut
  const handleStatusChange = useCallback(
    (requestId: number, newStatus: 'pending' | 'approved' | 'rejected') => {
      if (!token) {
        toast.error('Vous devez être connecté');
        return;
      }

      updateMutation.mutate(
        { id: requestId, data: { status: newStatus }, token },
        {
          onSuccess: () => {
            const label =
              newStatus === 'approved'
                ? 'Approuvée'
                : newStatus === 'rejected'
                ? 'Rejetée'
                : 'En attente';
            toast.success(`Statut mis à jour : ${label}`);
          },
          onError: () => {
            toast.error('Erreur lors de la mise à jour du statut');
          },
        }
      );
    },
    [token, updateMutation]
  );

  // Handler suppression
  const handleDelete = useCallback(
    (id: number) => {
      if (!token) {
        toast.error('Vous devez être connecté');
        return;
      }
      if (!confirm('Vraiment supprimer cette demande ?')) return;

      deleteMutation.mutate(
        { id, token },
        {
          onSuccess: () => toast.success('Demande supprimée avec succès'),
          onError: () => toast.error('Erreur lors de la suppression'),
        }
      );
    },
    [token, deleteMutation]
  );

  // Fonction pour savoir si une ligne est en cours de mise à jour
  const isRequestUpdating = useCallback(
    (requestId: number) =>
      updateMutation.isPending && updateMutation.variables?.id === requestId,
    [updateMutation.isPending, updateMutation.variables?.id]
  );

  const requests = (data?.data ) ?? [];
  const hasPagination = !!pagination && pagination.lastPage > 1;

  return {
    currentPage,
    setCurrentPage,
    requests,
    pagination,
    isPageLoading,
    pageError,
    hasPagination,

    // Mutations
    isAnyUpdatePending: updateMutation.isPending,
    isAnyDeletePending: deleteMutation.isPending,

    // Handlers
    handleStatusChange,
    handleDelete,
    isRequestUpdating,

    // Utilitaires
    totalRequests: data?.total ?? 0,
  };
}