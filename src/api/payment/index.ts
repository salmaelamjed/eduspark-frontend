import { apiClient } from "@/lib/client";
import { CreatePaymentIntentResponse, PurchaseStatus } from "@/types/payment";

export const paymentsApi = {
  /**
   * Démarre (ou réutilise) un PaymentIntent pour l'achat d'un cours.
   */
  createIntent: (courseId: number | string, token: string) =>
    apiClient.post<CreatePaymentIntentResponse>(
      `/courses/${courseId}/checkout`,
      undefined,
      token,
    ),

  /**
   * Vérifie le statut réel de l'achat côté serveur (mis à jour par le
   * webhook Stripe). Nécessaire pour du polling après confirmation :
   * confirmPayment() réussi ne veut pas dire "accès accordé", seul le
   * webhook fait foi.
   */
  getPurchaseStatus: (purchaseId: number, token: string) =>
    apiClient.get<PurchaseStatus>(`/purchases/${purchaseId}`, token),
};
