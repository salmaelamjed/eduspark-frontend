'use client';

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2, MailCheck, CheckCircle2, XCircle } from "lucide-react";
import { UserVerifyEmail } from "@/hooks/sign-up/use-verify-email";
import { Controller } from "react-hook-form";

const VerifyOTP = () => {
  const {
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
  } = UserVerifyEmail();

  const {
    control,
    formState: { errors },
    watch,
  } = methods;
  const otpValue = watch("code") ?? "";
  const currentEmail = localStorage.getItem("pending_verification_email") || "";

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/10 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <Image
              src="/images/EduSparkL.svg"
              alt="EduSpark Logo"
              width={200}
              height={100}
            />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Vérifie ton email
          </h2>
          <p className="text-muted-foreground">
            On {"t'a"} envoyé un code à 6 chiffres pour confirmer ton inscription. Entre-le ci-dessous pour activer ton compte EduSpark.
          </p>
        </div>
      </div>

      {/* Right side - OTP Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <MailCheck className="h-8 w-8 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Code de vérification
            </h1>
            <p className="text-muted-foreground">
              On a envoyé un code à <span className="font-medium text-foreground">{currentEmail}</span>
            </p>
          </div>

          <form onSubmit={onHandleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <InputOTP
                      maxLength={6}
                      {...field}
                      containerClassName="group flex items-center"
                      autoFocus
                    >
                      <InputOTPGroup className="gap-3">
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="h-12 w-12 text-lg text-center border-orange-200 focus:border-orange-500"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />

                {errors.code && (
                  <p className="text-sm text-red-600 text-center mt-2">
                    {errors.code.message}
                  </p>
                )}

                <p className="text-sm text-muted-foreground mt-4">
                  Le code expire dans 30 minutes.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-400 hover:cursor-pointer"
                disabled={loading || otpValue.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Vérification en cours...
                  </>
                ) : (
                  <>
                    Vérifier mon email
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground space-y-2">
            <p>
              Tu {"n'as"} pas reçu le code ?{" "}
              <button
                type="button"
                onClick={onResendCode}
                disabled={resendLoading || cooldown > 0}
                className="text-orange-500 hover:underline font-medium border-none cursor-pointer p-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
              >
                {cooldown > 0 ? `Renvoyer dans ${cooldown}s` : "Renvoyer le code"}
              </button>
            </p>

            <p>
              Tu as déjà vérifié ?{" "}
              <Link href="/sign-in" className="text-orange-500 hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Modal de statut du renvoi de code */}
      <Dialog open={resendModalOpen} onOpenChange={closeResendModal}>
        <DialogContent className="sm:max-w-sm text-center">
          <DialogHeader className="items-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
              {resendStatus === "loading" && (
                <Loader2 className="h-7 w-7 text-orange-500 animate-spin" />
              )}
              {resendStatus === "success" && (
                <CheckCircle2 className="h-7 w-7 text-green-500" />
              )}
              {resendStatus === "error" && (
                <XCircle className="h-7 w-7 text-red-500" />
              )}
            </div>
            <DialogTitle>
              {resendStatus === "loading" && "Envoi en cours"}
              {resendStatus === "success" && "Code envoyé"}
              {resendStatus === "error" && "Échec de l'envoi"}
            </DialogTitle>
            <DialogDescription>{resendMessage}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerifyOTP;