"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { usePayment } from "@/hooks/payment/use-payment";
import { PaymentForm } from "./payment-form";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

let stripePromise: Promise<Stripe | null> | null = null;
function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
}

interface CourseCheckoutProps {
  courseId: number | string;
  courseTitle: string;
  price: number;
  currency: string;
  image: string | null;
  domain: string | undefined;
  onSuccess?: () => void;
}

export function CourseCheckout({ courseId, onSuccess }: CourseCheckoutProps) {
  const payment = usePayment();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    payment.startCheckout(courseId);
  }, [courseId]);

  const options = useMemo(
    () =>
      payment.clientSecret
        ? { clientSecret: payment.clientSecret, appearance: { theme: "stripe" as const } }
        : undefined,
    [payment.clientSecret],
  );

  // ✅ NEW: Handle already_processed case
  if (payment.step === "already_processed") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="rounded-full bg-emerald-50 p-3 dark:bg-emerald-950/30">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Paiement déjà effectué
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Vous avez déjà réglé ce cours. L'accès va être activé...
          </p>
        </div>
        {payment.purchaseId && (
          <Button
            onClick={() => payment.waitForEnrollment()}
            className="mt-2 bg-orange-500 hover:bg-orange-600 text-white"
          >
            Vérifier mes accès
          </Button>
        )}
      </div>
    );
  }

  if (payment.step === "creating_intent" || payment.step === "idle") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
        <p className="text-sm">Initialisation de la passerelle sécurisée…</p>
      </div>
    );
  }

  if (payment.step === "error" && !payment.clientSecret) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 py-8 px-4 text-center">
        <AlertCircle className="h-6 w-6 text-destructive" />
        <p className="text-sm font-medium text-destructive">{payment.errorMessage}</p>
        <button
          onClick={() => payment.startCheckout(courseId)}
          className="text-sm font-semibold text-orange-500 hover:underline"
        >
          Réessayer l'opération
        </button>
      </div>
    );
  }

  if (payment.step === "polling" || payment.step === "succeeded") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
        <p className="text-sm">
          {payment.step === "polling" 
            ? "Vérification de votre paiement…" 
            : "Paiement confirmé ! Activation de vos accès…"}
        </p>
      </div>
    );
  }

  if (payment.step === "ready" && payment.clientSecret && options) {
    return (
      <Elements stripe={getStripe()} options={options}>
        <PaymentForm payment={payment} onSuccess={onSuccess} />
      </Elements>
    );
  }

  return null;
}