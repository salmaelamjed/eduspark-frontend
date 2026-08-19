/* -------------------------------------------------------------------------- */
/*  Enveloppe générique des réponses API                                      */
/* -------------------------------------------------------------------------- */

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiValidationErrorResponse {
  success: false;
  message: string;
  errors: Record<string, string[]>;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

/** Union pratique si tu dois discriminer sur `success` côté client. */
export type ApiResponse<T> =
  | ApiSuccessResponse<T>
  | ApiValidationErrorResponse
  | ApiErrorResponse;

/** Forme d'une pagination Laravel (`->paginate()`). */
export interface LaravelPaginator<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
  links: Array<{ url: string | null; label: string; active: boolean }>;
}

/* -------------------------------------------------------------------------- */
/*  Enums / unions de statuts partagés                                        */
/* -------------------------------------------------------------------------- */

export type UserRole = "student" | "teacher" | "admin";
export type CourseStatus = "draft" | "published" | "archived";
export type TeacherRequestStatus = "pending" | "approved" | "rejected";
export type PurchaseStatus = "pending" | "completed" | "refunded" | "failed";
export type CommissionStatus = "pending" | "paid" | "refunded";

/* -------------------------------------------------------------------------- */
/*  Entités                                                                    */
/* -------------------------------------------------------------------------- */

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  /** Chemin relatif au disque public Laravel, ex: "avatars/xxx.jpg". */
  profile_picture?: string | null;
  created_at: string;
  updated_at: string;
  /** Présent seulement sur `showUser` (loadCount('coursesAsStudent')). */
  courses_as_student_count?: number;
}

export interface Domain {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string;
  created_at: string;
  updated_at: string;
  /** Présent sur `domains()` (withCount('courses')). */
  courses_count?: number;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  status: CourseStatus;
  domain_id: number;
  teacher_id: number;
  price: number;
  /** Chemin relatif au disque public Laravel, ex: "courses/xxx.jpg". */
  thumbnail?: string | null;
  currency?: string;
  created_at: string;
  updated_at: string;
  domain?: Domain;
  teacher?: User;
  modules?: CourseModule[];
}

export interface CourseModule {
  id: number;
  course_id: number;
  title: string;
  order: number;
  lessons?: CourseLesson[];
}

export interface CourseLesson {
  id: number;
  module_id: number;
  title: string;
  order: number;
}

export interface TeacherRequest {
  id: number;
  user_id: number;
  domain_id: number;
  status: TeacherRequestStatus;
  admin_comment: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
  domain?: Domain;
}

export interface CoursePurchase {
  id: number;
  course_id: number;
  student_id: number;
  teacher_id: number;
  status: PurchaseStatus;
  /**
   * Laravel renvoie les colonnes `decimal` en string par défaut (ex: "49.99"),
   * sauf cast explicite en float côté modèle. On type en string pour coller
   * à la réalité de l'API — voir formatAmount() côté client pour le parsing.
   */
  amount_total: string;
  commission_amount: string;
  teacher_amount: string;
  currency: string;
  purchased_at?: string | null;
  refunded_at?: string | null;
  created_at: string;
  updated_at: string;
  course?: Course;
  student?: User;
  teacher?: User;
}

export interface Commission {
  id: number;
  teacher_id: number;
  course_id: number;
  purchase_id: number;
  amount: number;
  status: CommissionStatus;
  created_at: string;
  updated_at: string;
  teacher?: User;
  course?: Course;
  purchase?: CoursePurchase;
}

/* -------------------------------------------------------------------------- */
/*  Tendances / croissance (calculées côté backend — jamais côté client)      */
/* -------------------------------------------------------------------------- */

