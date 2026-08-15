// src/api/teacher/index.ts

import { apiClient } from "@/lib/client";
import type {
  CourseStatsResponse,
  TeacherDashboardResponse,
} from "@/types/dashboard";
import type {
  CourseStudentsResponse,
  DashboardParams,
  StudentDetailResponse,
  StudentListParams,
  StudentListResponse,
} from "@/types/student";

const BASE = "/teacher";

/**
 * Helper pour construire les query params
 */
const buildQuery = (params?: Record<string, any>) => {
  if (!params) return "";
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
};

export const teacherApi = {
  // ======================
  // GESTION DES ÉTUDIANTS
  // ======================

  /**
   * Liste de tous les étudiants inscrits aux cours du teacher connecté
   */
  listStudents: (token: string, params?: StudentListParams) =>
    apiClient.get<StudentListResponse>(
      `${BASE}/students${buildQuery(params)}`,
      token,
    ),

  /**
   * Détails d’un étudiant + ses inscriptions chez ce teacher
   */
  getStudent: (studentId: number, token: string) =>
    apiClient.get<StudentDetailResponse>(
      `${BASE}/students/${studentId}`,
      token,
    ),

  /**
   * Liste des étudiants d’un cours précis
   */
  getStudentsByCourse: (courseId: number, token: string) =>
    apiClient.get<CourseStudentsResponse>(
      `${BASE}/courses/${courseId}/students`,
      token,
    ),

  /**
   * Mise à jour limitée d’un étudiant (ex: is_active)
   */
  updateStudent: (
    studentId: number,
    data: { is_active?: boolean; internal_notes?: string },
    token: string,
  ) =>
    apiClient.put<{
      message: string;
      student: { id: number; name: string; email: string; is_active: boolean };
    }>(`${BASE}/students/${studentId}`, data, token),

  /**
   * Supprime l’inscription d’un étudiant à un cours
   */
  removeEnrollment: (studentId: number, courseId: number, token: string) =>
    apiClient.delete<{ message: string }>(
      `${BASE}/students/${studentId}?course_id=${courseId}`,
      token,
    ),

  // ======================
  // STATISTIQUES
  // ======================

  /**
   * Dashboard principal du teacher
   */
  getDashboard: (token: string, params?: DashboardParams) =>
    apiClient.get<TeacherDashboardResponse>(
      `${BASE}/stats/dashboard${buildQuery(params)}`,
      token,
    ),

  /**
   * Statistiques détaillées d’un cours
   */
  getCourseStats: (courseId: number, token: string) =>
    apiClient.get<CourseStatsResponse>(
      `${BASE}/stats/courses/${courseId}`,
      token,
    ),
};
