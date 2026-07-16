// hooks/courses/use-course-access.ts
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
  const { token, isAuthenticated, loading: authLoading } = useAuth();
  const [access, setAccess] = useState<CourseAccess | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAccess = useCallback(async () => {
    // Tant que l'auth n'a pas fini de se résoudre, on NE DÉCIDE RIEN —
    // rester en loading=true plutôt que de renvoyer access=null comme
    // si l'accès était refusé (ou pire, silencieusement ignoré par le
    // guard qui traite null comme "pas encore bloquant").
    if (authLoading) {
      return;
    }

    if (!courseId) {
      setLoading(false);
      return;
    }

    if (!isAuthenticated || !token) {
      // Auth résolue : l'utilisateur n'est vraiment pas connecté.
      // C'est un résultat définitif, pas un état transitoire.
      setAccess({
        course_id: Number(courseId),
        has_access: false,
        reason: "not_purchased",
        is_free: false,
      });
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
      // Échec réseau : traiter comme non-résolu plutôt que comme accès
      // accordé. On garde access=null et loading=false ; l'appelant doit
      // traiter null comme "bloquer par défaut", jamais comme "autoriser".
      setAccess(null);
    } finally {
      setLoading(false);
    }
  }, [courseId, isAuthenticated, token, authLoading]);

  useEffect(() => {
    fetchAccess();
  }, [fetchAccess]);

  return { access, loading, refetch: fetchAccess };
}
