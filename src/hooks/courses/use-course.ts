"use client";

import { coursesApi , PaginatedCourses,CourseListFilters, CourseDetail } from "@/api/courses";
import { useAuth } from "@/context/auth-context";
import {
  CourseCreationProps,
  CourseCreationSchema,
} from "@/schema/course.schema";
import {  CourseRequestPayload } from "@/types/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Modifier pour accepter des paramètres
interface UseCoursesProps {
  getModulesForBackend?: () => any[];
}

export const UseCourses = ({ getModulesForBackend }: UseCoursesProps = {}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAuth();
  const router = useRouter();

  const methods = useForm<CourseCreationProps>({
    resolver: zodResolver(CourseCreationSchema),
    defaultValues: {
      title: "",
      description: "",
      level: "beginner",
      language: "Français",
      is_free: true,
      price: 0,
      thumbnail: undefined,
      modules: [],
    },
    mode: "onChange",
  });

  // Fonction de création qui accepte les données directement
  const createCourse = async (formData: CourseCreationProps) => {
    console.log("🔵 createCourse appelé avec:", formData);
    setLoading(true);

    try {
      if (!token) {
        toast.error("Vous devez être connecté pour créer un cours");
        setLoading(false);
        return;
      }

      if (!getModulesForBackend) {
        toast.error("Erreur: fonction getModulesForBackend non disponible");
        setLoading(false);
        return;
      }

      const modules = getModulesForBackend();
      console.log("📦 Modules récupérés:", modules);

      if (!modules || modules.length === 0) {
        toast.error("Le cours doit contenir au moins un module");
        setLoading(false);
        return;
      }

      // Vérifier que tous les modules ont des leçons
      const modulesWithoutLessons = modules.filter(
        (m) => !m.lessons || m.lessons.length === 0,
      );
      if (modulesWithoutLessons.length > 0) {
        toast.error(
          `Les modules suivants n'ont pas de leçons: ${modulesWithoutLessons.map((m) => m.title).join(", ")}`,
        );
        setLoading(false);
        return;
      }

      // Gérer l'upload de l'image
      let thumbnailUrl = "";
      if (formData.thumbnail && formData.thumbnail.length > 0) {
        const file = formData.thumbnail[0];
        console.log("🖼️ Fichier thumbnail:", file.name);
        thumbnailUrl = URL.createObjectURL(file);
        // TODO: Remplacer par un vrai upload
      }

      // Préparer le payload
      const payload: CourseRequestPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        level: formData.level,
        language: formData.language,
        is_free: formData.is_free,
        price: formData.is_free ? undefined : Number(formData.price),
        thumbnail: thumbnailUrl,
        modules: modules,
      };

      console.log("📤 Payload envoyé:", payload);

      const response = await coursesApi.create(payload, token);
      console.log("✅ Réponse API:", response);

      if (response?.course?.id) {
        toast.success(response.message || "Cours créé avec succès");
        router.push(`/dashboard/courses`);
        router.refresh();
      } else {
        toast.error("Erreur lors de la création du cours");
      }
    } catch (error: any) {
      console.error("❌ Course creation failed:", error);
      toast.error(error.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  // Version handleSubmit pour utilisation avec RHF
  const onHandleCreateCourse = methods.handleSubmit(createCourse);

  return {
    loading,
    onHandleCreateCourse,
    createCourse, // Exportez aussi la fonction directe
    methods,
  };
};

export const UseGetCourses = (initialFilters?: CourseListFilters) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<PaginatedCourses | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCourses = useCallback(async (filters?: CourseListFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await coursesApi.getAll(filters || initialFilters);
      setCourses(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setCourses(null); 
    } finally {
      setLoading(false);
    }
  },[initialFilters]);

  useEffect(() => {
    getCourses(initialFilters);
  }, [initialFilters, getCourses]);

  return {
    courses,
    loading,
    error,
    getCourses,
  };
};

export const useCourseDetail = (courseId: number | string | null) => {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await coursesApi.getOne(Number(courseId));
      // Comme ton endpoint retourne { data: [course] }
      const courseData = response.data?.[0] ?? null;
      setCourse(courseData);
    } catch (err: any) {
      setError(err?.message || "Impossible de charger les détails du cours");
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return {
    course,
    loading,
    error,
    refetch: fetchCourse,
    isSuccess: !!course && !error,
  };
};


