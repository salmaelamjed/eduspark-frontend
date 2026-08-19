import { apiClient } from "@/lib/client";
import type {
  CommissionsListResponse,
  CourseDetailResponse,
  CoursesListResponse,
  DashboardStatsResponse,
  DomainResponse,
  DomainsListResponse,
  ListCommissionsParams,
  ListCoursesParams,
  ListPurchasesParams,
  ListTeacherRequestsParams,
  ListUsersParams,
  PurchasesListResponse,
  RejectTeacherRequestPayload,
  StoreDomainPayload,
  TeacherRequestResponse,
  TeacherRequestsListResponse,
  UpdateCourseStatusPayload,
  UpdateDomainPayload,
  UpdateUserRolePayload,
  UserDetailResponse,
  UsersListResponse,
  ApiSuccessResponse,
} from "@/types/Admin.types";
import { TopCoursesResponse } from "@/types/TopCourses.types";

const BASE = "/admin";

/**
 * Sérialise un objet de query params en query string, en ignorant
 * les valeurs `undefined` / `null` / `""` (utile pour les filtres optionnels).
 */
function buildQuery(params?: Record<string, unknown> | object): string {
  if (!params) return "";

  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.append(key, String(value));
  });

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const adminApi = {
  /* -------------------------------------------------------------------- */
  /*  Dashboard                                                           */
  /* -------------------------------------------------------------------- */

  /**
   * Statistiques globales du dashboard admin (users, courses, finance...).
   */
  getStats: (token: string) =>
    apiClient.get<DashboardStatsResponse>(`${BASE}/stats`, token),

  /* -------------------------------------------------------------------- */
  /*  Utilisateurs                                                        */
  /* -------------------------------------------------------------------- */

  /**
   * Liste paginée des utilisateurs, filtrable par role / status / search.
   */
  listUsers: (params: ListUsersParams | undefined, token: string) =>
    apiClient.get<UsersListResponse>(
      `${BASE}/users${buildQuery(params)}`,
      token,
    ),

  /**
   * Détail d'un utilisateur (inclut le nombre de cours suivis).
   */
  getUser: (userId: number, token: string) =>
    apiClient.get<UserDetailResponse>(`${BASE}/users/${userId}`, token),

  /**
   * Active / désactive le compte d'un utilisateur.
   */
  toggleUserStatus: (userId: number, token: string) =>
    apiClient.patch<UserDetailResponse>(
      `${BASE}/users/${userId}/toggle-status`,
      {},
      token,
    ),

  /**
   * Change le rôle d'un utilisateur (student / teacher / admin).
   */
  updateUserRole: (
    userId: number,
    payload: UpdateUserRolePayload,
    token: string,
  ) =>
    apiClient.patch<UserDetailResponse>(
      `${BASE}/users/${userId}/role`,
      payload,
      token,
    ),

  /**
   * Supprime définitivement un utilisateur.
   */
  deleteUser: (userId: number, token: string) =>
    apiClient.delete<ApiSuccessResponse<null>>(
      `${BASE}/users/${userId}`,
      token,
    ),

  /* -------------------------------------------------------------------- */
  /*  Demandes teacher                                                    */
  /* -------------------------------------------------------------------- */

  /**
   * Liste paginée des demandes pour devenir teacher, filtrable par status.
   */
  listTeacherRequests: (
    params: ListTeacherRequestsParams | undefined,
    token: string,
  ) =>
    apiClient.get<TeacherRequestsListResponse>(
      `${BASE}/teacher-requests${buildQuery(params)}`,
      token,
    ),

  /**
   * Approuve une demande teacher : le user passe role=teacher.
   */
  approveTeacherRequest: (teacherRequestId: number, token: string) =>
    apiClient.patch<TeacherRequestResponse>(
      `${BASE}/teacher-requests/${teacherRequestId}/approve`,
      {},
      token,
    ),

  /**
   * Rejette une demande teacher avec un commentaire admin obligatoire.
   */
  rejectTeacherRequest: (
    teacherRequestId: number,
    payload: RejectTeacherRequestPayload,
    token: string,
  ) =>
    apiClient.patch<TeacherRequestResponse>(
      `${BASE}/teacher-requests/${teacherRequestId}/reject`,
      payload,
      token,
    ),

  /* -------------------------------------------------------------------- */
  /*  Domaines                                                            */
  /* -------------------------------------------------------------------- */

  /**
   * Liste tous les domaines (avec le nombre de cours par domaine).
   */
  listDomains: (token: string) =>
    apiClient.get<DomainsListResponse>(`${BASE}/domains`, token),

  /**
   * Crée un nouveau domaine.
   */
  createDomain: (payload: StoreDomainPayload, token: string) =>
    apiClient.post<DomainResponse>(`${BASE}/domains`, payload, token),

  /**
   * Met à jour un domaine existant (champs partiels acceptés).
   */
  updateDomain: (
    domainId: number,
    payload: UpdateDomainPayload,
    token: string,
  ) =>
    apiClient.patch<DomainResponse>(
      `${BASE}/domains/${domainId}`,
      payload,
      token,
    ),

  /**
   * Supprime un domaine (refusé si des cours y sont encore rattachés).
   */
  deleteDomain: (domainId: number, token: string) =>
    apiClient.delete<ApiSuccessResponse<null>>(
      `${BASE}/domains/${domainId}`,
      token,
    ),

  /* -------------------------------------------------------------------- */
  /*  Cours (modération)                                                  */
  /* -------------------------------------------------------------------- */

  /**
   * Liste paginée des cours, filtrable par status / domain_id / teacher_id.
   */
  listCourses: (params: ListCoursesParams | undefined, token: string) =>
    apiClient.get<CoursesListResponse>(
      `${BASE}/courses${buildQuery(params)}`,
      token,
    ),

  /**
   * Détail d'un cours (avec domaine, teacher, modules et lessons).
   */
  getCourse: (courseId: number, token: string) =>
    apiClient.get<CourseDetailResponse>(`${BASE}/courses/${courseId}`, token),

  /**
   * Change le statut de modération d'un cours (draft / published / archived).
   */
  updateCourseStatus: (
    courseId: number,
    payload: UpdateCourseStatusPayload,
    token: string,
  ) =>
    apiClient.patch<CourseDetailResponse>(
      `${BASE}/courses/${courseId}/status`,
      payload,
      token,
    ),

  /**
   * Supprime définitivement un cours.
   */
  deleteCourse: (courseId: number, token: string) =>
    apiClient.delete<ApiSuccessResponse<null>>(
      `${BASE}/courses/${courseId}`,
      token,
    ),

  /* -------------------------------------------------------------------- */
  /*  Finance                                                             */
  /* -------------------------------------------------------------------- */

  /**
   * Liste paginée des achats de cours, filtrable par status.
   */
  listPurchases: (params: ListPurchasesParams | undefined, token: string) =>
    apiClient.get<PurchasesListResponse>(
      `${BASE}/purchases${buildQuery(params)}`,
      token,
    ),

  getRevenueByMonth: (token: string, months = 12) =>
    apiClient.get(`${BASE}/revenue-by-month?months=${months}`, token),

  getTopCourses: (token: string, queryString: string) =>
    apiClient.get<TopCoursesResponse>(
      `${BASE}/top-courses?${queryString}`,
      token, 
    ),

  /**
   * Liste paginée des commissions, filtrable par status.
   */
  listCommissions: (params: ListCommissionsParams | undefined, token: string) =>
    apiClient.get<CommissionsListResponse>(
      `${BASE}/commissions${buildQuery(params)}`,
      token,
    ),
};
