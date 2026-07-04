"use client";

import {
  coursesApi,
  PaginatedCourses,
  CourseListFilters,
  CourseDetail,
} from "@/api/courses";
import { getErrorMessage } from "@/components/ErrorMessage";
import { useAuth } from "@/context/auth-context";
import {
  CourseCreationProps,
  CourseCreationSchema,
} from "@/schema/course.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface BackendBlock {
  type: string;
  order: number;
  is_preview: number;
  file?: File | null;
  [key: string]: unknown;
}

interface BackendLesson {
  title: string;
  is_preview: number;
  order: number;
  blocks: BackendBlock[];
}
interface BackendModule {
  title: string;
  description: string | null;
  order: number;
  lessons: BackendLesson[];
}

interface UseCoursesProps {
  getModulesForBackend?: () => BackendModule[];
}

// ====================== HOOK DE CRÉATION ======================
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
      language: "fr",
      is_free: true,
      price: 0,
      thumbnail: undefined,
      modules: [
        {
          title: "",
          description: null,
          order: 0,
          lessons: [
            {
              title: "",
              slug: "",
              order: 0,
              is_preview: false,
              blocks: [],
            },
          ],
        },
      ],
    },
    mode: "onChange",
  });

 const createCourse = async (formData: CourseCreationProps) => {
   setLoading(true);

   try {
     if (!token) {
       toast.error("Vous devez être connecté");
       return;
     }

     let modules = getModulesForBackend?.() || [];

     const payload = new FormData();

     // Données principales
     payload.append("title", formData.title.trim());
     payload.append("description", formData.description.trim());
     payload.append("level", formData.level);
     payload.append("language", formData.language);
     payload.append("is_free", formData.is_free ? "1" : "0");
     payload.append(
       "price",
       formData.is_free ? "0" : String(formData.price || 0),
     );

     if (formData.thumbnail?.[0]) {
       payload.append("thumbnail", formData.thumbnail[0]);
     }

     // === GESTION DES FICHIERS MÉDIAS ===

    modules = modules.map((mod, modIdx: number) => ({
      ...mod,
      lessons: mod.lessons.map((lesson, lesIdx: number) => ({
        ...lesson,
        blocks: lesson.blocks.map((block, blockIdx: number) => {
          const { file, ...rest } = block; 

          if (
            ["image", "video", "audio", "file"].includes(block.type) &&
            file instanceof File
          ) {
            const fileKey = `modules[${modIdx}][lessons][${lesIdx}][blocks][${blockIdx}][media_url]`;
            payload.append(fileKey, file); 
          }

          return rest;
        }),
      })),
    }));
    payload.append("modules", JSON.stringify(modules));

     const response = await coursesApi.create(payload, token);

     toast.success(response?.message || "Cours créé avec succès");
     router.push("/dashboard/courses");
   } catch (error: unknown) {
     toast.error(getErrorMessage(error, "Erreur lors de la création"));
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

// ====================== HOOK POUR TOUS LES COURS (Public) ======================
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
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Une erreur est survenue"));
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

  return { courses, loading, error, getCourses };
};

// ====================== NOUVEAU HOOK : MES COURS (Teacher) ======================
export const useMyCourses = (initialFilters: CourseListFilters = {}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<PaginatedCourses | null>(null);
  const [error, setError] = useState<string | null>(null);
   const {token}=useAuth()
  


  const getMyCourses = useCallback(async (filters: CourseListFilters = {}) => {

    setLoading(true);
    setError(null);

    try {
      const response = await coursesApi.getMyCourses(filters,token as string );
      setCourses(response);
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Impossible de charger vos cours");
      setError(message);
      setCourses(null);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    getMyCourses(initialFilters);
  }, [initialFilters, getMyCourses]);

  return {
    courses,
    loading,
    error,
    getMyCourses,
    refetch: () => getMyCourses(initialFilters),
  };
};

// ====================== HOOK DÉTAIL COURS ======================
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
      const response = await coursesApi.getOne(courseId);
      setCourse(response ?? null);
    } catch (err: unknown) {
     setError(getErrorMessage(err, "Impossible de charger les détails du cours"));
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

// ====================== HOOK DÉTAIL COURS PAR SLUG ======================
export const useCourseDetailBySlug = (slug: string | null) => {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseBySlug = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await coursesApi.getBySlug(slug);
      setCourse(response ?? null);
    } catch (err: unknown) {
      setError(
        getErrorMessage(err, "Impossible de charger les détails du cours"),
      );
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchCourseBySlug();
  }, [fetchCourseBySlug]);

  return {
    course,
    loading,
    error,
    refetch: fetchCourseBySlug,
    isSuccess: !!course && !error,
  };
};