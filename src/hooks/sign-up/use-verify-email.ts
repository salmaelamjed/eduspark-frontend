import { authApi } from "@/api/auth";
import { getErrorMessage } from "@/components/ErrorMessage";
import { VerifyEmailProps, VerifyEmailSchema } from "@/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";



const RESEND_COOLDOWN = 60;
const AUTO_CLOSE_DELAY = 2000;
type ResendStatus = "idle" | "loading" | "success" | "error";

export const UserVerifyEmail = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);
  // --- état du modal de renvoi ---
  const [resendModalOpen, setResendModalOpen] = useState(false);
  const [resendStatus, setResendStatus] = useState<ResendStatus>("idle");
  const [resendMessage, setResendMessage] = useState<string>("");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const methods = useForm<VerifyEmailProps>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      code: "",
      email: localStorage.getItem("pending_verification_email") || "",
    },
    mode: "onChange",
  });

  // Démarre le compte à rebours après un renvoi réussi
  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

 const onHandleSubmit = methods.handleSubmit(async (values) => {
   setLoading(true);

   try {
     const response = await authApi.verifyEmail({
       code: values.code,
       email: values.email,
     });
     if (response?.success === true) {
       toast.success(response.message);
       localStorage.removeItem("pending_verification_email");
       router.push("/sign-in");
       router.refresh();
       return;
     }
     setLoading(false);
   } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Code invalide ou expiré. Réessayez."),
      );

     setLoading(false); 
   }
 });

  const onResendCode = async () => {
    const email = localStorage.getItem("pending_verification_email");
    if (!email || resendLoading || cooldown > 0) return;

    setResendStatus("loading");
    setResendMessage("Envoi du nouveau code en cours...");
    setResendModalOpen(true);

    try {
      const response = await authApi.resendVerificationCode({ email });
      setResendStatus("success");
      setResendMessage(
        response?.message || "Nouveau code envoyé avec succès !",
      );
      startCooldown();
    } catch (error: unknown) {
      setResendStatus("error");
      setResendMessage(
        getErrorMessage(
          error,
          "Impossible de renvoyer le code. Réessayez plus tard.",
        ),
      );
    } finally {
      setResendLoading(false);
      // Fermeture auto après un court délai, seulement si ce n'est plus en chargement
      closeTimeoutRef.current = setTimeout(() => {
        setResendModalOpen(false);
      }, AUTO_CLOSE_DELAY);
    }
   };

   const closeResendModal = () => {
     if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
     setResendModalOpen(false);
   };

   return {
     methods,
     onHandleSubmit,
     onResendCode,
     loading,
     resendLoading,
     cooldown,
     resendModalOpen,
     resendStatus,
     resendMessage,
     closeResendModal,
   };
};