import { apiClient } from "@/lib/client";
import {
  CreateDomainResponse,
  DomainRequestPayload,
  DomainResponse,
  Domain,
  DomainsResponsePaginated,
  UpdateDomainPaylaod,
} from "@/types/domain";

import type {} from "@/types/request";
export const domainsApi = {
  getAll: () => apiClient.get<Domain[]>(`/domains`),
  create: (data: DomainRequestPayload, token: string | null) =>
    apiClient.post<CreateDomainResponse>("/domains", data, token ?? undefined),
  getDomains: (page = 1, token: string | null) =>
    apiClient.get<DomainsResponsePaginated>(
      `/get-domains?page=${page}`,
      token ?? undefined,
    ),
  update: (id: number, data: UpdateDomainPaylaod, token: string | null) =>
    apiClient.put(`/domains/${id}`, data, token ?? undefined),
  delete: (id: number, token: string | null) =>
    apiClient.delete(`/domains/${id}`, token ?? undefined),
  show: (id: number, token: string | null) =>
    apiClient.get<DomainResponse>(`/domains/${id}`, token ?? undefined),
};
