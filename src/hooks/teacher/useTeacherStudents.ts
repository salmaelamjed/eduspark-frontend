"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { teacherApi } from "@/api/teacher";
import {
  CourseStudentsResponse,
  StudentDetailResponse,
  StudentListParams,
  StudentListResponse,
} from "@/types/student";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { getErrorMessage } from "@/components/ErrorMessage";

export const useTeacherStudents = (params?: StudentListParams) => {
  const [students, setStudents] = useState<StudentListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // Ignore les réponses réseau obsolètes (ex: une ancienne recherche qui
  // répond après une plus récente) pour éviter d'afficher des données périmées.
  const requestId = useRef(0);

  const fetchStudents = useCallback(async () => {
    if (!token) return;

    const currentRequest = ++requestId.current;
    setIsLoading(true);
    setError(null);

    try {
      const res = await teacherApi.listStudents(token, params);
      if (currentRequest === requestId.current) setStudents(res);
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Erreur lors du chargement des étudiants",
      );
      if (currentRequest === requestId.current) setError(message);
      toast.error(message);
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, JSON.stringify(params)]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { students, isLoading, error, refetch: fetchStudents };
};

/**
 * Détails d'un étudiant
 */
export const useStudent = (studentId: number | null) => {
  const [data, setData] = useState<StudentDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchStudent = useCallback(async () => {
    if (!token || !studentId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await teacherApi.getStudent(studentId, token);
      setData(res);
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Erreur lors du chargement de l'étudiant",
      );
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [token, studentId]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  return { data, isLoading, error, refetch: fetchStudent };
};

/**
 * Étudiants d'un cours
 */
export const useCourseStudents = (courseId: number | null) => {
  const [data, setData] = useState<CourseStudentsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchData = useCallback(async () => {
    if (!token || !courseId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await teacherApi.getStudentsByCourse(courseId, token);
      setData(res);
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Erreur lors du chargement des étudiants du cours",
      );
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [token, courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Mise à jour d'un étudiant
 */
export const useUpdateStudent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const updateStudent = async (
    studentId: number,
    data: { is_active?: boolean; internal_notes?: string },
  ) => {
    if (!token) throw new Error("Non authentifié");

    setIsLoading(true);
    setError(null);

    try {
      return await teacherApi.updateStudent(studentId, data, token);
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Erreur lors de la mise à jour de l'étudiant",
      );
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateStudent, isLoading, error };
};

/**
 * Supprimer une inscription.
 * Récupère le token en interne via useAuth() — pas besoin de le passer
 * manuellement, ce qui évite tout risque d'appel avec un token périmé/absent.
 */
export const useRemoveEnrollment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const removeEnrollment = async (studentId: number, courseId: number) => {
    if (!token) throw new Error("Non authentifié");

    setIsLoading(true);
    setError(null);

    try {
      return await teacherApi.removeEnrollment(studentId, courseId, token);
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Erreur lors de la suppression de l'inscription",
      );
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { removeEnrollment, isLoading, error };
};
