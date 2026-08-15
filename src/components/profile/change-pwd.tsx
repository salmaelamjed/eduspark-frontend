"use client";

import { FormEvent, useState, useMemo } from "react";
import { SaveButton } from "../../../app/profile/page";
import { type ChangePasswordInput } from "@/schema/profile.schema";
import { Input } from "../ui/input";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChangePassword } from "@/hooks/profile/use-change-password";

const EMPTY_VALUES: ChangePasswordInput = {
  current_password: "",
  password: "",
  password_confirmation: "",
};

export function ChangePassword({ token }: { token: string | null | undefined }) {
  const [values, setValues] = useState<ChangePasswordInput>(EMPTY_VALUES);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { submit, status, fieldErrors } = useChangePassword({
    token,
    onSuccess: () => setValues(EMPTY_VALUES),
  });

  const passwordRequirements = useMemo(() => {
    const pwd = values.password;
    return [
      { label: "Au moins 8 caractères", met: pwd.length >= 8 },
      { label: "Une lettre majuscule", met: /[A-Z]/.test(pwd) },
      { label: "Un chiffre", met: /[0-9]/.test(pwd) },
      { label: "Un caractère spécial", met: /[^A-Za-z0-9]/.test(pwd) },
    ];
  }, [values.password]);

  const strengthScore = useMemo(() => {
    if (!values.password) return 0;
    return passwordRequirements.filter((req) => req.met).length;
  }, [passwordRequirements, values.password]);

  const strengthConfig = useMemo(() => {
    switch (strengthScore) {
      case 1:
        return { label: "Faible", color: "bg-red-500", textColor: "text-red-500", width: "w-1/4" };
      case 2:
        return { label: "Moyen", color: "bg-amber-500", textColor: "text-amber-500", width: "w-1/2" };
      case 3:
        return { label: "Bon", color: "bg-blue-500", textColor: "text-blue-500", width: "w-3/4" };
      case 4:
        return { label: "Fort", color: "bg-emerald-500", textColor: "text-emerald-500", width: "w-full" };
      default:
        return { label: "", color: "bg-muted", textColor: "", width: "w-0" };
    }
  }, [strengthScore]);

  const isMatching = useMemo(() => {
    if (!values.password_confirmation) return null;
    return values.password === values.password_confirmation;
  }, [values.password, values.password_confirmation]);

  const isFormReady = useMemo(() => {
    return (
      values.current_password.trim().length > 0 &&
      strengthScore === passwordRequirements.length &&
      isMatching === true
    );
  }, [values.current_password, strengthScore, passwordRequirements.length, isMatching]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormReady) return;
    void submit(values);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Colonne Gauche : Titre et Description */}
        <div className="md:col-span-4 lg:col-span-5 space-y-1">
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            Changer le mot de passe
          </h3>
          <p className="text-sm text-muted-foreground">
            Réinitialisez votre mot de passe de compte
          </p>
        </div>

        {/* Colonne Droite : Formulaire */}
        <div className="md:col-span-8 lg:col-span-7 space-y-4 max-w-lg">

          {/* 1. Mot de passe actuel */}
          <div className="space-y-1">
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={values.current_password}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, current_password: e.target.value }))
                }
                className={cn(
                  "outline-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-300 focus:border-gray-400 mt-2",
                  fieldErrors.current_password && "border-destructive focus:border-destructive/50",
                )}
                placeholder="Mot de passe actuel"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors p-1"
                aria-label={showCurrentPassword ? "Masquer" : "Afficher"}
              >
                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {fieldErrors.current_password && (
              <p className="text-xs text-destructive font-medium px-1">
                {fieldErrors.current_password}
              </p>
            )}
          </div>

          {/* 2. Nouveau mot de passe */}
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={values.password}
                onChange={(e) => setValues((prev) => ({ ...prev, password: e.target.value }))}
                className={cn(
                  "outline-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-300 focus:border-gray-400 mt-2",
                  fieldErrors.password && "border-destructive focus:border-destructive/50",
                )}
                placeholder="Nouveau mot de passe"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors p-1"
                aria-label={showNewPassword ? "Masquer" : "Afficher"}
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Indicateur de force */}
            {values.password.length > 0 && (
              <div className="space-y-1.5 pt-1 px-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Force du mot de passe</span>
                  <span className={cn("font-medium", strengthConfig.textColor)}>
                    {strengthConfig.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      strengthConfig.color,
                      strengthConfig.width,
                    )}
                  />
                </div>

                {/* Exigences du mot de passe */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2">
                  {passwordRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      {req.met ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                      )}
                      <span
                        className={cn(
                          req.met ? "text-foreground font-medium" : "text-muted-foreground",
                        )}
                      >
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {fieldErrors.password && (
              <p className="text-xs text-destructive font-medium px-1">{fieldErrors.password}</p>
            )}
          </div>

          {/* 3. Confirmation du mot de passe */}
          <div className="space-y-1">
            <div className="relative">
              <Input
                id="password-confirmation"
                type={showConfirmPassword ? "text" : "password"}
                value={values.password_confirmation}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, password_confirmation: e.target.value }))
                }
                className={cn(
                  "outline-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-300 focus:border-gray-400 mt-2",
                  isMatching === false && "border-destructive focus:border-destructive",
                  isMatching === true && "border-emerald-500/50",
                )}
                placeholder="Confirmer le mot de passe"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors p-1"
                aria-label={showConfirmPassword ? "Masquer" : "Afficher"}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Validation visuelle de la correspondance */}
            {isMatching !== null && (
              <p
                className={cn(
                  "text-xs font-medium flex items-center gap-1.5 pt-1 px-1",
                  isMatching ? "text-emerald-500" : "text-destructive",
                )}
              >
                {isMatching ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Les mots de passe correspondent
                  </>
                ) : (
                  <>
                    <X className="h-3.5 w-3.5" /> Les mots de passe ne correspondent pas
                  </>
                )}
              </p>
            )}

            {fieldErrors.password_confirmation && (
              <p className="text-xs text-destructive font-medium px-1">
                {fieldErrors.password_confirmation}
              </p>
            )}
          </div>

          <div className="pt-2">
            <SaveButton
              status={status === "loading" ? "saving" : status}
              label="Changer le mot de passe"
              disabled={!isFormReady}
              className="w-full rounded-sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;