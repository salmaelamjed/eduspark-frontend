import { apiClient } from "@/lib/client";
import {  CourseRequestPayload, CourseResponsePayload } from "@/types/course";


export interface PaginatedCourses {
  data: [
  {
    id:number, 
    title:string ,
    slug:string , 
    level:string ,
    language: string , 
    price: number,
    is_free:boolean,
    status:string,
    thumbnail?:string | null ,
    domain:string , 
    domain_slug:string ,
    teacher:string , 
    created_at: string,
  }
  ];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CourseListFilters {
  page?: number;
  per_page?: number;
  search?: string;
  domain?: string;
  level?: string;
  language?: string;
  is_free?: boolean;
  min_price?: number;
  max_price?: number;
}
export interface CourseDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  level: string;
  language: string;
  price: number;
  is_free: boolean;
  status: string;
  thumbnail: string | null;
  domain: { id: number; name: string; slug: string } | null;
  teacher: { id: number; name: string } | null;
  created_at: string;
  updated_at: string;
  modules: Array<{
    id: number;
    title: string;
    description: string;
    order: number;
    created_at: string;
    lessons: Array<{
      id: number;
      title: string;
      slug: string;
      order: number;
      is_preview: boolean;
      created_at: string;
      blocks: Array<{
        id: number;
        type: string;
        content: string;
        media_url: string | null;
        duration_seconds: number | null;
        language: string | null;
        quiz_data: any | null;
        code_data: any | null;
        order: number;
        is_preview: number | boolean;
        created_at: string;
      }>;
    }>;
  }>;
}

export const coursesApi = {
  getAll: (filters: CourseListFilters = {}) => {
    const params = new URLSearchParams();
    // Ajout uniquement des paramètres définis
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();

    return apiClient.get<PaginatedCourses>(`/courses?${queryString}`);
  },
  /**
   * Récupère les cours de l'enseignant connecté
   */
  getMyCourses: (filters: CourseListFilters = {}, token: string) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    return apiClient.get<PaginatedCourses>(`/teacher/courses?${queryString}`,token);
  },

  getOne: (id: number) => apiClient.get<CourseDetail>(`/courses/${id}`),

  create: (data: CourseRequestPayload, token: string) =>
    apiClient.post<CourseResponsePayload>("/courses", data, token),

  //   update: (id: number, data: UpdateTeacherRequestPayload, token: string) =>
  //     apiClient.patch<UpdateTeacherRequestResponse>(
  //       `/teacher-requests/${id}`,
  //       data,
  //       token,
  //     ),

  delete: (id: number, token: string) =>
    apiClient.delete<{ message: string }>(`/courses/${id}`, token),
};