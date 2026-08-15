// hooks/teacher/use-dashboard.ts
"use client";

import { teacherApi } from "@/api/teacher";
import { getErrorMessage } from "@/components/ErrorMessage";
import { useAuth } from "@/context/auth-context";
import type {
  TeacherDashboardResponse,
  CourseStatsResponse,
} from "@/types/dashboard";
import type { DashboardParams } from "@/types/student";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const useTeacherDashboard = (params?: DashboardParams) => {
  const [data, setData] = useState<TeacherDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const paramsRef = useRef(params);
  paramsRef.current = params;

  const tokenRef = useRef(token);
  tokenRef.current = token;

  const fetchDashboard = useCallback(async () => {
    const currentToken = tokenRef.current;
    if (!currentToken) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await teacherApi.getDashboard(
        currentToken,
        paramsRef.current,
      );
      setData(res);
    } catch (err) {
      const errorMessage = getErrorMessage(
        err,
        "Erreur lors du chargement du tableau de bord",
      );
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
};

export const useCourseStats = (courseId: number | null) => {
  const [data, setData] = useState<CourseStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const courseIdRef = useRef(courseId);
  courseIdRef.current = courseId;

  const tokenRef = useRef(token);
  tokenRef.current = token;

  const fetchStats = useCallback(async () => {
    const currentToken = tokenRef.current;
    const currentCourseId = courseIdRef.current;

    if (!currentToken || !currentCourseId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await teacherApi.getCourseStats(
        currentCourseId,
        currentToken,
      );
      setData(res);
    } catch (err) {
      const errorMessage = getErrorMessage(
        err,
        "Erreur lors du chargement des statistiques",
      );
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (courseId) {
      fetchStats();
    }
  }, [courseId, fetchStats]);

  return { data, isLoading, error, refetch: fetchStats };
};
