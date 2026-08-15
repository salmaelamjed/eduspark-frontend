// hooks/profile/use-profile.ts
"use client";

import { UserProfile } from "@/types/user";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthToken } from "../useAuthToken";
import { profileApi } from "@/api/profile";
import { ApiError } from "@/lib/api";

interface UseProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  isRefetching: boolean;
  error: string | null;
}

const INITIAL_STATE: UseProfileState = {
  profile: null,
  isLoading: true,
  isRefetching: false,
  error: null,
};

export function useProfile() {
  const token = useAuthToken();
  const [state, setState] = useState<UseProfileState>(INITIAL_STATE);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchProfile = useCallback(
    async (isRefetch = false) => {
      if (!token) {
        setState({
          profile: null,
          isLoading: false,
          isRefetching: false,
          error: null,
        });
        return;
      }

      if (isRefetch) {
        setState((prev) => ({ ...prev, isRefetching: true, error: null }));
      }

      try {
        const profile = await profileApi.getMe(token);
        if (!mountedRef.current) return;
        setState({
          profile,
          isLoading: false,
          isRefetching: false,
          error: null,
        });
      } catch (error) {
        if (!mountedRef.current) return;
        setState({
          profile: null,
          isLoading: false,
          isRefetching: false,
          error:
            error instanceof ApiError
              ? error.message
              : "Erreur de chargement du profil.",
        });
      }
    },
    [token],
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const refetch = useCallback(() => {
    return fetchProfile(true);
  }, [fetchProfile]);

  // Mise à jour optimiste du profil
  const updateProfileOptimistically = useCallback(
    (updates: Partial<UserProfile>) => {
      setState((prev) => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...updates } : prev.profile,
      }));
    },
    [],
  );

  return {
    ...state,
    refetch,
    updateProfileOptimistically,
  };
}
