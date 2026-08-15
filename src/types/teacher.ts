export interface CourseBasic {
  id: number;
  title: string;
  slug: string;
  thumbnail?: string | null;
  level?: "beginner" | "intermediate" | "advanced";
  price?: number;
  is_free?: boolean;
}
export interface Purchase {
  id: number;
  amount_total: number;
  teacher_amount: number;
  commission_amount: number;
  currency: string;
  status: string;
  purchased_at: string | null;
}

export interface Enrollment {
  id: number;
  enrolled_at: string;
  course: CourseBasic;
  purchase: Purchase | null;
}