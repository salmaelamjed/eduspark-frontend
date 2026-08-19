// hooks/admin/useAdminTopCours.ts
import { useState, useEffect, useCallback, useRef } from "react";
import type {
  TopCourse,
  TopCoursesParams,
  UseTopCoursesReturn,
  UseTopCoursesOptions,
} from "@/types/TopCourses.types";
import { adminApi } from "@/api/admin";
import { useAuth } from "@/context/auth-context";

export function useTopCourses(
  options: UseTopCoursesOptions = {},
): UseTopCoursesReturn {
  const { limit = 5, by = "revenue", autoFetch = true } = options;
  const { token } = useAuth();

  const [courses, setCourses] = useState<TopCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchTopCourses = useCallback(
    async (params?: TopCoursesParams) => {
      if (!token) {
        setError(new Error("Token manquant"));
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const finalLimit = params?.limit ?? limit;
        const finalBy = params?.by ?? by;

        const queryString = new URLSearchParams({
          limit: String(finalLimit),
          by: finalBy,
        }).toString();

        const response = await adminApi.getTopCourses(token, queryString);

        if (isMounted.current) {
          setCourses(response.data);
        }
      } catch (err) {
        if (isMounted.current) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to fetch top courses"),
          );
          setCourses([]);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    },
    [token, limit, by],
  );

  const reset = useCallback(() => {
    setCourses([]);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (autoFetch && token) {
      fetchTopCourses();
    }
  }, [autoFetch, token, fetchTopCourses]);

  return {
    courses,
    loading,
    error,
    fetchTopCourses,
    reset,
  };
}
