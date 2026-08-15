import { useCallback, useRef, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { paymentsApi } from "@/api/payment";
import { PurchaseStatus } from "@/types/payment";

type PaymentStep =
  | "idle"
  | "creating_intent"
  | "ready"
  | "confirming"
  | "already_processed"
  | "polling"
  | "succeeded"
  | "error";

interface UsePaymentResult {
  step: PaymentStep;
  clientSecret: string | null;
  purchaseId: number | null;
  errorMessage: string | null;
  startCheckout: (courseId: number | string) => Promise<void>;
  confirmSucceeded: () => void;
  waitForEnrollment: () => Promise<PurchaseStatus | null>;
  reset: () => void;
}

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 30000;

export function usePayment(): UsePaymentResult {
  const { token } = useAuth();
  const [step, setStep] = useState<PaymentStep>("idle");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [purchaseId, setPurchaseId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pollingRef = useRef(false);

  const reset = useCallback(() => {
    pollingRef.current = false;
    setStep("idle");
    setClientSecret(null);
    setPurchaseId(null);
    setErrorMessage(null);
  }, []);

  const startCheckout = useCallback(
    async (courseId: number | string) => {
      if (!token) {
        setErrorMessage("Vous devez être connecté pour acheter ce cours.");
        setStep("error");
        return;
      }

      setStep("creating_intent");
      setErrorMessage(null);

      try {
        const response = await paymentsApi.createIntent(courseId, token);

        if (response.already_processed) {
          setPurchaseId(response.purchase_id);
          setStep("already_processed");
          // Optionally start polling immediately
          if (response.purchase_id) {
            waitForEnrollment();
          }
          return;
        }
        if (
          !response.success ||
          !response.client_secret ||
          !response.purchase_id
        ) {
          setErrorMessage(
            response.message ?? "Impossible de démarrer le paiement.",
          );
          setStep("error");
          return;
        }

        setClientSecret(response.client_secret);
        setPurchaseId(response.purchase_id);
        setStep("ready");
      } catch (error: unknown) {
        console.error(error);
        setErrorMessage(
          "Impossible de démarrer le paiement. Veuillez réessayer.",
        );
        setStep("error");
      }
    },
    [token],
  );

  // Appelé par le composant de formulaire une fois que Stripe confirme
  // localement que le paiement est passé (paymentIntent.status === 'succeeded').
  const confirmSucceeded = useCallback(() => {
    setStep("polling");
  }, []);

  // Le webhook Stripe traite l'événement de façon asynchrone (accès au
  // cours, ligne 'commissions', etc.). On patiente donc côté client en
  // interrogeant le statut réel jusqu'à ce qu'il passe à 'completed',
  // plutôt que de faire confiance à la seule réponse de confirmPayment().
  const waitForEnrollment =
    useCallback(async (): Promise<PurchaseStatus | null> => {
      if (!token || !purchaseId) return null;

      pollingRef.current = true;
      const startedAt = Date.now();

      while (pollingRef.current && Date.now() - startedAt < POLL_TIMEOUT_MS) {
        try {
          const status = await paymentsApi.getPurchaseStatus(purchaseId, token);

          if (status.status === "completed") {
            setStep("succeeded");
            pollingRef.current = false;
            return status;
          }

          if (status.status === "failed" || status.status === "refunded") {
            setErrorMessage("Le paiement n'a pas pu être finalisé.");
            setStep("error");
            pollingRef.current = false;
            return status;
          }
        } catch (error) {
          console.error(error);
          // On continue de tenter plutôt que d'abandonner sur une erreur réseau isolée.
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }

      if (pollingRef.current) {
        // Timeout : le paiement est probablement bon mais le webhook n'a
        // pas encore traité. On ne bloque pas l'utilisateur indéfiniment.
        setErrorMessage(
          "Le paiement a été reçu mais l'accès met plus de temps que prévu à s'activer. Rechargez la page dans quelques instants.",
        );
        setStep("error");
      }

      pollingRef.current = false;
      return null;
    }, [token, purchaseId]);

  return {
    step,
    clientSecret,
    purchaseId,
    errorMessage,
    startCheckout,
    confirmSucceeded,
    waitForEnrollment,
    reset,
  };
}
