"use client";

import {
  coursesApi,
  PaginatedCourses,
  CourseListFilters,
  CourseDetail,
} from "@/api/courses";
import { useAuth } from "@/context/auth-context";
import { CourseCreationProps, CourseCreationSchema } from "@/schema/course.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

      const formDataPayload = new FormData();
      // 2. On ajoute les champs simples
      formDataPayload.append("title", formData.title.trim());
      formDataPayload.append("description", formData.description.trim());
      formDataPayload.append("level", formData.level);
      formDataPayload.append("language", formData.language);
      // Normalisation pro pour les booleans/numbers en FormData
      const isFreeValue = String(formData.is_free) === "true";
      formDataPayload.append("is_free", isFreeValue ? "1" : "0");
      formDataPayload.append(
        "price",
        isFreeValue ? "0" : String(formData.price),
      );

      // 3. FIX DU BUG : On ajoute le FICHIER binaire, pas l'URL
      if (formData.thumbnail && formData.thumbnail[0]) {
        formDataPayload.append("thumbnail", formData.thumbnail[0]);
      }
      // 4. On ajoute les modules (objets complexes) en les sérialisant en JSON
      formDataPayload.append("modules", JSON.stringify(modules));

      // 5. On envoie formDataPayload au lieu du payload JSON habituel
      // Note: On cast en 'any' si ton type CourseRequestPayload n'accepte pas FormData
      const response = await coursesApi.create(formDataPayload as any, token);
      // Gérer l'upload de l'image
      // let thumbnailUrl = "";
      // if (formData.thumbnail && formData.thumbnail.length > 0) {
      //   const file = formData.thumbnail[0];
      //   thumbnailUrl = URL.createObjectURL(file);
      // }

      // Préparer le payload
      // const payload: CourseRequestPayload = {
      //   title: formData.title.trim(),
      //   description: formData.description.trim(),
      //   level: formData.level,
      //   language: formData.language,
      //   is_free: String(formData.is_free) === "true" ,
      //   price: String(formData.is_free) === "true" ? 0 : Number(formData.price),
      //   thumbnail: thumbnailUrl,
      //   modules: modules,
      // };
      // const response = await coursesApi.create(payload, token);
      if (response?.course?.id) {
        toast.success(response.message || "Cours créé avec succès");
        router.push(`/dashboard/courses`);
        router.refresh();
      } else {
        toast.error("Erreur lors de la création du cours");
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  const onHandleCreateCourse = methods.handleSubmit(createCourse);

  return {
    loading,
    onHandleCreateCourse,
    createCourse, 
    methods,
  };
};

export const UseGetCourses = (initialFilters?: CourseListFilters) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<PaginatedCourses | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCourses = useCallback(
    async (filters?: CourseListFilters) => {
      setLoading(true);
      setError(null);

      try {
        const response = await coursesApi.getAll(filters || initialFilters);
        setCourses(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue",
        );
        setCourses(null);
      } finally {
        setLoading(false);
      }
    },
    [initialFilters],
  );

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

export const useCourseDetail = (courseId: number|string | null) => {
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
      const courseData = response ?? null;
      console.log("API Response:", response);

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
