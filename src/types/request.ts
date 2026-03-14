import { Domain } from "./domain";
import { RequestStatus } from "./request-status";
import { User } from "./user";

export interface TeacherRequestDetail {
  id: number;
  user_id?: number;
  domain_id?: number;
  status: RequestStatus;
  linkedin_url: string;
  project_url: string;
  motivation: string;
  admin_comment: string | null;
  created_at: string;
  updated_at: string;

  // Relations (peuvent être présentes ou non selon l'endpoint)
  user?: User;
  domain?: Domain;
}

export interface TeacherRequestResponse {
  success: boolean;
  message: string;
  data: TeacherRequestDetail & {
    user: User;
    domain: Domain;
  };
}

export interface PaginatedTeacherRequests {
  data: Array<
    TeacherRequestDetail & {
      user: User;
      domain: Domain;
    }
  >;
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface UpdateTeacherRequestResponse {
  message: string;
  request: TeacherRequestDetail;
}

export interface CreateTeacherRequestResponse {
  message: string;
  request: {
    id: number;
    status: RequestStatus;
    created_at: string;
  };
}

export interface CreateTeacherRequestPayload {
  domain_id: number;
  linkedin_url: string;
  project_url: string;
  motivation: string;
}

export interface UpdateTeacherRequestPayload {
  status?: RequestStatus;
  admin_comment?: string | null;
}

export interface TeacherRequestFilters {
  status?: RequestStatus;
  domain_id?: number;
  user_id?: number;
  page?: number;
  per_page?: number;
}