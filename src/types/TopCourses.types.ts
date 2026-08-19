export interface TopCourse {
  id: number;
  title: string;
  image: string;
  status: "draft" | "published" | "archived";
  domain: string | null;
  teacher: string | null;
  enrollments: number;
  revenue: number;
}

/**
 * API Response for top courses endpoint
 */
export interface TopCoursesResponse {
  success: boolean;
  message: string;
  data: TopCourse[];
}

/**
 * Query parameters for fetching top courses
 */
export interface TopCoursesParams {
  /**
   * Number of top courses to fetch (default: 5, min: 1, max: 50)
   */
  limit?: number;

  /**
   * Sort criteria: by revenue or by enrollments (default: 'revenue')
   */
  by?: "revenue" | "enrollments";
}

/**
 * Extended top course with computed percentages
 */
export interface TopCourseWithStats extends TopCourse {
  /**
   * Percentage of total revenue this course represents
   */
  revenuePercentage: number;

  /**
   * Percentage of total enrollments this course represents
   */
  enrollmentsPercentage: number;

  /**
   * Formatted revenue with currency (€)
   */
  formattedRevenue: string;

  /**
   * Rank position (1-based)
   */
  rank: number;
}

/**
 * Top courses with aggregated metadata
 */
export interface TopCoursesWithMetadata {
  courses: TopCourseWithStats[];
  metadata: {
    totalRevenue: number;
    totalEnrollments: number;
    averageRevenue: number;
    averageEnrollments: number;
  };
}

/**
 * Hook return type for useTopCourses
 */
export interface UseTopCoursesReturn {
  courses: TopCourse[];
  loading: boolean;
  error: Error | null;
  fetchTopCourses: (params?: TopCoursesParams) => Promise<void>;
  reset: () => void;
}

/**
 * Hook options for useTopCourses
 */
export interface UseTopCoursesOptions {
  /**
   * Initial limit (default: 5)
   */
  limit?: number;

  /**
   * Initial sort by (default: 'revenue')
   */
  by?: "revenue" | "enrollments";

  /**
   * Auto-fetch on mount (default: true)
   */
  autoFetch?: boolean;
}

/**
 * Chart data format for top courses visualization
 */
export interface TopCoursesChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

/**
 * Leaderboard item with additional display info
 */
export interface TopCourseLeaderboardItem extends TopCourseWithStats {
  medal?: "🥇" | "🥈" | "🥉";

  color: string;

  isTopPerformer: boolean;
}
