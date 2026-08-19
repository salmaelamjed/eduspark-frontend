'use client'

import { useCallback, useState } from "react";
import { adminApi } from "@/api/admin";
import { useAdminBase } from "./useAdminBase";
import { DashboardStats } from "@/types/Admin.types";

interface UseAdminDashboardReturn {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<DashboardStats | null>;
  clearError: () => void;
}

export function useAdminDashboard(): UseAdminDashboardReturn {
  const {  isLoading, error, handleRequest, clearError } = useAdminBase();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const fetchStats = useCallback(async (): Promise<DashboardStats | null> => {
    const data = await handleRequest((token) => adminApi.getStats(token));
    if (data) {
      setStats(data);
    }
    return data;
  }, [handleRequest]);

  return {
    stats,
    isLoading,
    error,
    fetchStats,
    clearError,
  };
}
