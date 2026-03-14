import { apiClient } from "@/lib/client";

import type {
  TeacherRequestResponse,
  PaginatedTeacherRequests,
  CreateTeacherRequestResponse,
  UpdateTeacherRequestResponse,
  CreateTeacherRequestPayload,
  UpdateTeacherRequestPayload,
} from "@/types/request";
export const requestsApi = {
  getAll: (page = 1,token: string) =>
    apiClient.get<PaginatedTeacherRequests>(`/teacher-requests?page=${page}`,token),

  getOne: (id: number) =>
    apiClient.get<TeacherRequestResponse>(`/teacher-requests/${id}`),

  create: (data: CreateTeacherRequestPayload, token: string) =>
    apiClient.post<CreateTeacherRequestResponse>(
      "/teacher-requests",
      data,
      token,
    ),

  update: (id: number, data: UpdateTeacherRequestPayload, token: string) =>
    apiClient.patch<UpdateTeacherRequestResponse>(
      `/teacher-requests/${id}`,
      data,
      token,
    ),

  delete: (id: number, token: string) =>
    apiClient.delete<{ message: string }>(`/teacher-requests/${id}`, token),
};