export interface StripeConnectResponse {
  success: boolean;
  message: string;
  onboarding_url?: string;
  account_id?: string;
  account_type?: string;
}

export interface StripeStatusResponse {
  success: boolean;
  has_account: boolean;
  account_id?: string;
  onboarding_completed: boolean;
  status: "active" | "pending";
  requirements?: {
    entries: [];
    summary: string | null;
  } | null;
}
