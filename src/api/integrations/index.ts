import { apiClient } from "@/lib/client";
import { StripeConnectResponse, StripeStatusResponse } from "@/types/integrations";

export const integrationsApi = {
  connect: (token?: string) =>
    apiClient.post<StripeConnectResponse>(`/stripe/connect`, {}, token),

  getStatus: (token?: string) =>
    apiClient.get<StripeStatusResponse>(`/stripe/status`, token),
};
