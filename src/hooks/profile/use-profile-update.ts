// hooks/profile/use-profile-update.ts
"use client";

import { useState } from "react";
import { useAuthToken } from "../useAuthToken";
import { profileApi } from "@/api/profile";
import { ApiError } from "@/lib/api";
import type { UpdateProfileInput } from "@/schema/profile.schema";
import type { UserProfile } from "@/types/user";

interface UseProfileUpdateReturn {
  updateProfile: (input: UpdateProfileInput) => Promise<UserProfile | null>;
  isUpdating: boolean;
  error: string | null;
}

export function useProfileUpdate(): UseProfileUpdateReturn {
  const token = useAuthToken();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (
    input: UpdateProfileInput,
  ): Promise<UserProfile | null> => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await profileApi.update(input, token);
      return response.data || null;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Une erreur est survenue lors de la mise à jour.";
      setError(message);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateProfile,
    isUpdating,
    error,
  };
}
