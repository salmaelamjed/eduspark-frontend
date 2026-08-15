"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { profileApi } from "@/api/profile";
import { ApiError } from "@/lib/api";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/schema/profile.schema";
import { toFieldErrors } from "@/constants/zod-errors-convert";

export type MutationStatus = "idle" | "loading" | "success" | "error";

type ChangePasswordFieldErrors = Partial<
  Record<keyof ChangePasswordInput, string>
>;

interface UseChangePasswordOptions {
  /** Jeton d'authentification. Le hook reste inerte tant qu'il est absent. */
  token: string | null | undefined;
  /** Appelé après un changement de mot de passe confirmé côté serveur. */
  onSuccess?: () => void;
  /** Durée d'affichage de l'état "success" avant de repasser à "idle" (ms). */
  successResetDelayMs?: number;
}

interface UseChangePasswordReturn {
  /** Valide puis envoie le changement de mot de passe. Renvoie `true` en cas de succès. */
  submit: (values: ChangePasswordInput) => Promise<boolean>;
  status: MutationStatus;
  isLoading: boolean;
  isSuccess: boolean;
  /** Erreurs de validation Zod par champ (ex: mots de passe qui ne correspondent pas). */
  fieldErrors: ChangePasswordFieldErrors;
  /** Erreur renvoyée par le serveur (ex: mot de passe actuel incorrect, réseau, 4xx/5xx). */
  apiError: string | null;
  reset: () => void;
}

/**
 * Encapsule le cycle complet du changement de mot de passe :
 * validation locale (Zod, y compris la confirmation) -> appel réseau -> état.
 *
 * Ne gère pas les champs du formulaire (contrôlés par l'appelant) : c'est à
 * l'appelant de vider les champs sensibles dans `onSuccess` une fois soumis.
 */
export function useChangePassword({
  token,
  onSuccess,
  successResetDelayMs = 1500,
}: UseChangePasswordOptions): UseChangePasswordReturn {
  const [status, setStatus] = useState<MutationStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<ChangePasswordFieldErrors>({});
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
    async (values: ChangePasswordInput): Promise<boolean> => {
      const validation = changePasswordSchema.safeParse(values);
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
        const response = await profileApi.changePassword(
          validation.data,
          token,
        );
        if (!mountedRef.current) return true;

        setStatus("success");
        toast.success(response.message ?? "Mot de passe changé avec succès.");
        onSuccess?.();

        resetTimeoutRef.current = window.setTimeout(() => {
          if (mountedRef.current) setStatus("idle");
        }, successResetDelayMs);

        return true;
      } catch (error) {
        if (!mountedRef.current) return false;
        const message =
          error instanceof ApiError
            ? error.message
            : "Échec du changement de mot de passe.";
        setStatus("error");
        setApiError(message);
        toast.error(message);
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
