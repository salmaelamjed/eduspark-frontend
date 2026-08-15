"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profileApi } from "@/api/profile";
import { ApiError } from "@/lib/api";
import {
  socialLinksSchema,
  type SocialLinksInput,
} from "@/schema/profile.schema";
import { toFieldErrors } from "@/constants/zod-errors-convert";
import type { SocialLinks } from "@/types/user";

export type MutationStatus = "idle" | "loading" | "success" | "error";

type SocialLinksFieldErrors = Partial<Record<keyof SocialLinksInput, string>>;

interface UseUpdateSocialLinksOptions {
  token: string | null | undefined;
  onSuccess?: (socialLinks: SocialLinks) => void;
  successResetDelayMs?: number;
}

interface UseUpdateSocialLinksReturn {
  submit: (values: SocialLinksInput) => Promise<boolean>;
  status: MutationStatus;
  isLoading: boolean;
  isSuccess: boolean;
  fieldErrors: SocialLinksFieldErrors;
  apiError: string | null;
  reset: () => void;
}


export function useUpdateSocialLinks({
  token,
  onSuccess,
  successResetDelayMs = 1500,
}: UseUpdateSocialLinksOptions): UseUpdateSocialLinksReturn {
  const [status, setStatus] = useState<MutationStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<SocialLinksFieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const resetTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(
    null,
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const reset = useCallback(() => {
    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    setStatus("idle");
    setFieldErrors({});
    setApiError(null);
  }, []);

  const submit = useCallback(
    async (values: SocialLinksInput): Promise<boolean> => {
      const validation = socialLinksSchema.safeParse(values);
      if (!validation.success) {
        setFieldErrors(toFieldErrors(validation.error));
        setApiError(null);
        setStatus("error");
        return false;
      }

      if (!token) {
        setFieldErrors({});
        setApiError("Vous devez être connecté pour effectuer cette action.");
        setStatus("error");
        return false;
      }

      setFieldErrors({});
      setApiError(null);
      setStatus("loading");

      try {
        const response = await profileApi.updateSocialLinks(
          validation.data,
          token,
        );
        if (!mountedRef.current) return true;

        setStatus("success");
        onSuccess?.(response.social_links);

        resetTimeoutRef.current = window.setTimeout(() => {
          if (mountedRef.current) setStatus("idle");
        }, successResetDelayMs);

        return true;
      } catch (error) {
        if (!mountedRef.current) return false;
        setStatus("error");
        setApiError(
          error instanceof ApiError
            ? error.message
            : "Échec de la mise à jour des liens sociaux.",
        );
        return false;
      }
    },
    [token, onSuccess, successResetDelayMs],
  );

  return {
    submit,
    status,
    isLoading: status === "loading",
    isSuccess: status === "success",
    fieldErrors,
    apiError,
    reset,
  };
}
