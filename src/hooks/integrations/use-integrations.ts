// hooks/integrations/use-integrations.ts
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { getErrorMessage } from "@/components/ErrorMessage";
import { toast } from "sonner";
import { integrationsApi } from "@/api/integrations";
import { useAuth } from "@/context/auth-context";

interface UseConnectToStripeReturn {
  handleConnect: (token?: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  accountStatus: StripeAccountStatus | null;
  checkAccountStatus: () => Promise<void>;
  isAccountConnected: boolean;
  isInitializing: boolean;
}

interface StripeAccountStatus {
  has_account: boolean;
  onboarding_completed: boolean;
  status: "active" | "pending";
  account_id?: string;
}

// ✅ Clé pour le localStorage
const STRIPE_STORAGE_KEY = "eduspark_stripe_account";

export function useConnectToStripe(): UseConnectToStripeReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [accountStatus, setAccountStatus] =
    useState<StripeAccountStatus | null>(() => {
      // ✅ Initialiser avec les données du localStorage
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STRIPE_STORAGE_KEY);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch {
            return null;
          }
        }
      }
      return null;
    });

  const { token } = useAuth();
  const isFirstRender = useRef(true);

  // ✅ Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    if (accountStatus) {
      localStorage.setItem(STRIPE_STORAGE_KEY, JSON.stringify(accountStatus));
    } else {
      localStorage.removeItem(STRIPE_STORAGE_KEY);
    }
  }, [accountStatus]);

  // ✅ Vérifier le statut du compte avec un flag pour éviter les appels multiples
  useEffect(() => {
    if (token && isFirstRender.current) {
      isFirstRender.current = false;
      checkAccountStatus();
    } else if (!token) {
      setIsInitializing(false);
    }
  }, [token]);

  const checkAccountStatus = useCallback(async () => {
    if (!token) {
      setIsInitializing(false);
      return;
    }

    try {
      const response = await integrationsApi.getStatus(token);

      if (response.success) {
        const newStatus = {
          has_account: response.has_account,
          onboarding_completed: response.onboarding_completed,
          status: response.status,
          account_id: response.account_id,
        };

        setAccountStatus(newStatus);
        localStorage.setItem(STRIPE_STORAGE_KEY, JSON.stringify(newStatus));
      }
    } catch (error) {
      console.error("Error checking account status:", error);
    } finally {
      setIsInitializing(false);
    }
  }, [token]);

  const handleConnect = useCallback(async (token?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await integrationsApi.connect(token);

      if (response.success && response.onboarding_url) {
        // ✅ Sauvegarder immédiatement dans localStorage
        const newStatus = {
          has_account: true,
          onboarding_completed: false,
          status: "pending" as const,
          account_id: response.account_id,
        };

        setAccountStatus(newStatus);
        localStorage.setItem(STRIPE_STORAGE_KEY, JSON.stringify(newStatus));

        // ✅ Afficher un toast de confirmation
        toast.success("Redirection vers Stripe...", {
          description:
            "Vous allez être redirigé vers la page d'onboarding Stripe.",
          duration: 3000,
        });

        // ✅ Petit délai pour permettre au toast de s'afficher
        setTimeout(() => {
          window.location.href = response.onboarding_url;
        }, 1000);
      } else {
        throw new Error(
          response.message ||
            "Impossible de récupérer le lien de configuration.",
        );
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Erreur lors de la création");
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ SIMPLIFIÉ : Le compte est connecté si account_id existe
  const isAccountConnected = accountStatus?.has_account === true;

  return {
    handleConnect,
    isLoading,
    error,
    accountStatus,
    checkAccountStatus,
    isAccountConnected,
    isInitializing,
  };
}
