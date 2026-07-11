'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { domainsApi } from '@/api/domains';
import type { Domain, DomainResponse, UpdateDomainPaylaod } from '@/types/domain';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';
import { getErrorMessage } from '@/components/ErrorMessage';



interface UseGetDomainsReturn {
  domains: Domain[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer la liste de tous les domaines
 */
export const useGetDomains = (): UseGetDomainsReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [domains, setDomains] = useState<Domain[] >([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDomains = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await domainsApi.getAll();
         if(response){
          setDomains(response);
         }
      
    } catch (err: unknown) {
       console.error("Erreur lors de la récupération des domaines :", err);
       setError(
         getErrorMessage(
           err,
           "Une erreur est survenue lors du chargement des domaines",
         ),
       );
       setDomains([]);
    } finally {
      setLoading(false);
    }
  },[]);

  // Appel automatique au montage du composant
  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]); 

  return {
    domains,
    loading,
    error,
    refetch: fetchDomains, 
  };
};
interface UseDomainsOptions {
  page?: number;
  enabled?: boolean;
}


export const useDomains = (options: UseDomainsOptions = {}) => {
  const { page = 1, enabled = true } = options;
  const { token } = useAuth();

  return useQuery({
              queryKey: ["get-domains", { page }],
              queryFn: () => domainsApi.getDomains(page,token),
              enabled,
              staleTime: 1000 * 60 * 5, //5 minutes
          });
};

export function useDomain(id: number | null) {
  const {token}=useAuth()
  return useQuery({
    queryKey: ['domains', id],
    queryFn: () => domainsApi.show(id!,token),
    enabled: id !== null,
  });
}


export function useUpdateDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      token,
    }: {
      id: number;
      data: UpdateDomainPaylaod;
      token: string;
    }) => domainsApi.update(id, data, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      queryClient.invalidateQueries({ queryKey: ["domains", variables.id] });
    },
  });
}

export function useDeleteDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string }) =>
      domainsApi.delete(id, token),

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["domains"] });

      const previousDomains = queryClient.getQueryData<DomainResponse[]>([
        "get-domains",
        { page: 1 },
      ]);
      // Retirer l'élément de la liste locale
      queryClient.setQueryData<DomainResponse[]>(["domains"], (old) =>
        old ? old.filter((domain) => domain.id !== id) : [],
      );
      return { previousDomains };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["get-domains"],
        context?.previousDomains,
      );
      toast.error("Erreur lors de la suppression");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
  });
}


// Hook de pagination utilitaire
export function usePaginatedDomains(initialPage = 1) {
  const queryClient = useQueryClient();
  const {token}=useAuth()

  const query = useDomains({ page: initialPage });

  const prefetchPage = async (page: number) => {
    await queryClient.prefetchQuery({
      queryKey: ['get-domains', { page }],
      queryFn: () => domainsApi.getDomains(page,token),
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


export function useDomainsManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const { token } = useAuth();

  const {
    data,
    isLoading: isPageLoading,
    prefetchPage,
    pagination,
    error: pageError,
  } = usePaginatedDomains(currentPage);

  const updateMutation = useUpdateDomain();
  const deleteMutation = useDeleteDomain();

  // Préchargement des pages voisines
  useEffect(() => {
    if (pagination?.hasNextPage) prefetchPage(currentPage + 1);
    if (pagination?.hasPrevPage) prefetchPage(currentPage - 1);
  }, [currentPage, pagination, prefetchPage]);

  const domains = data?.data ?? [];
  const hasPagination = !!pagination && pagination.lastPage > 1;

  // Handler suppression
  const handleDelete = useCallback(
    (id: number) => {
      if (!token) {
        toast.error("Vous devez être connecté");
        return;
      }
      if (!confirm("Vraiment supprimer ce domaine ?")) return;

      deleteMutation.mutate(
        { id, token },
        {
          onSuccess: () => toast.success("domaine supprimé avec succès"),
          onError: () => toast.error("Erreur lors de la suppression"),
        },
      );
    },
    [token, deleteMutation],
  );

   const isDomainUpdating = useCallback(
      (domainId: number) =>
        updateMutation.isPending && updateMutation.variables?.id === domainId,
      [updateMutation.isPending, updateMutation.variables?.id]
    );

  return {
    currentPage,
    setCurrentPage,
    domains,
    pagination,
    isPageLoading,
    pageError,
    hasPagination,

    // Mutations
    isAnyUpdatePending: updateMutation.isPending,
    isAnyDeletePending: deleteMutation.isPending,

    //handlers
    handleDelete,
    isDomainUpdating,

    // Utilitaires
    totalDomains: data?.total ?? 0,
  };
}

export const useGetDomainsWithoutPagination=()=>{
  const [domains, setDomains]=useState()
  const [loading , setLoading ]=useState<boolean>(false)
  const [error , setError]=useState(null);
  const ongetDomains=async()=>{
    setLoading(true)
    setError(null)
    try {
      const response = await domainsApi.getAll();
      if(response){
        setDomains(response);
      } 
    } catch (error) {
      console.log(error
      )
    }
  }
  return{
    domains,
    loading,
    error
  }

}