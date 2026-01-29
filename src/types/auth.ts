import { User } from "./user";

export interface AuthResponse {
  message: string;
  user?: User;
  accessToken?: string;
  success: boolean;
  email?:string;
}
export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}


export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}