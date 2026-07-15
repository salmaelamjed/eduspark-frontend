"use client";

import { useEffect, useMemo, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { usePayment } from "@/hooks/payment/use-payment";
import { PaymentForm } from "./payment-form";
import { Loader2, AlertCircle } from "lucide-react";

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
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true);
      payment.startCheckout(courseId);
      
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [hasStarted, courseId, payment]);

  const options = useMemo(
    () =>
      payment.clientSecret
        ? { clientSecret: payment.clientSecret, appearance: { theme: "stripe" as const } }
        : undefined,
    [payment.clientSecret],
  );

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
          Réessayer {"l'opération"}
        </button>
      </div>
    );
  }

  if (payment.step === "polling" || payment.step === "succeeded") {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      <p className="text-sm">Vérification de votre paiement…</p>
    </div>
  );
}
if (!payment.clientSecret || !options) return null;
  
  return (
    <Elements stripe={getStripe()} options={options}>
      <PaymentForm payment={payment} onSuccess={onSuccess} />
    </Elements>
  );
}