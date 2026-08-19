"use client";

import { useCallback, useState } from "react";
import { adminApi } from "@/api/admin";
import { useAdminBase } from "./useAdminBase";

interface MonthlyRevenue {
  month: string;
  year: number;
  revenue: number;
}

interface RevenueByMonthData {
  months: MonthlyRevenue[];
  total: number;
  growth_percent: number | null;
}

export function useAdminRevenue() {
  const { handleRequest, isLoading, error } = useAdminBase();
  const [data, setData] = useState<RevenueByMonthData | null>(null);

  const fetchRevenue = useCallback(
    async (months = 12) => {
      const result = await handleRequest((token) =>
        adminApi.getRevenueByMonth(token, months),
      );
      if (result) setData(result);
      return result;
    },
    [handleRequest],
  );

  return { data, isLoading, error, fetchRevenue };
}
