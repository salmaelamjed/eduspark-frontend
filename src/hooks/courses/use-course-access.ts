import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/client";

interface CourseAccess {
  course_id: number;
  has_access: boolean;
  reason: "free" | "owner" | "enrolled" | "not_purchased";
  is_free: boolean;
}

export function useCourseAccess(courseId: number | string | null) {
  const { token, isAuthenticated } = useAuth();
  const [access, setAccess] = useState<CourseAccess | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAccess = useCallback(async () => {
    if (!courseId || !isAuthenticated || !token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await apiClient.get<CourseAccess>(
        `/courses/${courseId}/access`,
        token,
      );
      setAccess(data);
    } catch {
      setAccess(null);
    } finally {
      setLoading(false);
    }
  }, [courseId, isAuthenticated, token]);

  useEffect(() => {
    fetchAccess();
  }, [fetchAccess]);

  return { access, loading, refetch: fetchAccess };
}