export interface GrowthMetric {
  /** Valeur sur la période courante (ex: 30 derniers jours). */
  current: number;
  /** Valeur sur la période précédente équivalente (ex: 30 jours avant ça). */
  previous: number;
  /**
   * Variation en % : ((current - previous) / previous) * 100, arrondi à 1 décimale.
   * `null` si previous = 0 (division impossible — ne PAS afficher "0%", afficher
   * "Nouveau" ou masquer le badge côté UI).
   */
  growth_percent: number | null;
}

export interface DashboardTrends {
  revenue: GrowthMetric;
  new_users: GrowthMetric;
  new_courses: GrowthMetric;
}

/* -------------------------------------------------------------------------- */
/*  Dashboard stats — GET /admin/stats                                        */
/* -------------------------------------------------------------------------- */

export interface DashboardStats {
  users: {
    total: number;
    students: number;
    teachers: number;
    admins: number;
    active: number;
    inactive: number;
  };
  courses: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
  teacher_requests: {
    pending: number;
    approved: number;
    rejected: number;
  };
  finance: {
    total_revenue: number;
    total_commission: number;
    total_teacher_payout: number;
    pending_commissions: number;
  };
  domains: number;
  trends: DashboardTrends;
}

export type DashboardStatsResponse = ApiSuccessResponse<DashboardStats>;

/* -------------------------------------------------------------------------- */
/*  Query params (miroir des `Validator::make` par endpoint)                  */
/* -------------------------------------------------------------------------- */

export interface ListUsersParams {
  role?: "student" | "teacher" | "admin";
  status?: "active" | "inactive";
  search?: string;
  per_page?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
}

export interface ListTeacherRequestsParams {
  status?: TeacherRequestStatus;
  per_page?: number;
}

export interface ListCoursesParams {
  status?: CourseStatus;
  domain_id?: number;
  teacher_id?: number;
  per_page?: number;
}

export interface ListPurchasesParams {
  status?: PurchaseStatus;
  per_page?: number;
}

export interface ListCommissionsParams {
  status?: CommissionStatus;
  per_page?: number;
}

/* -------------------------------------------------------------------------- */
/*  Payloads de mutation                                                      */
/* -------------------------------------------------------------------------- */

export interface UpdateUserRolePayload {
  role: UserRole;
}

export interface RejectTeacherRequestPayload {
  admin_comment: string;
}

export interface StoreDomainPayload {
  name: string;
  description?: string | null;
  image: string;
}

export interface UpdateDomainPayload {
  name?: string;
  description?: string | null;
  image?: string;
}

export interface UpdateCourseStatusPayload {
  status: CourseStatus;
}

/* -------------------------------------------------------------------------- */
/*  Réponses par endpoint (paginées vs non paginées)                          */
/* -------------------------------------------------------------------------- */

export type UsersListResponse = ApiSuccessResponse<LaravelPaginator<User>>;
export type UserDetailResponse = ApiSuccessResponse<User>;

export type TeacherRequestsListResponse = ApiSuccessResponse<
  LaravelPaginator<TeacherRequest>
>;
export type TeacherRequestResponse = ApiSuccessResponse<TeacherRequest>;

export type DomainsListResponse = ApiSuccessResponse<Domain[]>;
export type DomainResponse = ApiSuccessResponse<Domain>;

export type CoursesListResponse = ApiSuccessResponse<LaravelPaginator<Course>>;
export type CourseDetailResponse = ApiSuccessResponse<Course>;

export type PurchasesListResponse = ApiSuccessResponse<
  LaravelPaginator<CoursePurchase>
>;
export type CommissionsListResponse = ApiSuccessResponse<
  LaravelPaginator<Commission>
>;

/* -------------------------------------------------------------------------- */
/*  Type guards                                                               */
/* -------------------------------------------------------------------------- */

export function isValidationError(
  response: ApiResponse<unknown>,
): response is ApiValidationErrorResponse {
  return response.success === false && "errors" in response;
}

export function isApiSuccess<T>(
  response: ApiResponse<T>,
): response is ApiSuccessResponse<T> {
  return response.success === true;
}
