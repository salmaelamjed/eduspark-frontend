// types/dashboard.ts

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

export interface TeacherDashboardResponse {
  period: number;
  generated_at: string;
  overview: {
    total_students: number;
    total_enrollments: number;
    total_courses: number;
    published_courses: number;
    total_earnings: number;
    total_commission: number;
    gross_revenue: number;
    total_sales: number;
    period_days: number;
    period_enrollments: number;
    period_earnings: number;
    enrollments_growth_pct: number | null;
    earnings_growth_pct: number | null;
  };
  best_selling_courses: Array<{
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    price: number;
    is_free: boolean;
    status: string;
    sales_count: number;
    total_earned: number;
  }>;
  most_popular_courses: Array<{
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    status: string;
    enrollments_count: number;
  }>;
  enrollment_trend: Array<{
    date: string;
    count: number;
  }>;
  revenue_trend: Array<{
    date: string;
    amount: number;
  }>;
  recent_enrollments: Array<{
    id: number;
    student_name: string;
    course_title: string;
    enrolled_at: string;
    status: string;
  }>;
  recent_sales: Array<{
    id: number;
    course_title: string;
    student_name: string;
    amount: number;
    purchased_at: string;
  }>;
  top_students: Array<{
    student: {
      id: number;
      name: string;
      email: string;
      profile_picture: string | null;
    };
    total_spent: number;
    purchases_count: number;
  }>;
}

export interface CourseStatsResponse {
  generated_at: string;
  course: {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    price: number;
    is_free: boolean;
    status: string;
    level: string;
  };
  stats: {
    enrollments_count: number;
    unique_students: number;
    sales_count: number;
    total_earned: number;
    gross_revenue: number;
    average_sale_amount: number;
    free_enrollments: number;
    paid_enrollments: number;
  };
  enrollment_trend: Array<{
    date: string;
    count: number;
  }>;
  recent_enrollments: Array<{
    id: number;
    student: {
      id: number;
      name: string;
      email: string;
      profile_picture: string | null;
    };
    enrolled_at: string;
  }>;
}
