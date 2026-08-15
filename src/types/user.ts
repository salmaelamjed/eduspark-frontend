export type UserRole = "student" | "teacher" | "admin";
export type ExpertiseLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";
export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  youtube?: string;
  instagram?: string;
  [key: string]: string | undefined;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  role: UserRole;
  is_active: boolean;

  country?: string | null; //ISO ('MA', 'FR', 'US'...)
  profile_picture?: string | null;
  bio?: string | null;
  headline?: string | null;
  social_links?: SocialLinks | null;
  expertise_level?: string | null;
  date_of_birth?: string | null;

  // Champs Stripe Connect (lecture seule côté frontend — jamais modifiables via formulaire utilisateur)
  stripe_account_id?: string | null;
  stripe_onboarding_completed?: boolean;
  stripe_account_created_at?: string | null;
  stripe_account_updated_at?: string | null;
  total_earnings?: number;
  total_commission_paid?: number;

  created_at?: string;
  updated_at?: string;
}
export interface UserProfile {
  id: number;
  name: string;
  email: string | null;
  role: UserRole;
  is_active: boolean;
  country: string | null;
  headline: string | null;
  bio: string | null;
  expertise_level: ExpertiseLevel | null;
  date_of_birth: string | null; // "YYYY-MM-DD",
  social_links: SocialLinks | null;
  profile_picture_url: string | null;
  email_verified: boolean;
  member_since: string;
  courses_count?: number; // présent seulement si role === "teacher"
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export interface ApiValidationError {
  message: string;
  errors: Record<string, string[]>;
}