"use client";

import { useRef, useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Loader2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayment } from "@/hooks/payment/use-payment";

interface PaymentFormProps {
  payment: ReturnType<typeof usePayment>;
  onSuccess?: () => void;
}

export function PaymentForm({ payment, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
const submittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  if (!stripe || !elements || submittingRef.current || isPolling) return;
    submittingRef.current = true;

    setSubmitting(true);
    setLocalError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/checkout/return`,
      },
    });

    if (error) {
      setLocalError(error.message ?? "Le paiement a échoué. Veuillez réessayer.");
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      payment.confirmSucceeded();
      const finalStatus = await payment.waitForEnrollment();
      setSubmitting(false);
      if (finalStatus?.status === "completed") {
        onSuccess?.();
      }
      return;
    }
    setLocalError("Le paiement est en cours de traitement. Veuillez patienter.");
    setSubmitting(false);
  };

  const isPolling = payment.step === "polling";
  const isBusy = submitting || isPolling;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="min-h-50">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {(localError || (payment.step === "error" && payment.errorMessage)) && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive font-medium">
          {localError ?? payment.errorMessage}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isBusy}
        className="h-12 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors rounded-xl flex items-center justify-center gap-2 text-base shadow-sm disabled:opacity-50"
      >
        {isBusy ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {isPolling ? "Activation de vos accès…" : "Validation du paiement…"}
          </>
        ) : (
          <>
            <LockKeyhole className="h-4 w-4" />
            Payer et commencer la formation
          </>
        )}
      </Button>
    </form>
  );
}