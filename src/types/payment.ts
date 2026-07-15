export interface CreatePaymentIntentResponse {
  success: boolean;
  client_secret?: string;
  purchase_id?: number;
  message?: string;
}

export interface PurchaseStatus {
  id: number;
  course_id: number;
  status: "pending" | "completed" | "failed" | "refunded";
  amount_total: number;
  currency: string;
  purchased_at: string | null;
}
