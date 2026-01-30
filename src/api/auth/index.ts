import { apiClient } from "@/lib/client";
import { AuthResponse, LoginCredentials, RegisterCredentials, VerifyEmailResponse } from "@/types/auth";
import { User } from "@/types/user";


export const authApi = {
  register: (data: RegisterCredentials) =>
    apiClient.post<AuthResponse>("/register", data),

  login: (data: LoginCredentials) =>
    apiClient.post<AuthResponse>("/login", data),

  logout: (token: string) =>
    apiClient.post<{ message: string }>("/logout", undefined, token),

  verifyEmail: (data: { email: string; code: string }) =>
    apiClient.post<VerifyEmailResponse>("/verify-email", data),

  resendVerificationCode: (data: { email: string }) =>
    apiClient.post<AuthResponse>("/resend-verification-code", data),

  me: (token: string) => apiClient.get<User>("/me", token),
};
