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
  getAll: (page = 1, token: string | null) =>
    apiClient.get<PaginatedTeacherRequests>(
      `/teacher-requests?page=${page}`,
      token ?? undefined,
    ),

  getOne: (id: number) =>
    apiClient.get<TeacherRequestResponse>(`/teacher-requests/${id}`),

  create: (data: CreateTeacherRequestPayload, token: string | null) =>
    apiClient.post<CreateTeacherRequestResponse>(
      "/teacher-requests",
      data,
      token ?? undefined,
    ),

  update: (
    id: number,
    data: UpdateTeacherRequestPayload,
    token: string | null,
  ) =>
    apiClient.patch<UpdateTeacherRequestResponse>(
      `/teacher-requests/${id}`,
      data,
      token ?? undefined,
    ),

  delete: (id: number, token: string | null) =>
    apiClient.delete<{ message: string }>(
      `/teacher-requests/${id}`,
      token ?? undefined,
    ),
};
