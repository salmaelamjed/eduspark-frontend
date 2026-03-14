import { useState, useCallback, useMemo } from "react";

// interface PaginationMeta {
//   current_page: number;
//   last_page: number;
//   per_page: number;
//   total: number;
// }

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface UsePaginationReturn<T> {
  // État
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: T[];
  isFirstPage: boolean;
  isLastPage: boolean;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToPage: (page: number) => void;
  resetPagination: () => void;
  updateFromResponse: (response: PaginatedResponse<T>) => void;
}

export function usePagination<T>(
  initialPage = 1,
  initialPageSize = 10,
): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(0);
  const [items, setItems] = useState<T[]>([]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize],
  );

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const updateFromResponse = useCallback((response: PaginatedResponse<T>) => {
    setItems(response.data);
    setCurrentPage(response.current_page);
    setPageSize(response.per_page);
    setTotalItems(response.total);
  }, []);

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNextPage]);

  const goToPrevPage = useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [hasPrevPage]);

  const goToPage = useCallback(
    (page: number) => {
      const target = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(target);
    },
    [totalPages],
  );

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    setItems([]);
    setTotalItems(0);
  }, []);

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    totalItems,
    totalPages,
    items, // data de la page courante
    // États utiles
    isFirstPage,
    isLastPage,
    hasNextPage,
    hasPrevPage,

    // Actions
    goToNextPage,
    goToPrevPage,
    goToPage,
    resetPagination,

    // Méthode clé pour connecter avec l'API
    updateFromResponse,
  };
}