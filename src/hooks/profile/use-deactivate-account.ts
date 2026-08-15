"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { profileApi } from "@/api/profile";
import { ApiError } from "@/lib/api";

export type MutationStatus = "idle" | "loading" | "success" | "error";

interface UseDeactivateAccountOptions {
  token: string | null | undefined;
  onSuccess?: () => void;
  successResetDelayMs?: number;
}

interface UseDeactivateAccountReturn {
  /** Envoie la demande de désactivation. Renvoie `true` en cas de succès. */
  submit: (currentPassword: string) => Promise<boolean>;
  status: MutationStatus;
  isLoading: boolean;
  isSuccess: boolean;
  /** Erreur de validation locale (champ vide) */
  fieldError: string | null;
  /** Erreur renvoyée par le serveur (mot de passe incorrect, réseau, 4xx/5xx) */
  apiError: string | null;
  reset: () => void;
}

/**
 * Encapsule le cycle complet de désactivation de compte :
 * validation locale du mot de passe -> appel réseau -> état.
 *
 * Le backend supprime les tokens et invalide la session lors de la
 * désactivation : `onSuccess` est l'endroit approprié pour rediriger
 * l'utilisateur et nettoyer le state d'authentification côté client.
 */
export function useDeactivateAccount({
  token,
  onSuccess,
  successResetDelayMs = 1500,
}: UseDeactivateAccountOptions): UseDeactivateAccountReturn {
  const [status, setStatus] = useState<MutationStatus>("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);
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
    setFieldError(null);
    setApiError(null);
  }, []);

  const submit = useCallback(
    async (currentPassword: string): Promise<boolean> => {
      if (!currentPassword.trim()) {
        setFieldError("Le mot de passe actuel est requis.");
        setApiError(null);
        setStatus("error");
        return false;
      }

      if (!token) {
        setFieldError(null);
        setApiError("Vous devez être connecté pour effectuer cette action.");
        setStatus("error");
        return false;
      }

      setFieldError(null);
      setApiError(null);
      setStatus("loading");

      try {
        const response = await profileApi.deactivate(currentPassword, token);
        if (!mountedRef.current) return true;

        setStatus("success");
        toast.success(response.message ?? "Compte désactivé.");
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
            : "Échec de la désactivation du compte.";
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
    fieldError,
    apiError,
    reset,
  };
}

export default useDeactivateAccount;
