// hooks/profile/use-avatar-upload.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profileApi } from "@/api/profile";
import { ApiError } from "@/lib/api";
import { avatarUploadSchema } from "@/schema/profile.schema";

export type AvatarUploadStatus = "idle" | "uploading" | "success" | "error";

interface UseAvatarUploadOptions {
  token: string | null | undefined;
  currentUrl?: string | null;
  onUploaded?: (url: string) => void;
  onDeleted?: () => void;
}

interface UseAvatarUploadReturn {
  previewUrl: string | null;
  status: AvatarUploadStatus;
  progress: number;
  errorMessage: string | null;
  isBusy: boolean;
  selectFile: (file: File) => Promise<void>;
  deleteAvatar: () => Promise<void>;
  reset: () => void;
}

/**
 * Gère le cycle de vie complet de l'avatar : validation, aperçu local instantané,
 * envoi réel via profileApi.uploadAvatar avec simulation de progression.
 * Totalement indépendant du reste du formulaire de profil.
 */
export function useAvatarUpload({
  token,
  currentUrl,
  onUploaded,
  onDeleted,
}: UseAvatarUploadOptions): UseAvatarUploadReturn {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentUrl ?? null,
  );
  const [status, setStatus] = useState<AvatarUploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const objectUrlRef = useRef<string | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Garde l'aperçu synchronisé avec le profil tant qu'aucun upload n'est en cours.
  useEffect(() => {
    if (status === "idle") {
      setPreviewUrl(currentUrl ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUrl]);

  // Nettoyage des ressources
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const clearProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearProgressInterval();
    setStatus("idle");
    setProgress(0);
    setErrorMessage(null);
  }, [clearProgressInterval]);

  const simulateProgress = useCallback(() => {
    clearProgressInterval();
    setProgress(0);

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        // Progression lente jusqu'à 90%, puis attendre la réponse réelle
        if (prev >= 90) {
          clearProgressInterval();
          return prev;
        }
        // Progression plus rapide au début, plus lente à la fin
        const increment = prev < 50 ? Math.random() * 15 : Math.random() * 5;
        return Math.min(prev + increment, 90);
      });
    }, 200);
  }, [clearProgressInterval]);

  const selectFile = useCallback(
    async (file: File) => {
      // Validation côté client
      const validation = avatarUploadSchema.safeParse({
        profile_picture: file,
      });

      if (!validation.success) {
        setStatus("error");
        setErrorMessage(
          validation.error.issues[0]?.message ?? "Fichier invalide.",
        );
        return;
      }

      if (!token) {
        setStatus("error");
        setErrorMessage("Vous devez être connecté.");
        return;
      }

      // Aperçu local immédiat
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const localUrl = URL.createObjectURL(file);
      objectUrlRef.current = localUrl;

      setPreviewUrl(localUrl);
      setErrorMessage(null);
      setStatus("uploading");
      setProgress(0);

      // Simuler la progression
      simulateProgress();

      try {
        // Upload réel via votre apiClient (gère déjà le base URL et les headers)
        const response = await profileApi.uploadAvatar(file, token);

        clearProgressInterval();

        if (response.profile_picture_url) {
          // Nettoyer l'ancien object URL
          if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
          }

          setProgress(100);
          setStatus("success");
          setPreviewUrl(response.profile_picture_url);
          onUploaded?.(response.profile_picture_url);

          // Réinitialiser après un court délai
          window.setTimeout(() => {
            setStatus("idle");
            setProgress(0);
          }, 900);
        } else {
          throw new Error("URL de l'avatar manquante dans la réponse");
        }
      } catch (error) {
        clearProgressInterval();
        setStatus("error");
        setErrorMessage(
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Échec de l'envoi de l'image.",
        );

        // Revenir à l'ancien avatar en cas d'erreur
        setPreviewUrl(currentUrl ?? null);

        // Réinitialiser après un délai
        window.setTimeout(() => {
          setStatus("idle");
          setProgress(0);
        }, 2000);
      }
    },
    [token, currentUrl, onUploaded, simulateProgress, clearProgressInterval],
  );

  const deleteAvatar = useCallback(async () => {
    if (!token) return;

    clearProgressInterval();
    setStatus("uploading");
    setProgress(50);
    setErrorMessage(null);

    try {
      await profileApi.deleteAvatar(token);

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      setPreviewUrl(null);
      setStatus("idle");
      setProgress(0);
      onDeleted?.();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Échec de la suppression.",
      );

      window.setTimeout(() => {
        setStatus("idle");
        setProgress(0);
      }, 2000);
    }
  }, [token, onDeleted, clearProgressInterval]);

  return {
    previewUrl,
    status,
    progress,
    errorMessage,
    isBusy: status === "uploading",
    selectFile,
    deleteAvatar,
    reset,
  };
}
