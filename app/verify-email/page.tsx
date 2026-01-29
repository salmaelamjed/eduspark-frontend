'use client';

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2, MailCheck } from "lucide-react";
import { UserVerifyEmail } from "@/hooks/sign-up/use-verify-email";
import { ButtonGroup } from "@/components/ui/button-group";

const VerifyOTP = () => {
  const {
    methods,
    onHandleSubmit,
    onResendCode,
    loading,
    resendLoading,
  } = UserVerifyEmail();
  const {
    register,
    formState: { errors },
    watch
  } = methods;
  const currentEmail = localStorage.getItem("pending_verification_email") || "";


  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding (identique aux autres pages) */}
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
              On a envoyé un code à <span className="font-medium text-foreground">{currentEmail }</span>
            </p>
          </div>

          <form onSubmit={onHandleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <InputOTP
                  maxLength={6}
                  {...register('code')}
                  containerClassName="group flex items-center"
                  autoFocus
                >
                  <InputOTPGroup className="gap-3">
                    <InputOTPSlot index={0} className="h-12 w-12 text-lg text-center border-orange-200 focus:border-orange-500" />
                    <InputOTPSlot index={1} className="h-12 w-12 text-lg text-center border-orange-200 focus:border-orange-500" />
                    <InputOTPSlot index={2} className="h-12 w-12 text-lg text-center border-orange-200 focus:border-orange-500" />
                    <InputOTPSlot index={3} className="h-12 w-12 text-lg text-center border-orange-200 focus:border-orange-500" />
                    <InputOTPSlot index={4} className="h-12 w-12 text-lg text-center border-orange-200 focus:border-orange-500" />
                    <InputOTPSlot index={5} className="h-12 w-12 text-lg text-center border-orange-200 focus:border-orange-500" />
                  </InputOTPGroup>
                </InputOTP>
                {errors.code && (
                  <p className="text-sm text-red-600 text-center">
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
                disabled={loading || watch('code').length !== 6}
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
              Tu  {"n'as"} pas reçu le code ?{" "}
              <Button
                onClick={onResendCode}
                disabled={resendLoading}
                className="text-orange-500 hover:underline font-medium bg-transparent border-none cursor-pointer p-0"
              >
                {resendLoading ? (
                      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Chargement de la session...</p>
        </div>
      </div>
                  ) : (
                    'Renvoyer le code'
                  )}
              </Button>
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
    </div>
  );
};

export default VerifyOTP;