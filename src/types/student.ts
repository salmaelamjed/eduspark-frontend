import { Enrollment } from "./teacher";

export interface Student {
  id: number;
  name: string;
  email: string;
  profile_picture: string | null;
  country: string | null;
  headline: string | null;
  bio?: string | null;
  expertise_level?: string | null;
  is_active: boolean;
  created_at?: string;
}

// ===== Liste des étudiants (index) =====
export interface StudentListItem {
  id: number; // enrollment id
  enrolled_at: string;
  teacher_notes: string | null;
  student: {
    id: number;
    name: string;
    email: string;
    profile_picture: string | null;
    country: string | null;
    headline: string | null;
    is_active: boolean;
  };
  course: {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    level: string | null;
    price: number | null;
    is_free: boolean | null;
    status: string | null;
  };
}

export interface StudentListResponse {
  data: StudentListItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// ===== Détails d’un étudiant (show) =====
export interface StudentDetailResponse {
  student: Student;
  enrollments: Enrollment[];
  stats: {
    total_courses: number;
    total_spent: number;
    first_enrollment: string | null;
    last_enrollment: string | null;
  };
}

// ===== Étudiants d’un cours (byCourse) =====
export interface CourseStudentsResponse {
  course: {
    id: number;
    title: string;
    slug: string;
  };
  students: {
    data: {
      id: number;
      enrolled_at: string;
      student: Student;
    }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface StudentListParams {
  search?: string;
  course_id?: number;
  status?: "active" | "inactive";
  per_page?: number;
  page?: number;
}

export interface DashboardParams {
  period?: number; 
}