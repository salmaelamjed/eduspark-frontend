import { apiClient } from "@/lib/client";
import {
  CreateDomainResponse,
  DomainRequestPayload,
  DomainResponse,
  DomainsResponsePaginated,
  UpdateDomainPaylaod,
} from "@/types/domain";

import type {} from "@/types/request";
export const domainsApi = {
  getAll: () => apiClient.get<DomainResponse>(`/domains`),
  create: (data: DomainRequestPayload, token: string) =>
    apiClient.post<CreateDomainResponse>("/domains", data, token),
  getDomains: (page = 1, token: string) =>
    apiClient.get<DomainsResponsePaginated>(`/get-domains?page=${page}`, token),
  update: (id: number, data: UpdateDomainPaylaod, token: string) =>
    apiClient.put(`/domains/${id}`, data, token),
  delete: (id: number, token: string) =>
    apiClient.delete(`/domains/${id}`, token),
  show: (id: number, token: string) => apiClient.get(`/domains/${id}`, token),
};
