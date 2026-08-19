'use client'
import { useState, useCallback } from "react";
import { adminApi } from "@/api/admin";
import { useAdminBase } from "./useAdminBase";
import {
  CoursePurchase,
  Commission,
  ListPurchasesParams,
  ListCommissionsParams,
  LaravelPaginator,
} from "@/types/Admin.types";

interface UseAdminFinanceReturn {
  purchases: CoursePurchase[] | null;
  purchasePagination: Omit<LaravelPaginator<CoursePurchase>, "data"> | null;
  commissions: Commission[] | null;
  commissionPagination: Omit<LaravelPaginator<Commission>, "data"> | null;
  isLoading: boolean;
  error: string | null;
  validationErrors: Record<string, string[]> | null;
  fetchPurchases: (
    params?: ListPurchasesParams,
  ) => Promise<CoursePurchase[] | null>;
  fetchCommissions: (
    params?: ListCommissionsParams,
  ) => Promise<Commission[] | null>;
  clearError: () => void;
}

export function useAdminFinance(): UseAdminFinanceReturn {
  const {
    isLoading,
    error,
    validationErrors,
    handleRequestWithParams,
    clearError,
  } = useAdminBase();
  const [purchases, setPurchases] = useState<CoursePurchase[] | null>(null);
  const [purchasePagination, setPurchasePagination] = useState<Omit<
    LaravelPaginator<CoursePurchase>,
    "data"
  > | null>(null);
  const [commissions, setCommissions] = useState<Commission[] | null>(null);
  const [commissionPagination, setCommissionPagination] = useState<Omit<
    LaravelPaginator<Commission>,
    "data"
  > | null>(null);

  const fetchPurchases = useCallback(
    async (params?: ListPurchasesParams): Promise<CoursePurchase[] | null> => {
      const response = await handleRequestWithParams(
        (p, token) => adminApi.listPurchases(p, token),
        params,
      );

      if (response) {
        setPurchases(response.data);
        const { data, ...paginationData } = response;
        setPurchasePagination(paginationData);
        return response.data;
      }
      return null;
    },
    [handleRequestWithParams],
  );

  const fetchCommissions = useCallback(
    async (params?: ListCommissionsParams): Promise<Commission[] | null> => {
      const response = await handleRequestWithParams(
        (p, token) => adminApi.listCommissions(p, token),
        params,
      );

      if (response) {
        setCommissions(response.data);
        const { data, ...paginationData } = response;
        setCommissionPagination(paginationData);
        return response.data;
      }
      return null;
    },
    [handleRequestWithParams],
  );

  return {
    purchases,
    purchasePagination,
    commissions,
    commissionPagination,
    isLoading,
    error,
    validationErrors,
    fetchPurchases,
    fetchCommissions,
    clearError,
  };
}
