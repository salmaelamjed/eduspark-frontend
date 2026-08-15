import { apiClient } from "@/lib/client";
import type { ApiResponse, SocialLinks, UserProfile } from "../../types/user";
import type {
  ChangeEmailInput,
  ChangePasswordInput,
  SocialLinksInput,
  UpdateProfileInput,
} from "@/schema/profile.schema";

export const profileApi = {
  getMe: async (token: string): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
      "/profile",
      token,
    );
    return response.data!;
  },
  getPublicProfile: async (id: number, token: string): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
      `/profile/${id}`,
      token,
    );
    return response.data!;
  },
  update: (input: UpdateProfileInput, token: string) =>
    apiClient.put<ApiResponse<UserProfile>>(
      "/profile",
      cleanEmptyStrings(input),
      token,
    ),

  uploadAvatar: (file: File, token: string) => {
    const formData = new FormData();
    formData.append("profile_picture", file);

    return apiClient.post<{ message: string; profile_picture_url: string }>(
      "/profile/avatar",
      formData,
      token,
    );
  },

  deleteAvatar: (token: string) =>
    apiClient.delete<{ message: string }>("/profile/avatar", token),

  updateSocialLinks: (input: SocialLinksInput, token: string) =>
    apiClient.put<{ message: string; social_links: SocialLinks }>(
      "/profile/social-links",
      { social_links: cleanEmptyStrings(input) },
      token,
    ),

  changePassword: (input: ChangePasswordInput, token: string) =>
    apiClient.put<{ message: string }>("/profile/password", input, token),

  changeEmail: (input: ChangeEmailInput, token: string) =>
    apiClient.put<{ message: string }>("/profile/email", input, token),

  deactivate: (current_password: string, token: string) =>
    apiClient.post<{ message: string }>(
      "/profile/deactivate",
      { current_password },
      token,
    ),
};

function cleanEmptyStrings<T extends Record<string, unknown>>(
  input: T,
): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(input)) {
    (result as Record<string, unknown>)[key] = value === "" ? null : value;
  }
  return result;
}
 