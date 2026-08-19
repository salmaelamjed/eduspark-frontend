"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { coursesApi } from "@/api/courses";
import type { BestCourse, GetBestCoursesParams } from "@/types/course";

interface UseBestCoursesOptions {
  autoFetch?: boolean;
  limit?: number;
}

interface UseBestCoursesReturn {
  courses: BestCourse[];
  isLoading: boolean;
  error: Error | null;
  fetchBestCourses: (params?: GetBestCoursesParams) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useBestCourses(
  options: UseBestCoursesOptions = {},
): UseBestCoursesReturn {
  const { autoFetch = true, limit = 8 } = options;

  const [courses, setCourses] = useState<BestCourse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBestCourses = useCallback(
    async (params?: GetBestCoursesParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await coursesApi.getBestCourses({ limit, ...params });
        setCourses(response.data);
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Erreur lors du chargement des meilleurs cours");
        setError(error);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    },
    [limit],
  );

  const refetch = useCallback(() => fetchBestCourses(), [fetchBestCourses]);

  useEffect(() => {
    if (autoFetch) {
      fetchBestCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch]);

  return useMemo(
    () => ({
      courses,
      isLoading,
      error,
      fetchBestCourses,
      refetch,
    }),
    [courses, isLoading, error, fetchBestCourses, refetch],
  );
}
